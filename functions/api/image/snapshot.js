const jwt = require('@tsndr/cloudflare-worker-jwt')
//include the UUID generator
var uuid = require('uuid');

//jwt decoder
let decodeJwt = async (req, secret) => {
    //get the bearer token
    let bearer = req.get('authorization');
    //check they sent a bearer token
    if (bearer == null) {
        //send blank
        return ("")
    } else {
        //check if its a bearer token
        try {
            let details = await jwt.decode(bearer, secret)
            return (details)
        } catch (error) {
            console.log(error)
            return ("")
        }

    }


}


let getSnapShot = async (theUrl, snapshotItem, headlessUrl, preview, projectDataId, context, projectId) => {
    //output
    if (preview == 0)
        console.log(`processing ${snapshotItem.browserDefault} : ${snapshotItem.height} : ${snapshotItem.width} : ${snapshotItem.agentName}`)
    else
        console.log(`processing preview ${snapshotItem.browserDefault} : ${snapshotItem.height} : ${snapshotItem.width} : ${snapshotItem.agentName}`)

    //build the call
    const jsonData = {
        url: theUrl,
        "options": {
            "fullPage": true
        },
        "gotoOptions": {
            "waitUntil": "networkidle2",
        },
        viewport: {
            width: snapshotItem.height,
            height: snapshotItem.width,
        }
    };
    //make the call
    const response = await fetch(headlessUrl, {
        method: 'POST',
        headers: {
            'Cache-Control': 'no-cache',
            "Content-Type": "application/json",
            'User-Agent': snapshotItem.agentName
        },
        body: JSON.stringify(jsonData)
    });
    //get the repsonse
    const imageArrayBuffer = await response.arrayBuffer();
    const imageUint8Array = new Uint8Array(imageArrayBuffer);
    //save it to KV
    const KV = context.env.datastore
    const kvId = `${projectId}-${uuid.v4()}`;
    await KV.put(kvId, imageUint8Array);
    //update the one that is currently the lates to be the baseline
    // '${snapshotItem.width}','${snapshotItem.height}','${snapshotItem.browserDefault}','${snapshotItem.browserName}','${snapshotItem.browserOs}

    if (preview == 0) {
        //reset the baseline
        let theSQL = `update projectImages SET isBaseline = '0' where projectId = '${projectId}' and projectDataId = '${projectDataId}' and screenWidth ='${snapshotItem.width}' and screenHeight='${snapshotItem.height}' and browserDefault='${snapshotItem.browserDefault}' and browserName ='${snapshotItem.browserName}' and browserOs = '${snapshotItem.browserOs}'`
        //console.log(theSQL);
        const isBaselineResult = await context.env.DB.prepare(theSQL).run();

        //set the baseline
        theSQL = `update projectImages SET 'isLatest' = '0','isBaseline' = '1' where isLatest = '1' and projectId = '${projectId}' and projectDataId = '${projectDataId}' and screenWidth ='${snapshotItem.width}' and screenHeight='${snapshotItem.height}' and browserDefault='${snapshotItem.browserDefault}' and browserName ='${snapshotItem.browserName}' and browserOs = '${snapshotItem.browserOs}'`
        //console.log(theSQL);
        const isLatestResult = await context.env.DB.prepare(theSQL).run();

        //add it to the database (make it the latest)
        theSQL = `INSERT INTO projectImages ('projectId','projectDataId','kvId','baseUrl','draft','screenWidth','screenHeight','browserDefault','browserName','browserOs','isLatest') VALUES ('${projectId}','${projectDataId}','${kvId}','${theUrl}',0,'${snapshotItem.width}','${snapshotItem.height}','${snapshotItem.browserDefault}','${snapshotItem.browserName}','${snapshotItem.browserOs}','1')`
        const insertResult = await context.env.DB.prepare(theSQL).run();

    } else {
        //reset the preview
        let theSQL = `update projectImages SET isPreview= '0' where projectId = '${projectId}' and projectDataId = '${projectDataId}' and screenWidth ='${snapshotItem.width}' and screenHeight='${snapshotItem.height}' and browserDefault='${snapshotItem.browserDefault}' and browserName ='${snapshotItem.browserName}' and browserOs = '${snapshotItem.browserOs}'`
        //console.log(theSQL);
        const isPreviewResult = await context.env.DB.prepare(theSQL).run();
        //add it to the database (make it the latest)
        theSQL = `INSERT INTO projectImages ('projectId','projectDataId','kvId','baseUrl','draft','screenWidth','screenHeight','browserDefault','browserName','browserOs','isPreview') VALUES ('${projectId}','${projectDataId}','${kvId}','${theUrl}',0,'${snapshotItem.width}','${snapshotItem.height}','${snapshotItem.browserDefault}','${snapshotItem.browserName}','${snapshotItem.browserOs}','1')`
        const insertResult = await context.env.DB.prepare(theSQL).run();
    }

    return (kvId)
}

export async function onRequestGet(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let token = await decodeJwt(request.headers, env.SECRET);
    //check its valid
    if (token == "") {
        return new Response(JSON.stringify({ error: "not authorised to update records" }), { status: 400 });
    } else {
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the preview
        const preview = searchParams.get('preview');
        //get the project dataid
        const projectDataId = searchParams.get('projectDataId');
        //get the project ID
        const projectId = searchParams.get('projectId');
        //set the URL
        const headlessUrl = `https://chrome.browserless.io/screenshot?token=${env.BROWSERLESSTOKEN}`;
        if (env.BROWSERLESSTOKEN == undefined)
            return new Response(JSON.stringify({ error: "browser token not set" }), { status: 400 });
        //get the URL 
        const query = context.env.DB.prepare(`SELECT name,url,previewUrl from projectData where projectId = '${projectId}' and id = '${projectDataId}' and isDeleted = 0`);
        const queryResult = await query.first();
        //console.log(`SELECT name,url,previewUrl from projectData where projectId = '${projectId}' and id = '${projectDataId}' and isDeleted = 0`)
        //set a snapshot array
        let snapshotArray = [];
        const query2 = context.env.DB.prepare(`SELECT userBrowserId,screenWidth,screenHeight,browserDefault,browserName,browserOs from projectSnapShots where projectSnapShots.projectId = '${projectId}' and projectSnapShots.isDeleted = 0 and projectSnapShots.isActive=1`);
        const viewportResults = await query2.all();

        //loop through the results and build the pages / viewports to be fetched
        for (var i = 0; i < viewportResults.results.length; ++i) {
            //get the browser data
            const theQuery = `SELECT agentName from userAgents where userBrowserId = '${viewportResults.results[i].userBrowserId}'`;
            const query2 = context.env.DB.prepare(theQuery);
            const queryResult2 = await query2.first();
            //set the snapshot
            let snapshot = {};
            snapshot.height = viewportResults.results[i].screenHeight;
            snapshot.width = viewportResults.results[i].screenWidth;
            //add the browser info to it
            snapshot.browserDefault = viewportResults.results[i].browserDefault;
            snapshot.browserName = viewportResults.results[i].browserName;
            snapshot.browserOs = viewportResults.results[i].browserOs;
            snapshot.agentName = queryResult2.agentName;
            //add it to the array
            snapshotArray.push(snapshot);
            //console.log(snapshot);
            //return;
        }
        //set an array
        let finArray = [];
        //loop through them

        for (var i = 0; i < snapshotArray.length; ++i) {

            const kvId = await getSnapShot(queryResult.url, snapshotArray[i], headlessUrl, 0, projectDataId, context, projectId);
            const theJson = { "width": snapshotArray[i].width, "height": snapshotArray[i].height, "browserDefault": snapshotArray[i].browserDefault, "browserName": snapshotArray[i].browserName, "browserOs": snapshotArray[i].browserOs, "agentName": snapshotArray[i].agentName, "imageId": kvId }
            //add it to the array
            finArray.push(theJson)
            if ((preview == 1) && (queryResult.previewUrl != null)) {
                const kvId = await getSnapShot(queryResult.previewUrl, snapshotArray[i], headlessUrl, 1, projectDataId, context, projectId);
                const theJson = { "width": snapshotArray[i].width, "height": snapshotArray[i].height, "browserDefault": snapshotArray[i].browserDefault, "browserName": snapshotArray[i].browserName, "browserOs": snapshotArray[i].browserOs, "agentName": snapshotArray[i].agentName, "imageId": kvId }
                //add it to the array
                finArray.push(theJson)
            } else {
                console.log('no preview url set')
            }
        }
        // Return the image as the response
        return new Response(JSON.stringify(finArray), { status: 200 });
    }
}
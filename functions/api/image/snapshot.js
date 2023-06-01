const jwt = require('@tsndr/cloudflare-worker-jwt')
//include the UUID generator
var uuid = require('uuid');

//jwt decoder
let decodeJwt = async (req, secret) => {
    //get the bearer token
    let bearer = req.get('authorization');
    //console.log(bearer);
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
        //get the project dataid
        const projectDataId = searchParams.get('projectDataId');
        //get the project ID
        const projectId = searchParams.get('projectId');
        //set the URL
        const headlessUrl = `https://chrome.browserless.io/screenshot?token=${env.BROWSERLESSTOKEN}`;
        if (env.BROWSERLESSTOKEN == undefined)
            return new Response(JSON.stringify({ error: "browser token not set" }), { status: 400 });
        //get the URL 
        const query = context.env.DB.prepare(`SELECT name,url from projectData where projectId = '${projectId}' and id = '${projectDataId}' and isDeleted = 0`);
        const queryResult = await query.first();
        //set a snapshot array
        let snapshotArray = [];
        const query2 = context.env.DB.prepare(`SELECT userBrowserId,screenWidth,screenHeight from projectSnapShots where projectSnapShots.projectId = '${projectId}' and projectSnapShots.isDeleted = 0 and projectSnapShots.isActive=1`);
        const viewportResults = await query2.all();
        //loop through the results and build the pages / viewports to be fetched
        for (var i = 0; i < viewportResults.results.length; ++i) {
            //get the browser data
            const theQuery = `SELECT userBrowsers.browserDefault,userBrowsers.browserName,userBrowsers.browserOs,userAgents.agentName from userBrowsers LEFT JOIN userAgents ON userAgents.userBrowserId = userBrowsers.id where userBrowsers.isDeleted = 0 and userBrowsers.id = ${viewportResults.results[i].userBrowserId} and userAgents.isActive = 1`;
            const query2 = context.env.DB.prepare(theQuery);
            const queryResult2 = await query2.first();
            //set the snapshot
            let snapshot = {};
            snapshot.height = viewportResults.results[i].screenHeight;
            snapshot.width = viewportResults.results[i].screenWidth;
            //add the browser info to it
            snapshot.browserDefault = queryResult2.browserDefault;
            snapshot.browserName = queryResult2.browserName;
            snapshot.browserOs = queryResult2.browserOs;
            snapshot.agentName = queryResult2.agentName;
            //add it to the array
            snapshotArray.push(snapshot);
        }
        //set an array
        let finArray = [];
        //loop through them
        for (var i = 0; i < snapshotArray.length; ++i) {
            //output
            console.log(`processing ${snapshotArray[i].browserDefault} : ${snapshotArray[i].height} : ${snapshotArray[i].width} : ${snapshotArray[i].agentName}`)
            //build the call
            const jsonData = {
                url: queryResult.url,
                "options": {
                    "fullPage": true
                },
                "gotoOptions": {
                    "waitUntil": "networkidle2",
                },
                viewport: {
                    width: snapshotArray[i].height,
                    height: snapshotArray[i].width,
                }
            };
            //make the call
            const response = await fetch(headlessUrl, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    "Content-Type": "application/json",
                    'User-Agent': snapshotArray[i].agentName
                },
                body: JSON.stringify(jsonData)
            });
            //get the repsonse
            const imageArrayBuffer = await response.arrayBuffer();
            const imageUint8Array = new Uint8Array(imageArrayBuffer);
            //save it to KV
            const KV = context.env.backpage;
            const KvId = `${projectId}-${uuid.v4()}`;
            await KV.put(KvId, imageUint8Array);
            //add it to the database
                        /*
      snapshot.height = viewportResults.results[i].screenHeight;
            snapshot.width = viewportResults.results[i].screenWidth;
            //add the browser info to it
            snapshot.browserDefault = queryResult2.browserDefault;
            snapshot.browserName = queryResult2.browserName;
            snapshot.browserOs = queryResult2.browserOs;
            snapshot.agentName = queryResult2.agentName;

            */
            const theSQL = `INSERT INTO projectImages ('projectId','projectDataId','kvId','baseUrl','draft','screenWidth','screenHeight','browserDefault','browserName','browserOs') VALUES ('${projectId}','${projectDataId}','${KvId}','${queryResult.url}',0,'${snapshotArray[i].width}','${snapshotArray[i].height}','${snapshotArray[i].browserDefault}','${snapshotArray[i].browserName}','${snapshotArray[i].browserOs}')`
            const insertResult = await context.env.DB.prepare(theSQL).run();
           
            //add the id the snapshot 
            //we could add it directly but we may use this array somewhere else so good to keep it all together
            snapshotArray[i].kvId = KvId
            //add it to the return array

            const theJson = {"width":snapshotArray[i].width,"height":snapshotArray[i].height,"browserDefault": snapshotArray[i].browserDefault,"browserName": snapshotArray[i].browserName,"browserOs": snapshotArray[i].browserOs,"agentName": snapshotArray[i].agentName,"imageId": snapshotArray[i].kvId}
            //add it to the array
            finArray.push(theJson)   
        }
        // Return the image as the response
        return new Response(JSON.stringify(finArray), { status: 200 });
    }
}
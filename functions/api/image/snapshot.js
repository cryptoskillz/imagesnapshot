const jwt = require('@tsndr/cloudflare-worker-jwt')
//include the UUID generator
var uuid = require('uuid');
/*
    this is a list of user agents we may add this to the settings or a database later 
    but for now it is ok here
*/
const userAgents = [
    // Chrome
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
    // Firefox
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:93.0) Gecko/20100101 Firefox/93.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:93.0) Gecko/20100101 Firefox/93.0",
    // Safari
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15",
    // Edge
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 Edg/94.0.992.50",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 OPR/80.0.4170.72",
];

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

        //get th project dataid
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
        const query2 = context.env.DB.prepare(`SELECT screenWidth,screenHeight,userAgentId from projectSnapShots where projectId = '${projectId}' and isDeleted = 0`);
        //note change this to all when we updae 
        const viewportResults = await query2.all();
        for (var i = 0; i < viewportResults.results.length; ++i) {
            let snapshot = {};
            //if ((height == "")
            snapshot.height = viewportResults.results[i].screenHeight;
            snapshot.width = viewportResults.results[i].screenWidth;
            //set the user agent
            snapshot.userAgentIndex = userAgents[viewportResults.results[i].userAgentId];
            snapshotArray.push(snapshot);
            //console.log(snapshot);
        }

        let imageIds = [];
        for (var i = 0; i < snapshotArray.length; ++i) {

            console.log(`processing ${snapshotArray[i].height} : ${snapshotArray[i].width} : ${snapshotArray[i].userAgentIndex}`)
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

            const response = await fetch(headlessUrl, {
                method: 'POST',
                headers: {
                    'Cache-Control': 'no-cache',
                    "Content-Type": "application/json",
                    'User-Agent': snapshotArray[i].userAgentIndex
                },
                body: JSON.stringify(jsonData)

            });
            //get the repsonse
            const imageArrayBuffer = await response.arrayBuffer();
            const imageUint8Array = new Uint8Array(imageArrayBuffer);
            //const cfresponse = await response();
            //console.log(imageUint8Array);
            const KV = context.env.backpage;
            const KvId = `${projectId}-${uuid.v4()}`;
            await KV.put(KvId, imageUint8Array);


            const theSQL = `INSERT INTO projectImages ('projectId','projectDataId','kvId','baseUrl','draft') VALUES ('${projectId}','${projectDataId}','${KvId}','${queryResult.url}',0)`
            //console.log(theSQL);
            const insertResult = await context.env.DB.prepare(theSQL).run();
            //console.log(insertResult);
            // Set the response headers
            imageIds.push(KvId);
        }
        //const headers = {
        //    'Content-Type': 'image/png',
        //};

        // Return the image as the response
        return new Response(imageIds, { status: 200 });
    }

}
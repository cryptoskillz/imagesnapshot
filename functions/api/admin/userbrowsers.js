const jwt = require('@tsndr/cloudflare-worker-jwt')


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

export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    try {
        let token = await decodeJwt(request.headers, env.SECRET);
        if (token == "") {
            return new Response(JSON.stringify({ error: "not allowed to see the users browsers" }), { status: 400 });
        } else {
            //get the search paramaters
            const { searchParams } = new URL(request.url);
            //get the project ID
            const projectId = searchParams.get('projectId');
            //get the useragents
            const theQuery = `SELECT userBrowserId,screenWidth,screenHeight from projectSnapShots where projectSnapShots.isDeleted = 0 and projectSnapShots.projectId = ${projectId}`
            const query = context.env.DB.prepare(theQuery);
            const queryResults = await query.all();
            //loop through the user agents
            for (var i = 0; i < queryResults.results.length; ++i) {
                const theQuery = `SELECT userBrowsers.browserDefault,userBrowsers.browserName,userBrowsers.browserOs,userAgents.agentName from userBrowsers LEFT JOIN userAgents ON userAgents.userBrowserId = userBrowsers.id where userBrowsers.isDeleted = 0 and userBrowsers.id = ${queryResults.results[i].userBrowserId} and userAgents.isActive = 1`;
                const query2 = context.env.DB.prepare(theQuery);
                const queryResult2 = await query2.first();
                //add them to the snapshot array
                queryResults.results[i].browserDefault = queryResult2.browserDefault;
                queryResults.results[i].browserName = queryResult2.browserName;
                queryResults.results[i].browserOs = queryResult2.browserOs;
                queryResults.results[i].agentName = queryResult2.agentName;
            }
            //return them
            return new Response(JSON.stringify(queryResults.results), { status: 200 });
        }
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error), { status: 200 });
    }
}
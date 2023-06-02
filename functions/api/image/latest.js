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

    //get the search paramaters
    const { searchParams } = new URL(request.url);
    //get the project ID
    const projectId = searchParams.get('projectId');
    //get the projectdatid
    const projectDataId = searchParams.get('projectDataId');
    const query = context.env.DB.prepare(`SELECT name,url from projectData where projectId = '${projectId}' and id = '${projectDataId}' and isDeleted = 0`);
    const queryResult = await query.first();
    //set a snapshot array
    let snapshotArray = [];
    const query2 = context.env.DB.prepare(`SELECT userBrowserId,screenWidth,screenHeight from projectSnapShots where projectSnapShots.projectId = '${projectId}' and projectSnapShots.isDeleted = 0 and projectSnapShots.isActive=1`);
    const viewportResults = await query2.all();

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
    return new Response(JSON.stringify(snapshotArray), { status: 200 });
}
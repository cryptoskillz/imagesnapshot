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
    const query2 = context.env.DB.prepare(`SELECT userBrowserId,viewportWidth,viewportHeight,browserDefault,browserName,browserOs from projectSnapShots where projectSnapShots.projectId = '${projectId}' and projectSnapShots.isDeleted = 0 and projectSnapShots.isActive=1`);
    const viewportResults = await query2.all();
    for (var i = 0; i < viewportResults.results.length; ++i) {
        //set the snapshot
        let snapshot = {};
        snapshot.projectName = queryResult.name;
        snapshot.projectUrl = queryResult.url;
        snapshot.height = viewportResults.results[i].viewportWidth;
        snapshot.width = viewportResults.results[i].viewportHeight;
        //add it to the array
        snapshotArray.push(snapshot);
    }
    //get the comments
    const query3 = context.env.DB.prepare(`SELECT id,comment from projectComments where projectId = '${projectId}' and projectDataId = '${projectDataId}' and isDeleted = 0 and isResolved = 0`);
    const queryResult3 = await query3.all();
    //add it the json object    
    let res = {}
    res.snapshot = snapshotArray;
    res.comments = queryResult3.results;
    //return it.
    return new Response(JSON.stringify(res), { status: 200 });
}
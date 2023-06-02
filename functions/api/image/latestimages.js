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
    //get the snapshot data
    let snapshot = searchParams.get('snapshot');
    snapshot = JSON.parse(snapshot);
    //get the baseline
    const theQuery = `SELECT kvId from projectImages where projectId = '${projectId}' and isDeleted = 0 and screenWidth = '${snapshot.width}' and screenHeight = '${snapshot.height}' and browserDefault = '${snapshot.browserDefault}' and browserName = '${snapshot.browserName}' and browserOs = '${snapshot.browserOs}'`
    const query = context.env.DB.prepare(theQuery);
    const queryResults = await query.all();
    let theJson = {}
    //debug
    //console.log(queryResults.results)
    //console.log(queryResults.results.length)
    //console.log(queryResults.results[queryResults.results.length-1])
    //console.log(queryResults.results[queryResults.results.length-2])
    //check we have some data
    if (queryResults.results.length == 0)
        return new Response(JSON.stringify({ error: "no snapshots" }), { status: 200 });
    else {
        //check if we have only one result and return snapshot
        if (queryResults.results.length == 1) {
            theJson.latestId = queryResults.results[queryResults.results.length-1].kvId
            theJson.baselineId = ""

        } else {
            //else return the snapshot and the baseline
            //note the baseline is always the second to last image maybe using an offset will work better here
            theJson.latestId = queryResults.results[queryResults.results.length-1].kvId
            theJson.baselineId = queryResults.results[queryResults.results.length-2].kvId
        }

    }
    //return it
    return new Response(JSON.stringify(theJson), { status: 200 });
}
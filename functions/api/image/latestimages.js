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
    //check we have ran at least twice so we have a base line
    if (queryResults.results.length < 2) {
        return new Response(JSON.stringify({ error: "not enough images for a baseline" }), { status: 200 });
    } 
    else
    {
        let theJson = {}
        theJson.baselineId=queryResults.results[queryResults.results.length - 2].kvId
        theJson.latestId=queryResults.results[queryResults.results.length - 1].kvId
        return new Response(JSON.stringify(theJson), { status: 200 });
    }

}
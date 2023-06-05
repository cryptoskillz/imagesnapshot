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
    /*
    const { searchParams } = new URL(request.url);
        //get the project data id
    const projectDataId = searchParams.get('projectDataId');
    //get the project ID
    const projectId = searchParams.get('projectId');

    const theSQL = `SELECT name,url,previewUrl,snapshotId,previewSnapshotId,previousSnapshotId from projectData where projectId = '${projectId}' and id = '${projectDataId}' and isDeleted = 0`
   console.log(theSQL)
    const query = context.env.DB.prepare(theSQL);
    const queryResult = await query.first();
    return new Response(JSON.stringify(queryResult), { status: 200 });
    */

    const { searchParams } = new URL(request.url);
    //get the project data id
    const projectDataId = searchParams.get('projectDataId');
    //get the project ID
    const projectId = searchParams.get('projectId');
    //get the preview
    const preview = searchParams.get('preview');
    //get the snapshot data
    let snapshot = searchParams.get('snapshot');
    snapshot = JSON.parse(snapshot);
    let theJson = {}

    //get the baseline
    let theSQL = `SELECT kvId from projectImages where projectId = '${projectId}' and projectDataId = '${projectDataId}' and isDeleted = 0 and isBaseline = 1 and screenWidth = '${snapshot.width}' and screenHeight = '${snapshot.height}' and browserDefault = '${snapshot.browserDefault}' and browserName = '${snapshot.browserName}' and browserOs = '${snapshot.browserOs}'`
    //console.log(theSQL)
    const query = context.env.DB.prepare(theSQL);
    const queryResult = await query.first();
    //console.log(queryResult)
    theJson.baselineId = ""
    if (queryResult.kvId != null)
        theJson.baselineId = queryResult.kvId

    //get the latest
    theSQL = `SELECT kvId from projectImages where projectId = '${projectId}' and projectDataId = '${projectDataId}' and isLatest = 1 and screenWidth = '${snapshot.width}' and screenHeight = '${snapshot.height}' and browserDefault = '${snapshot.browserDefault}' and browserName = '${snapshot.browserName}' and browserOs = '${snapshot.browserOs}'`
    //console.log(theSQL)
    const query2 = context.env.DB.prepare(theSQL);
    const queryResult2 = await query.first();
    theJson.snapshotId = ""
    if (queryResult2.kvId != null)
        theJson.snapshotId = queryResult2.kvId


    theJson.previewId = ""
    //get the preview 
    if (preview == 0) {
        //get the latest
        const theSQL = `SELECT kvId from projectImages where projectId = '${projectId}' and projectDataId = '${projectDataId}' and isPreview = 1 and screenWidth = '${snapshot.width}' and screenHeight = '${snapshot.height}' and browserDefault = '${snapshot.browserDefault}' and browserName = '${snapshot.browserName}' and browserOs = '${snapshot.browserOs}'`
        //console.log(theSQL)
        const query3 = context.env.DB.prepare(theSQL);
        const queryResult3 = await query.first();

        if (queryResult3.kvId != null)
            theJson.previewId = queryResult3.kvId
    }
    //return it
    return new Response(JSON.stringify(theJson), { status: 200 });

}
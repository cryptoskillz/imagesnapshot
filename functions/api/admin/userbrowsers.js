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
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the project ID
        const projectId = searchParams.get('projectId');
        //get the useragents
        const theQuery = `SELECT userBrowserId,viewportWidth,viewportHeight,browserDefault,browserName,browserOs from projectSnapShots where projectSnapShots.isDeleted = 0 and projectSnapShots.projectId = ${projectId} and isActive=1`
        const query = context.env.DB.prepare(theQuery);
        const queryResults = await query.all();
        //return them
        return new Response(JSON.stringify(queryResults.results), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify(error), { status: 200 });
    }
}
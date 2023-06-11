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
    //get the userBrowserId
    const userBrowserId = searchParams.get('userBrowserId');
    //run the query
    const query = context.env.DB.prepare(`SELECT id,model, platform, viewportWidth, viewportHeight, resolutionWidth, resolutionHeight from displays where userBrowserId = '${userBrowserId}' and isDeleted = 0`);
    //store the results
    const queryResult = await query.all();
    //return it
    return new Response(JSON.stringify(queryResult.results), { status: 200 });
}
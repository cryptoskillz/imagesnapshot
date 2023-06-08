//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    let details = "";
    if (bearer != null) {
        bearer = bearer.replace("Bearer ", "");
        details = await jwt.decode(bearer, secret)
    }
    return (details)
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

    let theToken = await decodeJwt(request.headers, env.SECRET);
    if (theToken == "")
        return new Response(JSON.stringify({ error: "Token required" }), { status: 400 });
    else {
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the preview
        const preview = searchParams.get('preview');
        //get the project dataid
        const projectDataId = searchParams.get('projectDataId');
        //get the project ID
        const projectId = searchParams.get('projectId');

        let theSQL = `SELECT createdAt,kvId,screenWidth,screenHeight,browserOs,browserName,browserDefault,baseUrl from projectImages where projectId = '${projectId}' and projectDataId = '${projectDataId}' and isDeleted = 0`
        const query = context.env.DB.prepare(theSQL);
        const queryResults = await query.all();
        console.log(queryResults.results);

        return new Response(JSON.stringify({ data: queryResults.results }), { status: 200 });
    }
}
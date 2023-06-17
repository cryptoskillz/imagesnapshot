const jwt = require('@tsndr/cloudflare-worker-jwt')
//include the UUID generator
var uuid = require('uuid');

//jwt decoder
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
        //get the preview
        const preview = searchParams.get('preview');
        //get the project ID
        const projectId = searchParams.get('projectId');
        //get the project dataid
        const projectDataId = searchParams.get('projectDataId');
        //delete the comments
        const theSql = `delete from projectComments where projectId = '${projectId}' and projectDataId = '${projectDataId}'`
        const queryDelete = await context.env.DB.prepare(theSql).run();
        //set the URL

        const query = context.env.DB.prepare(`SELECT id FROM projectSnapShots where projectSnapShots.projectId = '${projectId}' and projectSnapShots.isDeleted = 0 and projectSnapShots.isActive=1`);
        const queryResults = await query.all();

       
        // Return the image as the response
        return new Response(JSON.stringify(queryResults.results), { status: 200 });
    }
}
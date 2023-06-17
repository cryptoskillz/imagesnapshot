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

export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        theData = await request.json();
        const theSql = `INSERT INTO projectComments (comment, projectId,projectDataId) VALUES ('${theData.comment}',${theData.projectId},'${theData.projectDataId}' )`
        const query = await context.env.DB.prepare(theSql).run();
        if (query.success == true) {
            let theJson = {}
            theJson.id = query.lastRowId;
            theJson.comment = theData.comment;
            return new Response(JSON.stringify({ record: theJson}), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: `Record has not been added` }), { status: 400 });

        }

    }
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });
}

export async function onRequestDelete(context) {
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
        return new Response(JSON.stringify({ error: "not authorised to resolve comments" }), { status: 400 });
    } else {
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the project ID
        const commentId = searchParams.get('commentId');
        // Return the image as the response
        const theSql = `delete from projectComments where id = '${commentId}'`
        const query = await context.env.DB.prepare(theSql).run();
         //trap the delete actually happened.
         if (query.success == true) {
            return new Response(JSON.stringify({ response: "ok" }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: `Record has not been deleted` }), { status: 400 });
        }
       
    }
}
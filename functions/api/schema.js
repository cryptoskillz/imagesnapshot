const jwt = require('@tsndr/cloudflare-worker-jwt')


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

export async function onRequestPut(context) {
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
        return new Response(JSON.stringify({ error: "not authorised to update schema" }), { status: 400 });
    } else {
        //get the content type
        const contentType = request.headers.get('content-type')
        //set a data array
        let theData;

        //check we have a content type
        if (contentType != null) {
            //get the data
            theData = await request.json();
            //loop through the data
            for (var i = 0; i < theData.schema.length; ++i) {
                //build the update query
                let theQuery = `UPDATE projectSchema SET fieldName = '${theData.schema[i].fieldName}' where id = '${theData.schema[i].id}'`
                //console.log(theQuery);
                const info = await context.env.DB.prepare(theQuery).run();
            }
            //return
            return new Response(JSON.stringify({ message: `The schema has been updated` }), { status: 200 });
        }
    }
}
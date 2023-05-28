/*
    todo:
    trap the gets / puts etc

*/
export async function onRequest(context) {
    try {
        const jwt = require('@tsndr/cloudflare-worker-jwt')
        const {
            request, // same as existing Worker API
            env, // same as existing Worker API
            params, // if filename includes [id] or [[path]]
            waitUntil, // same as ctx.waitUntil in existing Worker API
            next, // used for middleware or to fetch assets
            data, // arbitrary space for passing data between middlewares
        } = context;
        //set a valid boolean
        let valid = 1;
        //get the post data
        //note we know it is application / json i am sending it up as but we could check for all the content types to generalise
        const contentType = request.headers.get('content-type')
        let credentials;
        //check we have a content type
        if (contentType != null) {
            //get the login credentials
            credentials = await request.json();
            //check they are valid (may be overkill)
            if ((credentials.identifier == undefined) || (credentials.password == undefined))
                return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });
        } else
            return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });
        //set up the KV
        const KV = context.env.backpage;
        //see if the user exists
        const user = await KV.get("username" + credentials.identifier);
        //user does not exist
        if (user == null)
            return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });

        let tUser = JSON.parse(user);
        if ((tUser.user.email == credentials.identifier) || (tUser.user.password == credentials.password)) {
            //check if it is valid
            if (valid == 1) {
                //make a JWT token
                const token = await jwt.sign({ password: credentials.password, username: credentials.identifier }, env.SECRET)
                // Verifing token
                const isValid = await jwt.verify(token, env.SECRET)
                if (isValid == true) {
                    ///let json = JSON.stringify({ "jwt": token, "user": { "username": credentials.identifier, "email": credentials.identifier, "secret": tUser.user.secret } })
                    //temp to deal with old accounts will not need going forward
                    //await KV.put("username" + tUser.user.secret , JSON.stringify({username:credentials.identifier}));
                    //await KV.put("username" + credentials.identifier, json);

                    return new Response(JSON.stringify({ "jwt": token, "user": { "username": credentials.identifier, "email": credentials.identifier, "secret": tUser.user.secret } }), { status: 200 });
                } else {
                    return new Response(JSON.stringify({ error: "invalid login" }), { status: 400 });

                }
            }

        } else {
            return new Response(JSON.stringify({ error: "invalid login: username or password incorrect" }), { status: 400 });

        }


    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}
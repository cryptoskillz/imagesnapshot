/*
    todo:

*/
var uuid = require('uuid');
export async function onRequestPost(context) {
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
    const contentType = request.headers.get('content-type')
    let registerData;
    if (contentType != null) {
        //get the login credentials
        registerData = await request.json();
        //set up the KV
        const KV = context.env.backpage;
        //see if the user exists
        let secretid = uuid.v4();
        let json = JSON.stringify({ "jwt": "", "user": {  "username": registerData.username, "email": registerData.username,"secret":secretid } })
        //check if user exist
        const user = await KV.get("username" + registerData.username);
        if (user == null)
        {
            await KV.put("username" + registerData.username, json);
            return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
        }
        else
            return new Response(JSON.stringify({ error: "email exists" }), { status: 400 });

    }
    else
        return new Response(JSON.stringify({ error: "register error" }), { status: 400 });
}
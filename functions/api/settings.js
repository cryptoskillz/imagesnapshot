//hold the payload
let payLoad;
//hold the contenttypes
let contentType;
//settings schema
let settingsSchema = '{"companyname":""}'
//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');


//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    //decode the token
    let details = await decodeJwt(request.headers, env.SECRET);
    //get the company name
    const query = context.env.DB.prepare(`SELECT companyName from userSettings where userId = '${details.id}'`);
    //get the first
    const queryResult = await query.first();
    if (queryResult == undefined) {
        //there is not user settings entry so we can create one
        const userSettings = await context.env.DB.prepare('INSERT INTO userSettings (userId, companyName) VALUES (?1, ?2)')
            .bind(details.id, "")
            .run()
        //now pull it out of the database so we can return it.
        //note: we do this hear but it might make more sense to have it on the register account section
        const query2 = context.env.DB.prepare(`SELECT companyName from userSettings where userId = '${details.id}'`);
        //get the first
        const queryResult2 = await query.first();
        return new Response(JSON.stringify({ settings: queryResult2 }), { status: 200 });
    } else {
        //return it
        return new Response(JSON.stringify({ settings: queryResult }), { status: 200 });
    }

}


export async function onRequestPut(context) {
    //const jwt = require('@tsndr/cloudflare-worker-jwt')
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    try {
        //decode the token
        let details = await decodeJwt(request.headers, env.SECRET);
        //get the content type
        contentType = request.headers.get('content-type');
        if (contentType != null) {
            //get the payload
            payLoad = await request.json();
            //update the user settings
            const stmt = await context.env.DB.prepare(`update userSettings set companyName = '${payLoad.companyName}' where userId = '${details.id}'`)
                .run()
            if (stmt.success == true)
                return new Response(JSON.stringify({ message: "settings updated" }), { status: 200 });
            else {
                return new Response(JSON.stringify({ error: "user settings not found" }), { status: 400 });
            }

        }
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }

}
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

    if (theToken.payload.isAdmin == 1) {

        const { searchParams } = new URL(request.url);
        //get an order id
        const emailType = searchParams.get('emailType');
        const email = searchParams.get('email');
        const orderId = searchParams.get('orderId');
        const tranches = searchParams.get('tranches');
        const name = searchParams.get('name');
        const total = searchParams.get('total');

        let emailData = "";
        if (emailType == "paymentLead") {
            emailData = {
                "templateId": context.env.PAYMENTLINKTEMPLATEID,
                "to": email,
                "templateVariables": {
                    "tranches": `${tranches}`,
                    "product_name": `${name}`,
                    "action_url": `${context.env.PAYMEURL}payment/?orderId=${orderId}`,
                    "total": `${total}`
                }
            };

        }
        console.log("emailData")
        console.log(emailData);
        console.log(context.env.EMAILAPIURL)
        //console.log(data)
        //call the cloudflare API for a one time URL
        const responseEmail = await fetch(context.env.EMAILAPIURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(emailData)
        });
        const emailResponse = await responseEmail.json();
        console.log(emailResponse)
        return new Response(JSON.stringify({ status: "ok" }), { status: 200 });

    } else {
        return new Response(JSON.stringify({ error: "naughty, you are not an admin" }), { status: 400 });

    }
}
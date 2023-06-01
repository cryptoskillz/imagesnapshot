function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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
        //get the search paramaters
        const { searchParams } = new URL(request.url);
        //get the image id
        const imageId = searchParams.get('imageId');
        //set up kv
        const KV = context.env.snapshot;
        //pull out the image
        const imageData = await KV.get(imageId, 'arrayBuffer');
        // Convert the Uint8Array image to base64
        const base64Image = arrayBufferToBase64(imageData);
        //send it to images
        //call the cloudflare API for a one time URL
        const uploadUrl = "https://api.cloudflare.com/client/v4/accounts/8851e575353a23f4511fbe2d1a74505e/images/v2/direct_upload";
        const bearerToken = "PbgI1GP3zctBx7U6rV1xlWzdJvzvg64X6EPuZBd9"
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });
        //get the repsonse
        const cfresponse = await response.json();
        console.log(cfresponse.result.uploadURL)
        const response2 = await fetch(cfresponse.result.uploadURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {API_TOKEN}',
            },
        });
        //get the repsonse
        const uploadResponse = await response2.json();
        console.log(uploadResponse)
        return new Response(JSON.stringify(uploadResponse), { status: 200 });
}
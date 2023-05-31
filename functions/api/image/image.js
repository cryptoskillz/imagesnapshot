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
    const KV = context.env.backpage;
    //pull out the image
    const imageData = await KV.get( imageId, 'arrayBuffer');
    //set the headers
    const headers = {
        'Content-Type': 'image/png',
    };
    // Return the image as the response
    return new Response(imageData, { headers });
}
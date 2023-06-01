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
    const baselineId = searchParams.get('baselineId');
    const snapshotId = searchParams.get('snapshotId');
    //set up kv
    const KV = context.env.datastore;
    //pull out the image
    const baselineData = await KV.get(baselineId, 'arrayBuffer');
    const snapshotData = await KV.get(snapshotId, 'arrayBuffer');
    const numPixels = baselineData.length / 4; // Assuming RGBA images
    const diffImageData = new Uint8Array(baselineData.length);
    for (let i = 0; i < numPixels; i++) {
        const pixelOffset = i * 4;
        const r1 = baselineData[pixelOffset];
        const g1 = baselineData[pixelOffset + 1];
        const b1 = baselineData[pixelOffset + 2];
        const a1 = baselineData[pixelOffset + 3];
        const r2 = snapshotData[pixelOffset];
        const g2 = snapshotData[pixelOffset + 1];
        const b2 = snapshotData[pixelOffset + 2];
        const a2 = snapshotData[pixelOffset + 3];
        // Compare RGBA values
        if (r1 !== r2 || g1 !== g2 || b1 !== b2 || a1 !== a2) {
            // Set pixel in diff image to highlight the change
            diffImageData[pixelOffset] = 255; // Red
            diffImageData[pixelOffset + 1] = 0; // Green
            diffImageData[pixelOffset + 2] = 0; // Blue
            diffImageData[pixelOffset + 3] = 255; // Alpha
        }
    }
    //set the headers
    const headers = {
        'Content-Type': 'image/png',
    };
    return new Response(diffImageData, { headers });
}
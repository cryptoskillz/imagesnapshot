// Cloudflare Worker script

// Include the pixelmatch library
const pixelmatch = require('pixelmatch');


async function handleRequest(request) {
    const width = 800; // Set the width of the images
    const height = 600; // Set the height of the images

    //set up kv
    const datastore = DATASTORE; // Access the KV binding
    const kv = await KV.get(datastore);

    //pull out the image
    const baselineId = "1-f1783a6a-7f13-408e-9a74-95301c0b3c72";
    const snapshotId = "1-c6ae84c5-c9b6-464d-9b03-b04944140959";
    const baselineData = await KV.get(baselineId, 'arrayBuffer');
    const snapshotData = await KV.get(snapshotId, 'arrayBuffer');



    // Create an empty diff image buffer
    const diffImageData = new Uint8Array(width * height * 4); // Assuming RGBA images

    // Compare the images using pixelmatch
    const numDiffPixels = pixelmatch(baselineData, snapshotData, diffImageData, width, height, { threshold: 0.1 });
    const diffImage = await compareImages(baselineData, snapshotData);

    // Log the number of different pixels
    console.log(`Number of different pixels: ${numDiffPixels}`);

  
    return new Response(JSON.stringify({ "message": "POST ONLY" }, 400));
}
addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});


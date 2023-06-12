//get the project
let project = JSON.parse(window.localStorage.currentDataItem);

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none');
    // Get the reference to the data header
    const divElement = document.getElementById('data-header');

    // Function to update the div's innerHTML
    const updateDiv = () => {
        // Generate the content to be updated
        const currentText = divElement.innerHTML
        if (currentText == "processing Snapshot(s)...")
            divElement.innerHTML = "processing Snapshot(s)";
        else
            divElement.innerHTML = divElement.innerHTML + "."
    };

    // Call the updateDiv function every second and store the interval identifier
    const intervalId = setInterval(updateDiv, 1000);
    //set a counter
    let countIt = 0;
    //create queue done
    const createqueueDone = async (res) => {
        //store the queue results
        const createqueueResults = JSON.parse(res);
        //snapshot done
        const snapshotDone = async (res) => {
            //store the snapshot
            //note: we could make this a single element and not an array
            const snapshotResults = JSON.parse(res);
            //console.log(snapshotResults)
            //get the update div
            let theElement = document.getElementById("snapshotUpdateDiv");
            //add the processed to it
            //comparisonResultElement.innerHTML = `<img src="${image.src }" style="width:${resolutionWidth}" class="img-snapshot"/>`;

            theElement.innerHTML = theElement.innerHTML + `<br> Processed ${snapshotResults[0].browserDefault} <a href="${apiUrl}image/image?imageId=${snapshotResults[0].imageId}" target="_blank">View</a>`
            //inc the counter
            countIt++;
            //check if we are at the end
            if (createqueueResults.length == countIt) {
                //update UI
                clearInterval(intervalId);
                document.getElementById('data-header').innerHTML = `Snapshot processing complete click to view results.<br> <a href="/project/data/latest/?projectId=${project.id}&projectDataId=${window.localStorage.currentDataItemId}&preview=${getUrlParamater("preview")}" target="_blank">here</a>`
                document.getElementById("snapshotCounterDiv").innerHTML = ""

            } else {
                //update the image counter UI
                document.getElementById("snapshotCounterDiv").innerHTML = `Processing Image ${countIt+1} of ${createqueueResults.length}`

            }
        }
        //set a url array
        let urls = [];
        //get the result of ID's so we can process them async
        for (var i = 0; i < createqueueResults.length; ++i) {
            //store the call
            let tmpUrl = `${apiUrl}image/singlesnapshot/?projectId=${project.id}&projectDataId=${window.localStorage.currentDataItemId}&preview=${getUrlParamater("preview")}&snapshotId=${createqueueResults[i].id}`
            let tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "snapshotDone", "xhrType": 1 }
            urls.push(tmpXhrCalls);
        }
        //update the image counter UI
        document.getElementById("snapshotCounterDiv").innerHTML = `Processing Image 1 of ${createqueueResults.length}`
        //loop through the urls and call them
        for (var i = 0; i < urls.length; ++i) {
            //console.log(`processing XHR call ${urls[i].url}`)
            let xhrRes = await xhrcall(urls[i].xhrType, urls[i].url, "", "json", "", eval(urls[i].doneFunction), token)
        }

    }
    //make the snapshot xhr callß
    let init = async () => {
        xhrcall(1, `${apiUrl}image/createqueue/?projectId=${project.id}&preview=${getUrlParamater("preview")}`, "", "json", "", createqueueDone, token);
    }
    //start ting's
    init();
})
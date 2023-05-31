//get the project
let project = JSON.parse(window.localStorage.currentDataItem);

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    //set the browser type
    //const tmpDetail = "Browers type : Chrome/94.0.<br>Width :800px<br>Height: 360px<br>";
    //document.getElementById('imageDetails').innerHTML = tmpDetail;
    document.getElementById('showBody').classList.remove('d-none');
    // Get the reference to the dara header
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

    //done function
    const xhrDone = (res) => {
        console.log(res)
        res = res.split(",")
        console.log(res)
        //res = JSON.parse(res)
        //stop the timer
        clearInterval(intervalId);
        //update the header
        document.getElementById('data-header').innerHTML = "Snapshot processing complete"
        //build the images
        let imageHtml = "";
        for (var i = 0; i < res.length; ++i) {
            imageHtml = imageHtml + `<img src="http://localhost:8789/api/image/image/?imageId=${res[i]}" />`;
        }
        //update the dom
        document.getElementById('imageDiv').innerHTML = imageHtml;
    };



    // Make the XHR call to fetch the image data
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}image/snapshot/?projectId=${project.id}&userAgentIndex=1&projectDataId=${window.localStorage.currentDataItemId}`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = function() {
        if (xhr.status === 200) {
            xhrDone(xhr.response);
        }
        //error
        if (xhr.status === 400) {
            clearInterval(intervalId);
            document.getElementById('data-header').innerHTML = "Unable to process Snapshot"
        }
    };
    //make the call.
    xhr.send();
})
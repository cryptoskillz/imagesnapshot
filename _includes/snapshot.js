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

    const snapshotDone = (res) => {
        clearInterval(intervalId);
        //snaop shot is complete
       document.getElementById('data-header').innerHTML = `Snapshot processing complete click to view results.<br> <a href="/project/data/latest/?projectId=${project.id}&projectDataId=${window.localStorage.currentDataItemId}&preview=${getUrlParamater("preview")}" target="_blank">here</a>`
    }
    //make the snapshot xhr call
    xhrcall(1, `${apiUrl}image/snapshot/?projectId=${project.id}&projectDataId=${window.localStorage.currentDataItemId}&preview=${getUrlParamater("preview")}`, "", "json", "", snapshotDone, token);


})
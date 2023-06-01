//get the project
let project = JSON.parse(window.localStorage.currentDataItem);
//store the browser types
let userAgents;
let snapShots = [];

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//thumbnail click function
const clickThumbnail = (id) => {
    //console.log(snapShots)
    let theJson = JSON.stringify(snapShots[id]);
    let baselineDone = (res) => {
        res = JSON.parse(res)
                console.log(res)

        //get the element id
        const thumbnailElement = document.getElementById("imageDiv");
        //show the image
        thumbnailElement.innerHTML = `SNAPSHOT<img src="${apiUrl}image/image/?imageId=${snapShots[id].imageId}" style="width:500px" class="img-snapshot"/>`;
        const baselineElement = document.getElementById("baselineImageDiv");

        if (res.kvId == undefined)
        {
            baselineElement.innerHTML = `NO BASELINE`
            showAlert(`${res.error}`, 2, 0);
        }
        else
        {
            baselineElement.innerHTML = `BASELINE<img src="${apiUrl}image/image/?imageId=${res.kvId}" style="width:500px" class="img-snapshot"/>`;
        }    
    }
    //get the baseline 
    
    xhrcall(1, `${apiUrl}image/baseline?projectId=${project.id}&snapshot=${theJson}`, "", "json", "", baselineDone, token);
    

}

const osSelectChange = (theElement) => {
    //render thumbnails
    const thumbnailElement = document.getElementById("thumbnailDiv");
    //set the image html element
    let imageHtml = "";
    //loop through the image results
    for (var i = 0; i < snapShots.length; ++i) {
        //check if we should show it
        if (theElement.value == snapShots[i].browserName) {
            //render out the thumb nails
            imageHtml = imageHtml + `<a href="javascript:clickThumbnail(${i})"><img src="https://placehold.co/100x100?text=${snapShots[i].width}x${snapShots[i].height}"/> </a>`;
        }
    }
    //update the dom
    thumbnailElement.innerHTML = imageHtml;
}

//this handles the browser click
const clickBrowser = (browser) => {
    // Get a reference to the select element
    const selectElement = document.getElementById("osSelect");
    // Remove all existing options
    while (selectElement.options.length > 0) {
        selectElement.remove(0);
    }

    // Create a new option element for the please select
    const option = document.createElement("option");
    option.value = ""; // Set the value of the option
    option.text = "Please select"; // Set the text displayed for the option
    selectElement.appendChild(option);
    //loop through the user aagents
    for (var i = 0; i < userAgents.length; ++i) {
        if (userAgents[i].browserDefault == browser) {
            //make an option
            const option = document.createElement("option");
            option.value = userAgents[i].browserName; // Set the value of the option
            option.text = userAgents[i].browserName; // Set the text displayed for the option
            // Append the option element to the select element
            selectElement.appendChild(option);

        }
        //add it to the dropdowns
        document.getElementById('osDetails').classList.remove('d-none')
    }
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

    //process browsers done
    const browsersDone = (res) => {
        //store the user agents
        userAgents = JSON.parse(res);
        //process the snapshot done
        const snapshotDone = (res) => {


            //stop the processing animation
            clearInterval(intervalId);
            snapShots = JSON.parse(res);
            let theHtml = "";
            let addedChrome = 0;
            let addedEdge = 0;
            let addedFirefox = 0;
            let addedSafari = 0;
            for (var i = 0; i < snapShots.length; ++i) {
                if ((snapShots[i].browserDefault == "Chrome") && (addedChrome == 0)) {
                    addedChrome = 1;
                    theHtml = theHtml + `<a href="javascript:clickBrowser('Chrome')"><i class="fa-brands fa-chrome" alt="Chrome"></i></a>`
                }
                if ((snapShots[i].browserDefault == "Edge") && (addedEdge == 0)) {
                    addedChrome = 1;
                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Edge')" > <i class="fa-brands fa-edge" alt="Edge"></i> </a>`
                }
                if ((snapShots[i].browserDefault == "Firefox") && (addedFirefox == 0)) {
                    addedChrome = 1;
                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Firefox')" > <i class="fa-brands fa-firefox" alt="Firefox"></i> </a> `
                }

                if ((snapShots[i].browserDefault == "Safari") && (addedSafari == 0)) {
                    addedChrome = 1;
                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Safari')" > <i class="fa-brands fa-safari" alt="Safari"></i> </a>`
                }
            }
            document.getElementById('imageDetails').innerHTML = theHtml
            document.getElementById('imageDetails').classList.remove('d-none');

            //snaop shot is complete
            document.getElementById('data-header').innerHTML = "Snapshot processing complete"
        }
        //make the snapshot xhr call
        xhrcall(1, `${apiUrl}image/snapshot/?projectId=${project.id}&userAgentIndex=1&projectDataId=${window.localStorage.currentDataItemId}`, "", "json", "", snapshotDone, token);
    };
    //fetch the different user agents for the project
    xhrcall(1, `${apiUrl}admin/userbrowsers?projectId=${project.id}`, "", "json", "", browsersDone, token);

})
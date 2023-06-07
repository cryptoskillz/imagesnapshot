//get the project
//let project = JSON.parse(window.localStorage.currentDataItem);
//store the browser types
let userAgents;
let snapShots = [];

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//set the different images
let baselineImage = "";
let snapshotImage = "";
let differentImage = "";

//compare images function 
const compareImages = (setImageDifferent) => {
    //check we have both a baseline and a snapshop imates
    if (baselineImage != "" && snapshotImage != "") {
        //check if we want to show the difference
        if (setImageDifferent == 1) {
            //check uf we have already processed the differences
            if (differentImage == "") {
                ///compare the images
                resemble(baselineImage).compareTo(snapshotImage).onComplete(function(data) {
                    // Display the image comparison data as an image
                    var comparisonResultElement = document.getElementById('snapshotImageDiv');
                    var image = new Image();
                    image.src = data.getImageDataUrl();
                    //add it to the element
                    comparisonResultElement.innerHTML = `<img src="${image.src }" style="width:500px" class="img-snapshot"/>`;
                    differentImage = image.src;
                })
            } else {
                //use the saved differences image
                var comparisonResultElement = document.getElementById('snapshotImageDiv');
                comparisonResultElement.innerHTML = `<img src="${differentImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //show the hide diff button
            document.getElementById('showDiff').classList.add("d-none");
            document.getElementById('hideDiff').classList.remove("d-none");
        } else {
            //show the normal sbnapshot image
            var comparisonResultElement = document.getElementById('snapshotImageDiv');
            comparisonResultElement.innerHTML = `<img src="${baselineImage}" style="width:500px" class="img-snapshot"/>`;
            //show the show differences buttons
            document.getElementById('showDiff').classList.remove("d-none");
            document.getElementById('hideDiff').classList.add("d-none");
        }
    }
}



//thumbnail click function
const clickThumbnail = (id) => {
    //console.log(snapShots)
    let theJson = JSON.stringify(userAgents[id]);
    let latestImagesDone = (res) => {
        res = JSON.parse(res)
        //console.log(res)
        //get the element id
        const snapshotElement = document.getElementById("snapshotImageDiv");
        //get the baseline
        const baselineElement = document.getElementById("baselineImageDiv");
        //clear the images
        baselineImage = "";
        snapshotImage = "";
        differentImage = "";

        if (getUrlParamater("preview") == 0) {

            document.getElementById("leftImage").innerHTML = "BASELINE"
            document.getElementById("rightImage").innerHTML = "SNAPSHOT"
            //check if we have a baseline
            if (res.baselineId == undefined || res.baselineId == "") {
                baselineElement.innerHTML = `NO BASELINE`
                showAlert(`No baseline image`, 2);
            } else {
                //render it
                baselineImage = `${apiUrl}image/image/?imageId=${res.baselineId}`;
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                showAlert(`no snapshot image`, 2);
            } else {
                //render it
                snapshotImage = `${apiUrl}image/image/?imageId=${res.snapshotId}`;
                snapshotElement.innerHTML = `<img src="${snapshotImage}" style="width:500px" class="img-snapshot"/>`;
            }
        } else {
            document.getElementById("leftImage").innerHTML = "PREVIEW"
            document.getElementById("rightImage").innerHTML = "SNAPSHOT"
            //check if we have a baseline
            if (res.previewId == undefined || res.previewId == "") {

                baselineElement.innerHTML = `NO PREVIEW `
                showAlert(`No preview image`, 2);
            } else {
                //render it
                baselineImage = `${apiUrl}image/image/?imageId=${res.previewId}`;
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                showAlert(`no snapshot image`, 2);
            } else {
                snapshotImage = `${apiUrl}image/image/?imageId=${res.snapshotId}`;
                //render it
                snapshotElement.innerHTML = `<img src="${snapshotImage}" style="width:500px" class="img-snapshot"/>`;
            }
        }
        //if we have a baseline and snapshot so the compare button
        if (snapshotImage != "" && baselineImage != "") {
            document.getElementById("comparsionDiv").classList.remove("d-none")
        }
        else
        {
            document.getElementById("comparsionDiv").classList.add("d-none")
        }
        //show the images
        document.getElementById("imagesWrapper").classList.remove("d-none")
    }
    //get the baseline 
    //xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}`, "", "json", "", latestImagesDone, token);
    xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}&snapshot=${theJson}`, "", "json", "", latestImagesDone, token);


}

const osSelectChange = (theElement) => {
    //console.log(userAgents)
    //clear the image wrapper
    document.getElementById("snapshotImageDiv").innerHTML = "";
    document.getElementById("baselineImageDiv").innerHTML = "";
    document.getElementById("imagesWrapper").classList.add("d-none")
    document.getElementById("comparsionDiv").classList.add("d-none") 
    //render thumbnails
    const thumbnailElement = document.getElementById("thumbnailDiv");
    //set the image html element
    let imageHtml = "";
    //loop through the image results
    for (var i = 0; i < userAgents.length; ++i) {
        //console.log(userAgents[i])
        //console.log(theElement.value)
        //check if we should show it
        if (theElement.value == userAgents[i].browserDefault) {
            //render out the thumb nails
            imageHtml = imageHtml + `<a href="javascript:clickThumbnail(${i})"><img src="https://placehold.co/100x100?text=${userAgents[i].screenWidth}x${userAgents[i].screenHeight}"/> </a>`;
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
        if (userAgents[i].browserName == browser) {
            //make an option
            const option = document.createElement("option");
            option.value = userAgents[i].browserDefault; // Set the value of the option
            option.text = userAgents[i].browserDefault; // Set the text displayed for the option
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

    //process browsers done
    const browsersDone = (res) => {
        //store the user agents
        userAgents = JSON.parse(res);
        //process the snapshot done
        const snapshotDone = (res) => {
            snapShots = JSON.parse(res);


            document.getElementById('data-header').innerHTML = `Latest results for ${snapShots[0].projectName}<br><a href="${snapShots[0].projectUrl}" target="_blank">${snapShots[0].projectUrl}</a>`

            let theHtml = "";
            let addedChrome = 0;
            let addedEdge = 0;
            let addedFirefox = 0;
            let addedSafari = 0;
            for (var i = 0; i < userAgents.length; ++i) {
                if ((userAgents[i].browserName == "Chrome") && (addedChrome == 0)) {
                    addedChrome = 1;
                    theHtml = theHtml + `<a href="javascript:clickBrowser('Chrome')"><i class="fa-brands fa-chrome" alt="Chrome"></i></a>`
                }
                if ((userAgents[i].browserName == "Edge") && (addedEdge == 0)) {
                    addedEdge = 1;
                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Edge')" > <i class="fa-brands fa-edge" alt="Edge"></i> </a>`
                }
                if ((userAgents[i].browserName == "Firefox") && (addedFirefox == 0)) {
                    addedFirefox = 1;
                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Firefox')" > <i class="fa-brands fa-firefox" alt="Firefox"></i> </a> `
                }

                if ((userAgents[i].browserName == "Safari") && (addedSafari == 0)) {
                    addedSafari = 1;

                    theHtml = theHtml + `<a href = "javascript:clickBrowser('Safari')" > <i class="fa-brands fa-safari" alt="Safari"></i> </a>`
                }
            }
            document.getElementById('imageDetails').innerHTML = theHtml
            document.getElementById('imageDetails').classList.remove('d-none');
        }
        //make the snapshot xhr call
        xhrcall(1, `${apiUrl}image/latest/?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}`, "", "json", "", snapshotDone, token);
    };
    //fetch the different user agents for the project
    xhrcall(1, `${apiUrl}admin/userbrowsers?projectId=${getUrlParamater("projectId")}`, "", "json", "", browsersDone, token);

})
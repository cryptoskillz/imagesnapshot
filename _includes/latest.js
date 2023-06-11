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
                    var comparisonResultElement = document.getElementById('snapshotImageScroller');
                    var image = new Image();
                    image.src = data.getImageDataUrl();
                    //add it to the element
                    comparisonResultElement.innerHTML = `<img src="${image.src }" style="width:500px" class="img-snapshot"/>`;
                    differentImage = image.src;
                })
            } else {
                //use the saved differences image
                var comparisonResultElement = document.getElementById('snapshosnapshotImageScrollertImageDiv');
                comparisonResultElement.innerHTML = `<img src="${differentImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //show the hide diff button
            document.getElementById('showDiff').classList.add("d-none");
            document.getElementById('hideDiff').classList.remove("d-none");
        } else {
            //show the normal sbnapshot image
            var comparisonResultElement = document.getElementById('snapshotImageScroller');
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
        const snapshotElement = document.getElementById("snapshotImageScroller");
        //get the baseline
        const baselineElement = document.getElementById("baselineImageScroller");



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
                //showAlert(`No baseline image`, 2);
            } else {
                //render it
                baselineImage = `${apiUrl}image/image/?imageId=${res.baselineId}`;
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                //showAlert(`no snapshot image`, 2);
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
                //showAlert(`No preview image`, 2);
            } else {
                //render it
                baselineImage = `${apiUrl}image/image/?imageId=${res.previewId}`;
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:500px" class="img-snapshot"/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                //showAlert(`no snapshot image`, 2);
            } else {
                snapshotImage = `${apiUrl}image/image/?imageId=${res.snapshotId}`;
                //render it
                snapshotElement.innerHTML = `<img src="${snapshotImage}" style="width:500px" class="img-snapshot"/>`;
            }
        }
        //if we have a baseline and snapshot so the compare button
        if (snapshotImage != "" && baselineImage != "") {
            document.getElementById("comparsionDiv").classList.remove("d-none")

        } else {
            if (snapshotImage == "" && baselineImage == "") {
                showAlert('no baseline or snapshot image', 2);
            } else {
                if (snapshotImage == "") {
                    showAlert(`no snapshot image`, 2);
                }
                if (baselineImage == "") {
                    if (getUrlParamater("preview") == 0)
                        showAlert(`No preview image`, 2);
                    else
                        showAlert(`No baseline image`, 2);
                }
            }
            document.getElementById("comparsionDiv").classList.add("d-none")
        }
        //show the images
        document.getElementById("imagesWrapper").classList.remove("d-none")
    }
    //get the baseline 
    //xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}`, "", "json", "", latestImagesDone, token);
    xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}&snapshot=${theJson}`, "", "json", "", latestImagesDone, token);


}

const ssSelectChange = (theElement) => {
    //console.log(userAgents)
    //rest the state
    //hideAllTheThings();
    //show the thumbnail

    //get the element id
    const snapshotElement = document.getElementById("snapshotImageScroller");
    //get the baseline
    const baselineElement = document.getElementById("baselineImageScroller");
    //console.log(baselineElement)

    if (theElement.value == 0) {
        baselineElement.style.height = '';
        baselineElement.style.width = '500px';
        baselineElement.style.overflow = '';
        snapshotElement.style.height = '';
        snapshotElement.style.width = '500px';
        snapshotElement.style.overflow = '';
    }

    if (theElement.value == 1) {
        baselineElement.style.height = '720px';
        baselineElement.style.width = '500px';
        baselineElement.style.overflow = 'scroll';
        snapshotElement.style.height = '720px';
        snapshotElement.style.width = '500px';
        snapshotElement.style.overflow = 'scroll';
    }

    if (theElement.value == 2) {
        baselineElement.style.height = '1080px';
        baselineElement.style.width = '500px';
        baselineElement.style.overflow = 'scroll';
        snapshotElement.style.height = '1080px';
        snapshotElement.style.width = '500px';
        snapshotElement.style.overflow = 'scroll';
    }

}


const osSelectChange = (theElement) => {
    //console.log(userAgents)
    //rest the state
    hideAllTheThings();
    //show the thumbnail
    document.getElementById("thumbnailDiv").classList.remove("d-none");
    //show the comparison div
    document.getElementById("comparsionDiv").classList.remove("d-none");
    //show the show difference button
    document.getElementById("showDiff").classList.remove("d-none")
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
            imageHtml = imageHtml + `<a href="javascript:clickThumbnail(${i})"><img src="https://placehold.co/100x100?text=${userAgents[i].viewportWidth}x${userAgents[i].viewportHeight}"/> </a>`;
        }
    }
    //update the dom
    thumbnailElement.innerHTML = imageHtml;
}

const hideAllTheThings = () => {
    document.getElementById("snapshotImageScroller").innerHTML = "";
    document.getElementById("baselineImageScroller").innerHTML = "";
    document.getElementById("imagesWrapper").classList.add("d-none")
    document.getElementById("comparsionDiv").classList.add("d-none")
    document.getElementById("thumbnailDiv").classList.add("d-none")
    document.getElementById("showDiff").classList.add("d-none")
    document.getElementById("hideDiff").classList.add("d-none")
}

//this handles the browser click
const clickBrowser = (browser) => {
    hideAllTheThings();
    // Get a reference to the select element
    const selectElement = document.getElementById("osSelect");
    // Remove all existing options
    while (selectElement.options.length > 0) {
        selectElement.remove(0);
    }
    console.log(selectElement)

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
    console.log(selectElement)



    const selectElement2 = document.getElementById("ssSelect");

    // Create the "Please select" option
    let option1 = document.createElement("option");
    option1.value = "";
    option1.text = "Please select";
    selectElement2.appendChild(option1);

    // Create the "no screensize" option
    let option2 = document.createElement("option");
    option2.value = "0";
    option2.text = "no screensize";
    selectElement2.appendChild(option2);

    // Create the "7 inch monitor" option
    let option3 = document.createElement("option");
    option3.value = "1";
    option3.text = "7 inch monitor";
    selectElement2.appendChild(option3);

        // Create the "7 inch monitor" option
    let option4 = document.createElement("option");
    option4.value = "2";
    option4.text = "24 inch monitor";
    selectElement2.appendChild(option4);

    // Remove the "d-none" class from the ssDetails element
    document.getElementById('ssDetails').classList.remove('d-none');


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

            if (getUrlParamater("preview") == 1)
                document.getElementById('data-header').innerHTML = `Preview results for ${snapShots[0].projectName} (<a href="${snapShots[0].projectUrl}" target="_blank">${snapShots[0].projectUrl}</a>)`
            else
                document.getElementById('data-header').innerHTML = `Latest results for ${snapShots[0].projectName} (<a href="${snapShots[0].projectUrl}" target="_blank">${snapShots[0].projectUrl}</a>)`

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
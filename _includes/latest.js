//get the project
//let project = JSON.parse(window.localStorage.currentDataItem);
//store the browser types
let userAgents;
let snapShots = [];
let displayResults;
let resolutionWidth = 500;

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

//set the different images
let baselineImage = "";
let snapshotImage = "";
let differentImage = "";

//compare images function 
const compareImages = (setImageDifferent) => {
    let setRes = resolutionWidth;
    if (setRes > 500)
        setRes = 500;
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
                    comparisonResultElement.innerHTML = `<img src="${image.src }" style="width:${setRes}px" class=""/>`;
                    differentImage = image.src;
                })
            } else {
                //use the saved differences image
                var comparisonResultElement = document.getElementById('snapshosnapshotImageScrollertImageDiv');
                comparisonResultElement.innerHTML = `<img src="${differentImage}" style="width:${setRes}px" class=""/>`;
            }
            //show the hide diff button
            document.getElementById('showDiff').classList.add("d-none");
            document.getElementById('hideDiff').classList.remove("d-none");
        } else {
            //show the normal sbnapshot image
            var comparisonResultElement = document.getElementById('snapshotImageScroller');
            comparisonResultElement.innerHTML = `<img src="${baselineImage}" style="width:${setRes}px" class=""/>`;
            //show the show differences buttons
            document.getElementById('showDiff').classList.remove("d-none");
            document.getElementById('hideDiff').classList.add("d-none");
        }
    }
}


let userAgentId;
//thumbnail click function
const clickThumbnail = (id) => {
    //console.log(snapShots)
    userAgentId = id
    let theJson = JSON.stringify(userAgents[id]);
    let latestImagesDone = (res) => {
        res = JSON.parse(res)
        //get the element id
        const snapshotElement = document.getElementById("snapshotImageScroller");
        //get the baseline
        const baselineElement = document.getElementById("baselineImageScroller");
        //clear the images
        baselineImage = "";
        snapshotImage = "";
        differentImage = "";
        let setRes = resolutionWidth;
        if (setRes > 500)
            setRes = 500;
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
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:${setRes}px" class=""/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                //showAlert(`no snapshot image`, 2);
            } else {
                //render it
                snapshotImage = `${apiUrl}image/image/?imageId=${res.snapshotId}`;
                snapshotElement.innerHTML = `<img src="${snapshotImage}" style="width:${setRes}px" class=""/>`;
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
                baselineElement.innerHTML = `<img src="${baselineImage}" style="width:${setRes}px" class=""/>`;
            }
            //check if a snapshot has been run
            if (res.snapshotId == undefined || res.snapshotId == "") {
                snapshotElement.innerHTML = `NO SNAPSHOT`
                //showAlert(`no snapshot image`, 2);
            } else {
                snapshotImage = `${apiUrl}image/image/?imageId=${res.snapshotId}`;
                //render it
                snapshotElement.innerHTML = `<img src="${snapshotImage}" style="width:${setRes}" class=""/>`;
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
        document.getElementById("baselineImageScroller").classList.remove("d-none")
        document.getElementById("snapshotImageScroller").classList.remove("d-none")

    }
    //get the baseline 
    //xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}`, "", "json", "", latestImagesDone, token);
    xhrcall(1, `${apiUrl}image/latestimages?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}&snapshot=${theJson}`, "", "json", "", latestImagesDone, token);


}

const ssSelectChange = (theElement) => {

    //get the element id
    const snapshotElement = document.getElementById("snapshotImageScroller");
    //get the baseline
    const baselineElement = document.getElementById("baselineImageScroller");
    //check if it is 0 and turn it off
    if (theElement.value == 0) {
        resolutionWidth = 500;
        baselineElement.style.height = '';
        baselineElement.style.width = `${resolutionWidth}px`;
        baselineElement.style.overflow = '';
        snapshotElement.style.height = '';
        snapshotElement.style.width = `${resolutionWidth}px`;
        snapshotElement.style.overflow = '';


    } else {
        //look for the display result and set it.
        for (var i = 0; i < displayResults.length; ++i) {
            if (theElement.value == displayResults[i].id) {
                baselineElement.style.height = `${displayResults[i].viewportHeight}px`;
                baselineElement.style.width = `${displayResults[i].viewportWidth}px`;
                baselineElement.style.overflow = 'scroll';
                //baselineElement.style.backgroundImage = `url('${adminUrl}assets/images/samsungs20galaxy.png')`;

                snapshotElement.style.height = `${displayResults[i].viewportHeight}px`
                snapshotElement.style.width = `${displayResults[i].viewportWidth}px`;;
                snapshotElement.style.overflow = 'scroll';
                //snapshotElement.style.backgroundImage = `url('${adminUrl}assets/images/samsungs20galaxy.png')`;
                resolutionWidth = displayResults[i].viewportWidth;
            }
        }
    }

    //render in the image move clickthumbnail
    clickThumbnail(userAgentId)


}


const osSelectChange = (theElement) => {

    //get the displays
    const displaysDone = (res) => {
        displayResults = JSON.parse(res);
        //rest the state
        hideAllTheThings();
        document.getElementById("ssSelect").classList.remove("d-none")

        // Get a reference to the select element
        const selectElement = document.getElementById("ssSelect");
        // Remove all existing options
        while (selectElement.options.length > 0) {
            selectElement.remove(0);
        }
        // Create a new option element for the please select
        const option = document.createElement("option");
        option.value = "0"; // Set the value of the option
        option.text = "No Device"; // Set the text displayed for the option
        selectElement.appendChild(option);
        //loop through the user aagents
        for (var i = 0; i < displayResults.length; ++i) {
            //if (userAgents[i].browserName == browser) {
            //make an option
            const option = document.createElement("option");
            option.value = displayResults[i].id; // Set the value of the option
            option.text = displayResults[i].model; // Set the text displayed for the option
            // Append the option element to the select element
            selectElement.appendChild(option);
            //}
            //add it to the dropdowns
            //document.getElementById('ssDetails').classList.remove('d-none')
        }

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
            if (theElement.value == userAgents[i].userBrowserId) {
                //render out the thumb nails
                imageHtml = imageHtml + `<a href="javascript:clickThumbnail(${i})"><img src="https://placehold.co/100x100?text=${userAgents[i].viewportWidth}x${userAgents[i].viewportHeight}"/> </a>`;
            }
        }
        //update the dom
        thumbnailElement.innerHTML = imageHtml;
    }
    //make the snapshot xhr call
    xhrcall(1, `${apiUrl}image/displays/?userBrowserId=${theElement.value}`, "", "json", "", displaysDone, token);

}

const hideAllTheThings = () => {
    document.getElementById("snapshotImageScroller").innerHTML = "";
    document.getElementById("baselineImageScroller").innerHTML = "";
    //document.getElementById("imagesWrapper").classList.add("d-none")
    document.getElementById("comparsionDiv").classList.add("d-none")
    document.getElementById("thumbnailDiv").classList.add("d-none")
    document.getElementById("showDiff").classList.add("d-none")
    document.getElementById("hideDiff").classList.add("d-none")
    document.getElementById("ssSelect").classList.add("d-none")

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
            option.value = userAgents[i].userBrowserId; // Set the value of the option
            option.text = userAgents[i].browserDefault; // Set the text displayed for the option
            // Append the option element to the select element
            selectElement.appendChild(option);
        }
        //add it to the dropdowns
        document.getElementById('osDetails').classList.remove('d-none')
    }

}

const resolveComment = (id) => {
    //resolve the comment
    const resolveCommentDone = (res) => {
        //parse it
        res = JSON.parse(res);
        //check it was deleted
        if (res.response == "ok") {
            document.getElementById(`comment-${id}`).classList.add('d-none');
        }
    }
    //call the delete comment endpoint
    xhrcall(3, `${apiUrl}admin/comment?commentId=${id}`, "", "json", "", resolveCommentDone, getToken());
}




document.getElementById('addCommentButton').addEventListener('click', function() {
    //get the comment textarea
    const theComment = document.getElementById('theComment').value;
    //get the comment password
    const thePassword = document.getElementById('commentPassword').value;
    //set a boolean
    let allowIt = 1;
    //check we have valid data
    if (theComment == "") {
        allowIt = 0;
        showAlert('Comment Cannot be blank', 2)
    }
    if (thePassword == "") {
        allowIt = 0;
        showAlert('Password Cannot be blank', 2)
    }
    //process the add comment done
    const addCommentdone = (res) => {
        showAlert('Comment added', 1)
        //parse it
        res = JSON.parse(res);
        //get the div
        let commentsDiv = document.getElementById('commentsDiv');
        //add the comment to ti
        commentsDiv.innerHTML = commentsDiv.innerHTML + `<div class="speech-bubble" id="comment-${res.record.id}">
                ${res.record.comment}
    <div class="resolved-icon">
        <a href="javascript:resolveComment(${res.record.id});" class="resolved-link">
            <i class="fas fa-check-circle"></i> 
        </a>    
    </div>
  </div>`

    }

    //check it
    if (allowIt == 1) {
        //build the body object
        let bodyObj = {
            comment: theComment,
            commentPassword: thePassword,
            projectId: getUrlParamater("projectId"),
            projectDataId: getUrlParamater("projectDataId")
        }
        //string it
        var bodyObjectJson = JSON.stringify(bodyObj);
        //call the post comment endpoint
        xhrcall(0, `${apiUrl}admin/comment`, bodyObjectJson, "json", "", addCommentdone, "");
    }
});


whenDocumentReady(isReady = () => {


    document.getElementById('showBody').classList.remove('d-none');
    // Get the reference to the data header

    //process browsers done
    const browsersDone = (res) => {
        //store the user agents
        userAgents = JSON.parse(res);
        //process the snapshot done
        const snapshotDone = (res) => {
            //parse the result 
            res = JSON.parse(res);
            //store the snapshots
            snapShots = res.snapshot;
            //set the comments password 
            if (res.commentPassword != "") {
                document.getElementById('commentPassword').value = res.commentPassword;
                document.getElementById("commentHeader").innerHTML = `Add a comment (comment password is ${res.commentPassword})`
            } else
                document.getElementById("commentHeader").innerHTML = `Add a comment (ask the admin to share the password)`


            //store the comments
            comments = res.comments;
            //console.log(snapShots);
            //console.log(comments);
            let commentsHtml = '';
            //build the comments
            for (var i = 0; i < comments.length; ++i) {
                commentsHtml = commentsHtml + `<div class="speech-bubble" id="comment-${comments[i].id}">
                ${comments[i].comment}
    <div class="resolved-icon">
        <a href="javascript:resolveComment(${comments[i].id});" class="resolved-link">
            <i class="fas fa-check-circle"></i> 
        </a>    
    </div>
  </div>`;
            }
            //render it
            if (commentsHtml != '') {
                document.getElementById('commentsDiv').innerHTML = commentsHtml;
            }


            if (getUrlParamater("preview") == 1)
                document.getElementById('data-header').innerHTML = `<a href="${snapShots[0].projectUrl}" target="_blank">${snapShots[0].projectName} preview</a> <br> <a href="{{env.ADMINURL}}emulate/?url=${snapShots[0].projectUrl}&device=iphone12" target="_blank">emulate</a>`
            else
                document.getElementById('data-header').innerHTML = `<a href="${snapShots[0].projectUrl}" target="_blank">${snapShots[0].projectName}</a> <br> <a href="{{env.ADMINURL}}emulate?url=${snapShots[0].projectUrl}&device=iphone12" target="_blank">emulate</a>`

            let theHtml = "Broswer: ";
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
            document.getElementById('browserIcons').innerHTML = theHtml
            document.getElementById('browserIcons').classList.remove('d-none');
        }
        //make the snapshot xhr call
        xhrcall(1, `${apiUrl}image/latest/?projectId=${getUrlParamater("projectId")}&projectDataId=${getUrlParamater("projectDataId")}`, "", "json", "", snapshotDone, getToken());
    };
    //fetch the different user agents for the project
    xhrcall(1, `${apiUrl}admin/userbrowsers?projectId=${getUrlParamater("projectId")}`, "", "json", "", browsersDone, token);

})
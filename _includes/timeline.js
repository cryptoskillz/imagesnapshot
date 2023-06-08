//get the project
let project = JSON.parse(window.localStorage.currentDataItem);

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    document.getElementById('showBody').classList.remove('d-none');


    // Get the reference to the data header
    const timelineDone = (res) => {
        const results = JSON.parse(res);
        //var timeline = new TimelineJS(document.getElementById('timeline'));
        let finHtml = "";
        //set the url and the name
        document.getElementById('timelineHeader').innerHTML = `<a href="${project.url}" target="_blank">${project.name}</a>`
        for (var i = 0; i < results.data.length; ++i) {
            // Create a new Date object from the timestamp
            const date = new Date(results.data[i].createdAt);
            // Convert the date to a human-readable format
            const humanReadableDate = date.toLocaleString();
            const theImage = `<img src="${apiUrl}image/image/?imageId=${results.data[i].kvId}" style="width:300px;height:900px" class="img-snapshot"/>`;
            if (i % 2 === 0) {

                finHtml = finHtml + `<!-- timeline item 1 -->
                      <div class="row no-gutters">
                        <div class="col-sm"> <!--spacer--> </div>
                        <!-- timeline item 1 center dot -->
                        <div class="col-sm-1 text-center flex-column d-none d-sm-flex">
                          <div class="row h-50">
                            <div class="col">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                          </div>
                          <h5 class="m-2">
                            <span class="badge badge-pill bg-light border">&nbsp;</span>
                          </h5>
                          <div class="row h-50">
                            <div class="col border-right">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                          </div>
                        </div>
                        <!-- timeline item 1 event content -->
                        <div class="col-sm py-2">
                          <div class="card">
                            <div class="card-body">
                              <div class="float-right text-muted small">${humanReadableDate}</div>
                              <h4 class="card-title">${results.data[i].browserDefault} </h4>
                              <p class="card-text">${results.data[i].browserOs} ${results.data[i].screenWidth}x${results.data[i].screenHeight}</p>
                              <p class="card-text">${theImage}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!--/row-->
                      `
            } else {
                finHtml = finHtml + `
                      <!-- timeline item 2 -->
                      <div class="row no-gutters">
                        <div class="col-sm py-2">
                          <div class="card">
                            <div class="card-body">
                              <div class="float-right small">${humanReadableDate}</div>
                            <h4 class="card-title">${results.data[i].browserDefault} </h4>
                              <p class="card-text">${results.data[i].browserOs} ${results.data[i].screenWidth}x${results.data[i].screenHeight}</p>                </div>
                              <p class="card-text">${theImage}</p>
                          </div>
                        </div>
                        <div class="col-sm-1 text-center flex-column d-none d-sm-flex">
                          <div class="row h-50">
                            <div class="col border-right">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                          </div>
                          <h5 class="m-2">
                            <span class="badge badge-pill bg-light border">&nbsp;</span>
                          </h5>
                          <div class="row h-50">
                            <div class="col border-right">&nbsp;</div>
                            <div class="col">&nbsp;</div>
                          </div>
                        </div>
                        <div class="col-sm"> <!--spacer--> </div>
                      </div>
                      <!--/row-->`
            }


        }

        document.getElementById("timeline").innerHTML = finHtml

    }
    //make the snapshot xhr call
    xhrcall(1, `${apiUrl}admin/timeline/?projectId=${project.id}&projectDataId=${window.localStorage.currentDataItemId}`, "", "json", "", timelineDone, token);
})
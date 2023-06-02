//get the project
let currentDataItem = JSON.parse(window.localStorage.currentDataItem);
//get the level 2 id
let currentDataItemId = window.localStorage.currentDataItemId;

//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}
//hold the look up data
let lookUpData = "";
//hold the results
let level1Data;

/*
This function handles the project select

*/
let projectSelectChange = (id, theElement) => {
    //clear the current element
    //note : Not sure why we cleared it here previoulsy as we need it.  Could be related to the caching we used to do I will leave it here as a reminder
    //       until iam sure I have not broken anything further down the chain.
    //window.localStorage.currentDataItem = "";
    //console.log(id)
    for (var i = 0; i < level1Data.data.length; ++i) {
        if (id == level1Data.data[i].id) {
            window.localStorage.currentDataItem = JSON.stringify(level1Data.data[i])
        }
    }
    //store the ID
    window.localStorage.currentDataItemId = id;
    //console.log(window.localStorage.currentDataItemId)
    //store the table
    window.localStorage.mainTable = theSettings.table;
    //load the URL
    if (theElement.value != 0) {
        //check if we want it in a new window
        if (theElement.value.indexOf("&target=_blank") > 0) {
            //remove the blank
            const result = theElement.value.replace("&target=_blank", "");
            //open it
            window.open(result, '_blank');
        } else {
            //set the href
            window.location.href = theElement.value;
        }

    }
}


whenDocumentReady(isReady = () => {

    let init = async (theSettings) => {
        //debug 
        console.log(theSettings);
        //get the token
        token = getToken();
        //set a url array
        let urls = [];
        let tmpUrl = "database/table-join?"
        //set the primary table 
        tmpUrl = tmpUrl + `primarytable=${theSettings.primaryTable}&`
        //set the foreign name
        tmpUrl = tmpUrl + `foreigntable=${theSettings.foriegnTable}&`
        //set the primary fields
        tmpUrl = tmpUrl + `primaryFields=${theSettings.primaryFields}&`
        //set the foriegn fields
        tmpUrl = tmpUrl + `foreignFields=${theSettings.foreignFields}&`
        //set the current data item
        if (theSettings.currentDataItem == 1)
            tmpUrl = tmpUrl + `currentDataItem=${currentDataItem.id}&`
        else
             tmpUrl = tmpUrl + `currentDataItem=&`
        //set the current data item
        if (theSettings.currentDataItemId == 1)
            tmpUrl = tmpUrl + `currentDataItemId=${currentDataItemId}`
        else
            tmpUrl = tmpUrl + `currentDataItemId=`

        //set the call
        const tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "getTableDone", "xhrType": 1 }
        //add it to the url array
        urls.push(tmpXhrCalls)
        let getTableDone = (res) => {
            const results = JSON.parse(res);
            console.log(results);

        }
        //loop through the urls and call them
        for (var i = 0; i < urls.length; ++i) {
            console.log(`processing XHR call ${urls[i].url}`)
            let xhrRes = await xhrcall(urls[i].xhrType, urls[i].url, "", "json", "", eval(urls[i].doneFunction), token)
        }
        //show the body
        document.getElementById('showBody').classList.remove('d-none');

    }
    init(theSettings);
})
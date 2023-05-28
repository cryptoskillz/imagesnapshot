//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}
let lookUpData;
let schemaData;

whenDocumentReady(isReady = () => {


    /*
        This is for the unit testing it basically tells us that we are using cypress and to hard code the localstorage.
    */
    if (window.location.pathname != `/${level1name}/`) {
        var ua = window.navigator.userAgent;
        if (ua == `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/10.11.0 Chrome/106.0.5249.51 Electron/21.0.0 Safari/537.36`) {
            window.localStorage.currentDataItem = `{"id":1,"name":"DCONDO","currentlyRented":1,"state":0,"internationalCost":52087,"createdAt":"2023-01-24 13:08:31"}`
            window.localStorage.currentDataItemId = '1';
            window.localStorage.mainTable = "property";

        }
        console.log(ua)
    }


    //set a url array
    let urls = [];
    //process the schema
    let getSchemaDone = (res) => {
        //console.log(res);
        schemaData = JSON.parse(res);
        //console.log(res)
        let formHtml = "";
        for (var i = 0; i < schemaData.length; ++i) {
            //console.log(res[i].name)
            formHtml = formHtml + buildFormElement(schemaData[i]);
        }
        //set table name
        document.getElementById('formTableName').value = theSettings.table;
        //set the inputs
        document.getElementById('formInputs').innerHTML = formHtml;
        //show the body div
        document.getElementById('showBody').classList.remove('d-none')
    }
    //process the look up 
    //note: not sure if this is required in the add new page. 
    let lookUpDone = (res) => {
        lookUpData = JSON.parse(res);
        //console.log(lookUpData);
    }


    let init = async (theSettings) => {

        if (theSettings.title != '') {
            document.getElementById('data-header').innerHTML = theSettings.title;
        } else {
            //set the tmpName
           // let tmpName = theSettings.table.replace("_", " ");
            document.getElementById('data-header').innerHTML = `add a new ${level2name}`
        }
        //build the look up url
        //let tmpLookUpUrl = "";
        if (theSettings.lookUps != "") {
            //turn it into a string
            console.log(theSettings.lookUps);
            const lookUps = JSON.stringify(theSettings.lookUps)
            //build the url
            const tmpUrl = apiUrl + `database/lookUp?theData=${lookUps}&id=${window.localStorage.currentDataItemId}`
            //create the json objecr
            const tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "lookUpDone", "xhrType": 1 }
            //add it to the array
            urls.push(tmpXhrCalls)
            //set the look up url
            //tmpLookUpUrl = `lookUps=${lookUps}`;
        }
        //build the schema URL
        let tmpUrl = apiUrl + `database/schema?tablename=${theSettings.table}&fields=${theSettings.fields}`
        let tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "getSchemaDone", "xhrType": 1 }
        urls.push(tmpXhrCalls);
        //loop through the urls and call them
        for (var i = 0; i < urls.length; ++i) {
            console.log(`processing XHR call ${urls[i].url}`)
            let xhrRes = await xhrcall(urls[i].xhrType, urls[i].url, "", "json", "", eval(urls[i].doneFunction), token)
        }
    }
    init(theSettings);
});
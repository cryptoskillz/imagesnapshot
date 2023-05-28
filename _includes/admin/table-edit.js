 //add a ready function
 let whenDocumentReady = (f) => {
     /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
 }

 let lookUpData;
 let schemaData;


 whenDocumentReady(isReady = () => {
    /*
        This is
        for the unit testing it basically tells us that we are using cypress and to hard code the localstorage.
    */
    /*
        This is
        for the unit testing it basically tells us that we are using cypress and to hard code the localstorage.
    */
    var ua = window.navigator.userAgent;
    if (ua == `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Cypress/10.11.0 Chrome/106.0.5249.51 Electron/21.0.0 Safari/537.36`) {
        window.localStorage.currentDataItem = `{"id":1,"name":"DCONDO","currentlyRented":1,"state":0,"internationalCost":52087,"createdAt":"2023-01-24 13:08:31"}`
        window.localStorage.currentDataItemId = '1';
        window.localStorage.mainTable = "property";
    }
    //console.log("ua")
    console.log(ua)


     //set a url array
     let urls = [];
     //process the schema
     let getSchemaDone = (res) => {
         //console.log(res);
         schemaData = JSON.parse(res);
         //console.log(schemaData);
     }
     //process the look up 
     //note: not sure if this is required in the add new page. 
     let lookUpDone = (res) => {
        lookUpData = JSON.parse(res);
     }

     //process the data.
     let getTableDone = (res) => {
         //parse the repsonse
         res = JSON.parse(res)
         if (res.data.length == 0) {
             showAlert(`${level2name} not found`, 2, 0);
             return;
         }

         //set the form html
         let formHtml = "";
         //loop through the scema
         for (var i = 0; i < schemaData.length; ++i) {
             //pass in the field name and the values
             //note: at the moment we pass in all the values, we could make this neater by adding the schema info into the 
             //      main data result but this would break standard sqlite api return formats so may not go ahead and do that.
             formHtml = formHtml + buildFormElement(schemaData[i], res.data[0]);
         }
         //set table name
         document.getElementById('formTableName').value = theSettings.table;
         //set the form
         document.getElementById('formInputs').innerHTML = formHtml;
         //show the body div
         document.getElementById('showBody').classList.remove('d-none');
     }

     let init = async (theSettings) => {
         if (theSettings.title != '') {
             document.getElementById('data-header').innerHTML = theSettings.title;
         } else {
             //set the tmpName
             let tmpName = theSettings.table.replace("_", " ");
             document.getElementById('data-header').innerHTML = `edit the ${tmpName}`
         }

        //get the record Id
         let recordId = getUrlParamater('id');
         //if its blank get it from local storage
         if (recordId == "")
             recordId = window.localStorage.currentDataItemId
         //end it.
         if (recordId == "") {
            showAlert(`${level2name}  ID not set`, 2, 0)
             return;
         }

         //build the schema URL
         let tmpUrl = apiUrl + `database/schema?tablename=${theSettings.table}&fields=${theSettings.fields}&id=${window.localStorage.currentDataItemId}`
         let tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "getSchemaDone", "xhrType": 1 }
         urls.push(tmpXhrCalls);
         //build the look up url
         //let tmpLookUpUrl = "";
         if ((theSettings.lookUps != undefined) && (theSettings.lookUps != "")) {
             //turn it into a string
             const lookUps = JSON.stringify(theSettings.lookUps)
             //build the url
             const tmpUrl = apiUrl + `database/lookUp?theData=${lookUps}`
             //create the json objecr
             const tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "lookUpDone", "xhrType": 1 }
             //add it to the array
             urls.push(tmpXhrCalls)
             //set the look up url
             //tmpLookUpUrl = `lookUps=${lookUps}`;
         }

         //build the table call
         tmpUrl = apiUrl + `database/table?tablename=${theSettings.table}&fields=${theSettings.fields}&recordId=${recordId}`
         tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "getTableDone", "xhrType": 1 }
         urls.push(tmpXhrCalls)

         //loop through the urls and call them
         for (var i = 0; i < urls.length; ++i) {
             console.log(`processing XHR call ${urls[i].url}`)
             let xhrRes = await xhrcall(urls[i].xhrType, urls[i].url, "", "json", "", eval(urls[i].doneFunction), token)
         }

     }
     init(theSettings);

 });
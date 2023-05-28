/*
todo 

*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}
//hold the look up data
let lookUpData = "";
//hold the results
let level1Data;

/*
This function handles the property select
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
        //console.log("ua")
        console.log(ua)
    }




    let getTableDone = (res) => {

        //set the edit and delete buttons
        let deleteButton = "";
        let editButton = "";
        let customSelect = "";
        let customButton = ""

        //replace the title 
        if (theSettings.title != "") {
            document.getElementById('recordTitle').innerHTML = theSettings.title
        }


        //parse json results
        res = JSON.parse(res)
        level1Data = res;
        //check if we want to display the create new button or not.
        if (theSettings.allowOnlyOne == 1) {
            if (res.data.length == 0)
                document.getElementById('btn-create-cy').classList.remove('d-none');
        } else {
            document.getElementById('btn-create-cy').classList.remove('d-none');
        }
        //get the datatable
        table = $('#dataTable').DataTable();

        //process the results
        for (var i = 0; i < res.data.length; ++i) {
            //set the data 
            let theData = res.data[i];
            //build the buttons
            deleteButton = "";
            editButton = "";
            customSelect = "";
            customButton = ""
            ''
            //get the custom select
            if (theSettings.customSelect != "") {
                //parse the custom select
                let tmpCustomSelect = theSettings.customSelect;
                //parse the custom button
                tmpCustomSelect = tmpCustomSelect.replaceAll("[id]", theData.id);
                tmpCustomSelect = tmpCustomSelect.replaceAll("[name]", theData.name);
                tmpCustomSelect = tmpCustomSelect.replaceAll("[counter]", i);
                customSelect = tmpCustomSelect;
            }
            if (theSettings.customButton != "") {
                //parse the custom select
                let tmpcustomButton = theSettings.customButton;
                //get the fields
                let thefields = theSettings.fields.split(",")
                //loop through them
                for (var i2 = 0; i2 < thefields.length; ++i2) {
                    //loop through the returned JSON object
                    for (const key in theData) {
                        //check if there is a match
                        if (`[${key}]` == `[${thefields[i2]}]`) {
                            //build the search 
                            const theSearch = `[${thefields[i2]}]`
                            //replace it
                            tmpcustomButton = tmpcustomButton.replaceAll(theSearch, theData[key]);
                        }
                    }

                    // tmpcustomButton = tmpcustomButton.replaceAll(`[${theFields[i2]}]`, theData.id);

                }
                //tmpcustomButton = tmpcustomButton.replaceAll("[id]", theData.id);
                //tmpcustomButton = tmpcustomButton.replaceAll("[name]", theData.name);
                ///tmpcustomButton = tmpcustomButton.replaceAll("[counter]", i);
                customButton = tmpcustomButton;
            }

            //check if its an admin
            if (user.isAdmin == 1) {
                //build the edit and delete button
                //note now we have the hide delete and hide edit buttpn we may not require this admin check
                editButton = `<a id="edit-${i}-cy" href="${theSettings.crumb}edit?id=${theData.id}" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-edit fa-sm text-white-50"></i> Edit</a>`
                deleteButton = `<a id="delete-${i}-cy" href="javascript:deleteTableItem(${theData.id},'database/table/','${theSettings.table}')" class="d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`
                if (theSettings.editButton == 0)
                    editButton = "";
                if (theSettings.deleteButton == 0)
                    deleteButton = "";

            }

            //set a table row array
            let tableRow = [];
            //set the amount
            let famount = 0;
            //loop through the keys
            for (const key in theData) {
                //set the data
                let tData = theData;
                //set the value
                let tmpValue = tData[key];
                //check if we have to format it
                //note this is checking the field name we could use the scheam and check if it is real 
                //check if its a hyperlink 
                let res = isValidHttpUrl(tmpValue);
                if (res == true) {
                    if (theData.name != undefined)
                        tmpValue = `<a href="${tmpValue}" target="_blank">${theData.name}</a>`
                    else
                        tmpValue = `<a href="${tmpValue}" target="_blank">${tmpValue}</a>`

                }

                tmpValue = processlocalReplace(key, theSettings.localReplace, tmpValue)

                //check if it is a look up
                if (lookUpData != "") {
                    //loop through the look up data
                    for (var i2 = 0; i2 < lookUpData.length; ++i2) {
                        //check if it is the field we are being looked at
                        if (key == lookUpData[i2].key) {
                            //set the value for checking
                            let localTmpValue = tmpValue
                            //loop through the look up data 
                            for (var i3 = 0; i3 < lookUpData[i2].theData.length; ++i3) {
                                //check if the id matches the tempvalue we set
                                if (lookUpData[i2].theData[i3].id == localTmpValue) {
                                    //replace it
                                    localTmpValue = lookUpData[i2].theData[i3].name;
                                    //update the temp value so we can render it out.
                                    tmpValue = localTmpValue;
                                    break;
                                }
                            }
                        }
                    }
                }

                //check if we have to fomat any of the fields
                for (var i2 = 0; i2 < theSettings.formatFields.length; ++i2) {
                    if (key == theSettings.formatFields[i2].field) {
                        //console.log(formatFields[i2])
                        tmpValue = eval(theSettings.formatFields[i2].function)
                    }
                }

                //add the table row
                tableRow.push(tmpValue);
                tmpvalue = "";
            }
            //add the buttons to the action row
            buildColumn = 1;
            tableRow.push(`${editButton} ${deleteButton} ${customButton} ${customSelect} `);
            //add the table rows
            var rowNode = table
                .row.add(tableRow)
                .draw()
                .node().id = theData.id;

        }
        //if there are no actions hide the action column
        if ((editButton == "") && (deleteButton == "") && (customButton == "") && (customSelect == "")) {
            table.column(table.columns().nodes().length - 1).visible(false)
            table.columns.adjust();
        }
    }




    let init = async (theSettings) => {
        //get the token
        token = getToken();
        //set a url array
        let urls = [];

        //check if there is a local look up and add it to the URL table
        let tmpLookUpUrl = "";
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
            tmpLookUpUrl = `lookUps=${lookUps}`;
        }

        //build the URL for the main table rendering call. 
        //note : this changes based on where you are level 1 index etc.
        let tmpUrl = "database/table?"
        //check if we are doing an admin check
        let tmpUrlParam = ""
        if ((theSettings.checkAdmin != undefined) && (theSettings.checkAdmin != ""))
            tmpUrlParam = `checkAdmin=${theSettings.checkAdmin}&`;
        //add the check admin
        tmpUrl = tmpUrl + `${tmpUrlParam}`;
        //set the table name
        tmpUrl = tmpUrl + `tablename=${theSettings.table}&`
        //set the fields
        tmpUrl = tmpUrl + `fields=${theSettings.fields}&`
        //set the schema
        //tmpUrl = tmpUrl + `getOnlyTableSchema=${getOnlyTableSchema}&`
        //set the id
        if (theSettings.foreignKey == "")
            tmpUrl = tmpUrl + `recordId=${window.localStorage.currentDataItemId}`
        else {
            tmpUrl = tmpUrl + `foreignKey=${theSettings.foreignKey}&recordId=${window.localStorage.currentDataItemId}`
        }

        const tmpXhrCalls = { "url": `${tmpUrl}`, "doneFunction": "getTableDone", "xhrType": 1 }
        //add it to the url array
        urls.push(tmpXhrCalls)
        //console.log(urls);
        //todo: process the look up done
        let lookUpDone = (res) => {
            res = JSON.parse(res);
            lookUpData = res;

        }

        //loop through the urls and call them
        for (var i = 0; i < urls.length; ++i) {
            //console.log(`processing XHR call ${urls[i].url}`)
            let xhrRes = await xhrcall(urls[i].xhrType, urls[i].url, "", "json", "", eval(urls[i].doneFunction), token)
        }
        //show the body
        document.getElementById('showBody').classList.remove('d-none');

    }
    init(theSettings);

})
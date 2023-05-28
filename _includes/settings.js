//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {


    //build the url
    let theUrl = apiUrl+'settings/';
    //get the token
    let token = getToken();
    
    //process the settings
    let settingsDone = (res) => {
        //parse the settings
        res = JSON.parse(res);
        //set it
        document.getElementById('inp-companyname').value = res.settings.companyName;
    }
    //call the API to get the settings
    xhrcall(1,theUrl, "", "json", "", settingsDone, token)

    //update it
    document.getElementById('btn-edit').addEventListener('click', function() { //api call done
        let xhrDone = (res) => {
            res = JSON.parse(res)
            //show the message
            showAlert(res.message, 1)
        }
        //check there is data to submit
        let bodyJson = {
            companyName: document.getElementById('inp-companyname').value
        }
        bodyJson = JSON.stringify(bodyJson);
        //call it
        xhrcall(4, theUrl, bodyJson, "json", "", xhrDone, token);
    })
    //show the body
    document.getElementById('showBody').classList.remove('d-none');

});

/*
todo 

update the field rendering in  render  table

*/
//add a ready function
let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

let loadURL = (theUrl, theId, blank = 0) => {
    deleteProjectAlldata()
    let theProject = getCacheProjects(theId)
    if (blank == 1)
        window.open(theUrl, "_blank")
    else
        window.location.href = theUrl;
}

whenDocumentReady(isReady = () => {

    //show it
    document.getElementById('showBody').classList.remove('d-none')
    /*
    let xhrDone = (res, local = 0) => {
        //store it in local storage

        if (local == 0) {
            storeCacheProjects(res);
            res = JSON.parse(res)
        }
        //console.log(res)
        //parse the response
        //console.log(res)
        //get the datatable
        table = $('#dataTable').DataTable();
        let method = "api/projects"
        //loop through the data
        for (var i = 0; i < res.data.length; ++i) {
            let tmpName = res.data[i].name.replace(" ","-");
            //console.log(res.data[i].attributes.template)
            //theProject = res.data[i]
            let databutton = `<a href="javascript:loadURL('/project/data/','${res.data[i].id}')" id="datap-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-eye fa-sm text-white-50"></i> Data</a>`
            //  let templatebutton = `<a href="javascript:loadURL('/project/template/')" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
            // <i class="fas fa-code fa-sm text-white-50"></i> Template</a>`
            let editbutton = `<a href="javascript:loadURL('/project/edit/','${res.data[i].id}')" id="ep-${tmpName}-${i}" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-file fa-sm text-white-50"></i> Edit</a>`
            let deletebutton = `<a href="javascript:deleteTableItem('${res.data[i].id}','${res.data[i].id}','${method}')" id="dp-${tmpName}-${i}" class=" d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
    <i class="fas fa-trash fa-sm text-white-50"></i> Delete</a>`

            //get the created date

            //add the records
            var rowNode = table
                .row.add([res.data[i].id, res.data[i].name, res.data[i].createdAt, `${databutton} ${editbutton} ${deletebutton} `])
                .draw()
                .node().id = res.data[i].id;
        }
        table.columns.adjust();
    }
    projects = getCacheProjects();
    if (projects != false) {
        xhrDone(projects, 1);
    } else {
        //build the json
        let bodyobj = {
            email: user.email,
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        xhrcall(1, "api/projects/", bodyobjectjson, "json", "", xhrDone, token)

    }
    */

})
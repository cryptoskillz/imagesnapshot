let projectid = 0;
let projectname = "";

//add a ready function

let whenDocumentReady = (f) => {
    /in/.test(document.readyState) ? setTimeout('whenDocumentReady(' + f + ')', 9) : f()
}

whenDocumentReady(isReady = () => {
    let projectid = window.localStorage.currentDataItemId;
    document.getElementById('inp-projectname').value = project.name;
    document.getElementById('project-header').innerHTML = `Edit ${project.name}`;
    document.getElementById('showBody').classList.remove('d-none')


    return;
    /*
    let projectid = getProjectId();
    let project = getCacheProjects(projectid)
    //console.log(project)
    document.getElementById('inp-projectname').value = project.name;
    document.getElementById('project-header').innerHTML = `Edit ${project.name}`;
    document.getElementById('showBody').classList.remove('d-none')
    
    document.getElementById('btn-edit').addEventListener('click', function() {
        let xhrDone = (res) => {
            res = JSON.parse(res)
            updateCacheProjects(project)            
            showAlert(res.message, 1)
            document.getElementById('project-header').innerHTML = `Edit ${project.name}`;
        }
        //set the valid var
        let valid = 1;
        //get the details
        let projectname = document.getElementById('inp-projectname');
        if (projectname.value == "") {
            valid = 0;
            showAlert("Project name cannot be blank", 2);
        }
        if (valid == 1) {
            let bodyobj = {
                name: projectname.value,
                id: project.id
            }
            project.name = projectname.value
            var bodyobjectjson = JSON.stringify(bodyobj);
            xhrcall(4, `api/projects/`, bodyobjectjson, "json", "", xhrDone, token)
        }
    });
    */
})
let redirectUrl = ""; // hold the redcirect URL
let token;
let user;
let checkElement
var table // datatable
//TODO: replace this with plain js
(function($) {
    "use strict"; // Start of use strictß

    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
        $("body").toggleClass("sidebar-toggled");
        $(".sidebar").toggleClass("toggled");
        if ($(".sidebar").hasClass("toggled")) {
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function() {
        if ($(window).width() < 768) {
            $('.sidebar .collapse').collapse('hide');
        };

        // Toggle the side navigation when window is resized below 480px
        if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
            $("body").addClass("sidebar-toggled");
            $(".sidebar").addClass("toggled");
            $('.sidebar .collapse').collapse('hide');
        };
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
        if ($(window).width() > 768) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
        }
    });

    // Scroll to top button appear
    $(document).on('scroll', function() {
        var scrollDistance = $(this).scrollTop();
        if (scrollDistance > 100) {
            $('.scroll-to-top').fadeIn();
        } else {
            $('.scroll-to-top').fadeOut();
        }
    });

    // Smooth scrolling using jQuery easing
    $(document).on('click', 'a.scroll-to-top', function(e) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top)
        }, 1000, 'easeInOutExpo');
        e.preventDefault();
    });

})(jQuery); // End of use strict

/*
START OF LOCAL CACHE FUNCTIONS
*/

let clearCache = (clearUser = 0) => {
    window.localStorage.projectAlldata = ""
    window.localStorage.projectdata = ""
    window.localStorage.projects = ""
    window.localStorage.project = ""
    if (clearUser == 1) {
        window.localStorage.token = ""
        window.localStorage.user = ""
    }
}
//project data
let getUser = () => {
    return (JSON.parse(window.localStorage.user))
}
//project data
let deleteProjectAlldata = () => {
     window.localStorage.projectAlldata = ""
}


let addCachedProjectData = (theData, debug = 0) => {
    //parse the response
    let projectdata = window.localStorage.projectAlldata
    projectdata = JSON.parse(projectdata);
    if (debug == 1) {
        console.log(theData)
        console.log(projectdata)

    }
    projectdata.push(JSON.parse(theData.data));
    window.localStorage.projectAlldata = JSON.stringify(projectdata)
    
}

let storeProjectAlldata = (theData, debug = 0) => {
    if (debug == 1) {
        console.log("theData")
        console.log(theData)
    }
    //check we have data to store
    if ((theData != '{"data":[]}') && (theData != '')) {
        //parse it
        //note we are storing this dumb as it never renders once its is stored
        theData = JSON.parse(theData.data);
        //debug
        if (debug == 1) {
            console.log(theData)
        }
        //store it.
        //let tmp = { data: [] };
        //tmp.data.push(theData.data)
        //console.log(tmp)
        window.localStorage.projectAlldata = JSON.stringify(theData);
    }

}

let getCurrentProjectData = (debug = 0) => {
    if (debug == 1)
        console.log(window.localStorage.projectdata);
    let projectdata = window.localStorage.projectdata
    let project;
    if ((project != "") && (project != null))
        project = JSON.parse(window.localStorage.projectdata)
    else
        project = false;
    return (project)

}

let updateProjectAllData = (theProjectData = "", debug = 0) => {
    let theItems = window.localStorage.projectAlldata;
    let newData = []

    theProjectData = JSON.parse(theProjectData)
    if (debug == 1) {
        //theProjectData = JSON.parse(theProjectData)
        console.log("theProjectData")
        console.log(theProjectData)

    }
    if (theItems == undefined) {
        if (debug == 1)
            consolel.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        if (debug == 1) {
            console.log(theItems)
        }
        for (var i = 0; i < theItems.length; ++i) {
            if (theItems[i].id == theProjectData.id) {
                if (debug == 1) {
                    console.log("Found it" + theProjectData.id)
                    console.log(theItems[i])
                }
                //update the project
                theItems[i].data = theProjectData.data;
                window.localStorage.projectdata = JSON.stringify(theProjectData);
                window.localStorage.projectAlldata = JSON.stringify(theItems);
            }

        }
    }
}



let getProjectAlldata = (theId = "", debug = 0) => {
    let theItems = window.localStorage.projectAlldata;

    if ((theItems == undefined) || (theItems == "")) {
        if (debug == 1)
            console.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        //console.log(data)
        if (theId != "") {
            for (var i = 0; i < theItems.length; ++i) {
                if (debug == 1) {
                    console.log(theItems[i].id + " : " + theId)
                }
                if (theItems[i].id == theId) {
                    if (debug == 1) {
                        console.log('found it')
                        console.log(theItems[i])
                    }
                    //update the data
                    window.localStorage.projectdata = JSON.stringify(theItems[i]);
                    return (theItems[i]);
                }
            }
        } else {
            if (debug == 1) {
                console.log(theItems)
            }
            return (theItems)
        }
    }
}

let removeCachedProjectData = (theId, debug = 0) => {

    //note could not really get this working so just delete the whole thing
    //window.localStorage.projectAlldata = '';


    let theItems = window.localStorage.projectAlldata
    theItems = JSON.parse(theItems);
    let newItems = {};
    if (debug == 1) {
        console.log(theItems)
        console.log(theId)

    }
    for (var i = 0; i < theItems.length; ++i) {
        if (debug == 1) {
            console.log("checking " + theItems[i].id + " : " + theId)
            console.log(theItems[i])
        }
        if (theItems[i].id == theId) {

            //delete theItems.data[i];
            if (debug == 1) {
                console.log("Found the id " + theId + " : " + i)
                console.log(theItems[i].data)
            }
            //delete the item
            delete theItems[i]
            //remove the nul
            theItems = theItems.filter(function(x) { return x !== null });
            window.localStorage.projectAlldata = JSON.stringify(theItems);
        }
    }
    //return (true)

}

//projects

let removeCachedProject = (theId, debug = 0) => {
    let theItems = window.localStorage.projects
    theItems = JSON.parse(theItems);
    for (var i = 0; i < theItems.data.length; ++i) {
        if (theItems.data[i].id == theId) {
            if (debug == 1) {
                console.log(theItems.data[i])
            }
            //delete theItems.data[i];
            theItems.data.splice(i, 1);
            //update the data
            window.localStorage.projects = JSON.stringify(theItems);
            return (true);

        }
    }
    return (false)

}

let addCachedProject = (theData, debug = 0) => {
    //parse the response
    let projects = window.localStorage.projects
    projects = JSON.parse(projects);
    //parse the data
    theData = JSON.parse(theData);
    if (debug == 1) {
        console.log(theData)
        console.log(theData.data)

    }
    //add it to projects
    let tmp = JSON.parse(theData.data)
    projects.data.push(tmp);
    window.localStorage.projects = JSON.stringify(projects)
    showAlert(theData.message, 1)
}

let storeCacheProjects = (theData, debug = 0) => {
    //show debug info
    if (debug == 1) {
        console.log(theData)
    }
    window.localStorage.projects = theData;

}

let updateCacheProjects = (theProject = "", debug = 0) => {
    let theItems = window.localStorage.projects;
    if (theItems == undefined) {
        if (debug == 1)
            consolel.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        if (debug == 1) {
            console.log(theItems)
        }
        for (var i = 0; i < theItems.data.length; ++i) {
            if (debug == 1) {
                console.log("checking " + theItems.data[i].id + " : " + theProject.id)
                console.log(theItems.data[i])
            }
            if (theItems.data[i].id == theProject.id) {
                if (debug == 1) {
                    console.log("Found the id " + theProject.id)
                    console.log(theItems.data[i])
                }
                //update the project
                theItems.data[i] = theProject;
                //update the data
                window.localStorage.project = JSON.stringify(theProject);
                window.localStorage.projects = JSON.stringify(theItems);
                //return (theItems.data[i]);
            }
        }
    }
}

let getCacheProjects = (theId = "", debug = 0) => {
    let theItems = window.localStorage.projects;
    if ((theItems == undefined) || (theItems == "") || (theItems == null)) {
        if (debug == 1)
            consolel.log("no items");
        return (false)
    } else {
        theItems = JSON.parse(theItems)
        if (debug == 1) {
            console.log(theItems)
        }
        //console.log(data)
        if (theId != "") {
            for (var i = 0; i < theItems.data.length; ++i) {
                if (theItems.data[i].id == theId) {
                    if (debug == 1) {
                        console.log(theItems.data[i])
                    }
                    //update the data
                    window.localStorage.project = JSON.stringify(theItems.data[i]);
                    return (theItems.data[i]);
                }
            }
        } else {
            return (theItems)
        }
    }
}

let getCurrentProject = (debug = 0) => {
    if (debug == 1)
        console.log(window.localStorage.project);
    let project = JSON.parse(window.localStorage.project)
    return (project)

}

let getProjectId = (debug = 0) => {
    if (debug == 1)
        console.log(window.localStorage.project);
    let project = window.localStorage.project 
    if ((project == "") || (project == null)) {
        return ("")
    } else
    {
        project = JSON.parse(project)
        return (project.id)
    }

}
//getCacheProjects("1defd828-d637-44bd-9329-0d703de4b4a4")
///getCacheProjects("fe9264c4-c20b-4498-b835-08784567f3f6")
//getCacheProjects();
/*
END OF LOCAL CACHE FUNCTIONS
*/

/*
START OF TABLE FUNCTIONS
*/


let deleteId = 0;
let tableRowId = 0;
let deleteMethod = "";

checkElement = document.getElementById("confirmation-modal-delete-button");

if (typeof(checkElement) != 'undefined' && checkElement != null) {
    document.getElementById('confirmation-modal-delete-button').addEventListener('click', function() {
        $('#confirmation-modal').modal('toggle')
        let xhrDone = (res) => {
           // console.log(deleteMethod)
            //parse the response
            console.log(res)
            showAlert('Item has been deleted', 1)
            table.row('#' + tableRowId).remove().draw()
            if (deleteMethod == "api/projects") {
                removeCachedProject(deleteId)

            }
            if (deleteMethod == "api/projectdata") {
                console.log(deleteId)
                removeCachedProjectData(deleteId, 0)

            }

        }
        //let project = window.localStorage.project
        //project = JSON.parse(project)
        let project = getCacheProjects(deleteId);
        let bodyobj = {
            dataid: deleteId,
            projectid: project.id
        }
        var bodyobjectjson = JSON.stringify(bodyobj);
        //call the create account endpoint
        xhrcall(3, `${deleteMethod}/`, bodyobjectjson, "json", "", xhrDone, token)

    })
}


let deleteTableItem = (dId, tId, method) => {
    deleteId = dId;
    tableRowId = tId;
    deleteMethod = method;
    $('#confirmation-modal').modal('toggle')
}





/*
END OF TABLE FUNCTIONS
*/

//this fucntion validates an email address.
let validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

let goBack = () => {
    history.back();
}

let showAlert = (message, alertType, timeoutBool = 1) => {
    let alertEl;
    //set the alert type
    if (alertType == 1)
        alertEl = document.getElementById('accountsSuccess');
    if (alertType == 2)
        alertEl = document.getElementById('accountsDanger');
    //set the message
    alertEl.innerHTML = message
    //remove the class
    alertEl.classList.remove('d-none');
    //clear it after 5 seconds
    if (timeoutBool == 1)
        alertTimeout = setTimeout(function() { alertEl.classList.add('d-none') }, 5000);


}

/* 

start of global account stuff

Ideally this should live in accounts.js but seeing as require it on every page we put it here instead otherwise we would have
to include accounts.js and app.js in every page

*/

let getToken = () => {
    token = window.localStorage.token;
    if ((token != "") && (token != undefined)) {
        return (token);
    } else {
        return ("")
    }
}


let logout = () => {
    alert('to do logout')
}


let checkLogin = () => {
    //check if it is not a login page
    if ((window.location.pathname == "/create-account/") || (window.location.pathname == "/login/") || (window.location.pathname == "/forgot-password/")) {
        //window.location = '/'
    } else {
        //get the user object
        let tmpUser = window.localStorage.user
        //check it exists
        if (tmpUser != undefined) {
            //decode the json
            user = JSON.parse(window.localStorage.user);
            //check the user is logged in some one could spoof this so we could do a valid jwt check here 
            //but i prefer to do it when we ping the api for the data for this user. 
            if (user.loggedin != 1) {
                window.location = '/login'
            } else {
                //set the jwt and user
                getToken();
                checkElement = document.getElementById("user-account-header");
                if (typeof(checkElement) != 'undefined' && checkElement != null) {
                    if ((user.username != "") && (user.username != undefined))
                        document.getElementById('user-account-header').innerHTML = user.username
                    else
                        document.getElementById('user-account-header').innerHTML = user.email
                }
            }
        } else {
            window.location = '/login'
        }

    }
}


/* 

end of global account stuff

*/


let getUrlParamater = (param) => {
    let searchParams = new URLSearchParams(window.location.search)
    let res = searchParams.has(param) // true
    if (res != false)
        return (searchParams.get(param))
    else
        return ("");

}



//this function makes the XHR calls.
let xhrcall = (type = 1, method, bodyObj = "", setHeader = "", redirectUrl = "", callback = '', auth = "") => {
    //debug
    //console.log(apiUrl)
    //console.log(bodyObj)
    //console.log(method)
    //console.log(callback)

    /*
      Note if we are not using strai and have a custom URL we can change it here like wise if we want to use 2 we can check the method to select the correct base url
    */

    checkElement = document.getElementById("spinner");

    if (typeof(checkElement) != 'undefined' && checkElement != null) {
        document.getElementById("spinner").classList.remove("d-none");
    }
    let url = apiUrl + method;
    //store the type
    let xhrtype = '';
    switch (type) {
        case 0:
            xhrtype = 'POST';
            break;
        case 1:
            xhrtype = 'GET';
            break;
        case 2:
            xhrtype = 'PATCH';
            break;
        case 3:
            xhrtype = 'DELETE';
            break;
        case 4:
            xhrtype = 'PUT';
            break;
        default:
            xhrtype = 'GET';
            break;
    }

    //set the new http request
    let xhr = new XMLHttpRequest();
    xhr.open(xhrtype, url);

    //set the header if required
    //note (chris) this may have to be a switch
    if (setHeader == "json")
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    if (auth != "")
        xhr.setRequestHeader("Authorization", "Bearer " + auth);
    //send the body object if one was passed
    if (bodyObj !== '') {
        xhr.send(bodyObj);
    } else {
        xhr.send();
    }
    //result
    //todo (chris) make this eval back to a done function
    xhr.onload = function() {
        checkElement = document.getElementById("confirmation-modal-delete-button");

        if (typeof(checkElement) != 'undefined' && checkElement != null) {
            document.getElementById("spinner").classList.add("d-none");
        }
        //check if its an error
        let res = xhr.response;
        let errorMessage = "";

        //check for errors
        if ((xhr.status == 400) || (xhr.status == 403) || (xhr.status == 500)) {
            //process the response
            res = JSON.parse(res)
            errorMessage = res.error
            if (errorMessage == "")
                errorMessage = "Server Error"
        }
        if (xhr.status == 405) {
            errorMessage = res
        }

        if (xhr.status == 205) {
            errorMessage = res
        }

        if (errorMessage != "") {
            showAlert(errorMessage, 2)
        }


        //check if it was ok.
        if (xhr.status == 200) {
            //check if a redirecr url as passed.
            if (redirectUrl != "") {
                window.location = redirectUrl
            } else {
                //console.log(res)
                //res = JSON.parse(res)
                //console.log(res)
                eval(callback(res));
            }

        }

    }
};

checkLogin()
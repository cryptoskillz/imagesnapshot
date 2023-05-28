
require('dotenv').config();

let todaysDate = new Date();
let _YEAR = todaysDate.getFullYear();
console.log(process.env.API)
module.exports = {
    YEAR: _YEAR,
    TITLE: "IMAGE SNAPSHOT",
    STRAPLINE: "The easiest way to take snapshots of your business<br />into single page websites.",
    FEATUREHEADER1: "Create a project",
    FEATURESTRAPLNE1: "Add a project",
    FEATUREHEADER2: "Add your pages",
    FEATURESTRAPLNE2: "add the pages you want us to monitor",
    FEATUREHEADER3: "Take a snapshot",
    FEATURESTRAPLNE3: "Take images automatically on all common browser sizes",
    APIURL: process.env.APIURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    SECRET: process.env.SECRET,
    ADMINURL: process.env.ADMINURL,
    COPYRIGHT: "CRYPTOSKILLZ " + _YEAR,
    ENVIRONMENT: process.env.ELEVENTY_ENV,
    LEVEL1NAME: "projects",
    LEVEL2NAME: "project",
    ITEMSDATAMAIN: "items",
    DASHBOARDSTRAP: "Welcome to the content editor.",
    CANCREATEACCOUNT: process.env.CANCREATEACCOUNT,
    COMPLEXPASSWORD: process.env.COMPLEXPASSWORD
}
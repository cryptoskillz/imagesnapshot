//remove the comments when you have wired up the API
require('dotenv').config();
const superagent = require('superagent');

//async function to get the posts
getData = async () => {
    let method = "test-endpoint/"
    console.log(`${process.env.STRAPIAPI}${method}`)
    var res = await superagent.get(`${process.env.STRAPIAPI}backpage-projects/`).query({});
    //console.log(res.body)
    return (res.body)
}


module.exports = async () => {
    //set an array 
    let resArray = []
    //call the get get Data fuction
    //if (resArray.length === 0) resArray = await getData();

    return {
        resArray: resArray
    }

}
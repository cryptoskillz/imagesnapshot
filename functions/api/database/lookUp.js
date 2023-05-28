//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

//get the records
export async function onRequestGet(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //get the token
    let theToken = await decodeJwt(request.headers, env.SECRET);
    //get the search paramaters
    const { searchParams } = new URL(request.url);
    //get the tables
    let theData = searchParams.get('theData');
    //get the id 
    //let recordId = searchParams.get('id');
    //get the tables
    theData = JSON.parse(theData);
    //console.log(theData);
    //hold the query
    let query;
    //hold the results for the lookups
    let theResults = [];
    for (var i = 0; i < theData.length; ++i) {
        //console.log(theData[i]);
        //build the query
        let theSQL = `SELECT id,name from ${theData[i].table}`;
        //check for a foreign key
        if (theData[i].foreignKey != "")
        {
            theSQL = theSQL+` where ${theData[i].foreignKey} = ${theData[i].value}`;
            //add the is Deleted 
            theSQL = theSQL +` and isDeleted = 0`
        }
        else
        {
            //add the is Deleted 
            theSQL = theSQL +` where isDeleted = 0`
        }

        
        console.log(theSQL)
        //run it
        query = context.env.DB.prepare(theSQL);
        let queryResults = await query.all();
        //store the results
        let theJson = {"table":theData[i].table,"key":theData[i].key,"theData": queryResults.results}
        theResults.push(theJson)
    }
    ///return the response
    return new Response(JSON.stringify(theResults), { status: 200 });

}
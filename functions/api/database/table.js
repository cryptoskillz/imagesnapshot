/*

This is a generic table manager it handles updates, inserts and deletes for any table. It also handles field and whole * returns

notes

It always returns a schema (useful for building add record form dynamically)
It does not delete it uses a field called isdeleted and this is what hides it from frontend, helps if a user is an idiot
It makes assumpations on our usual data strucutres to save some code if you want it more generic then you will have to remove these assumpations



*/


//JWT model
const jwt = require('@tsndr/cloudflare-worker-jwt');
var uuid = require('uuid');
//decode the jwt token
let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

export async function onRequestPut(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let payLoad = await decodeJwt(request.headers, env.SECRET);
    //get the content type
    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        theData = await request.json();

        //UPDATE users SET name = ?1 WHERE id = ?2
        let theQuery = `UPDATE ${theData.table} SET `
        let theQueryValues = "updatedAt = CURRENT_TIMESTAMP";
        let theQueryWhere = "";
        //loop through the query data
        //console.log(theData.tableData)
        for (const key in theData.tableData) {
            let tdata = theData.tableData;
            //check it is not the table name
            //note : we could use a more elegant JSON structure and element this check
            if ((key != "table") && (key != "id")) {
                //build the fields
                theQueryValues = theQueryValues + `,${key} = '${tdata[key]}' `
            }
            //check for ad id and add a put.
            if (key == "id")
                theQueryWhere = ` where id = '${tdata[key]}'`
        }
        //compile the query
        theQuery = theQuery + theQueryValues + theQueryWhere;
        //console.log(theQuery);
        const info = await context.env.DB.prepare(theQuery)
            .run();


        return new Response(JSON.stringify({ message: `The record has been updated` }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });

}

export async function onRequestDelete(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let payLoad = await decodeJwt(request.headers, env.SECRET);

    //get the content type
    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        theData = await request.json();
        //debug
        //console.log("debug")
        //console.log(theData);
        //console.log(`UPDATE ${theData.tableName} SET isDeleted = 1 WHERE id = ${theData.id}`)
        const info = await context.env.DB.prepare(`UPDATE ${theData.tableName} SET isDeleted = '1',deletedAt = CURRENT_TIMESTAMP WHERE id = ${theData.id}`)
            //.bind(1,CURRENT_TIMESTAMP,theData.id)
            .run();
        return new Response(JSON.stringify({ message: `${theData.tableName} has been deleted` }), { status: 200 });

    }
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });


}

//insert record
export async function onRequestPost(context) {
    //build the paramaters
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    //decode the token
    let payLoad = await decodeJwt(request.headers, env.SECRET);
    //get the content type
    const contentType = request.headers.get('content-type')
    let theData;
    if (contentType != null) {
        //get the data
        theData = await request.json();

        //console.log(theData)
        //check if it is a user table and generate an API id
        let apiSecret = "";
        if (theData.table == "user")
            apiSecret = uuid.v4();
        //build the query
        let theQuery = `INSERT INTO ${theData.table} (`
        let theQueryFields = "";
        let theQueryValues = "";
        //loop through the query data
        for (const key in theData.tableData) {
            let tdata = theData.tableData;
            //check it is not the table name
            //note : we could use a more elegant JSON structure and element this check
            if (key != "table") {
                //build the fields
                if (theQueryFields == "")
                    theQueryFields = `'${key}'`
                else
                    theQueryFields = theQueryFields + `,'${key}'`

                //build the values
                if (theQueryValues == "")
                    theQueryValues = `'${tdata[key]}'`
                else
                    theQueryValues = theQueryValues + `,'${tdata[key]}'`
            }
        }
        //compile the query
        theQuery = theQuery + theQueryFields + " ) VALUES ( " + theQueryValues + " ); "
        //console.log(theQuery)
        //run the query
        const info = await context.env.DB.prepare(theQuery)
            .run();
        return new Response(JSON.stringify({ message: `Record has been added` }), { status: 200 });

    }
    return new Response(JSON.stringify({ error: "server" }), { status: 400 });
}


// 
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

    let payLoad = await decodeJwt(request.headers, env.SECRET);
    //console.log(payLoad)
    let query;
    let queryResults;
    //get the search paramaters
    const { searchParams } = new URL(request.url);
    let checkAdmin = 0;
    if (searchParams.get('checkAdmin') != null) {
        checkAdmin = searchParams.get('checkAdmin');
    }
    let foreignKey = "";
    if (searchParams.get('foreignKey') != null) {
        foreignKey = searchParams.get('foreignKey');
    }

    //get the table name
    let tableName = searchParams.get('tablename');
    //get the table name
    let fields = searchParams.get('fields');
    //get the table id
    let recordId = "";
    if (searchParams.get('recordId') != null)
        recordId = searchParams.get('recordId');


    //set an array for the results
    let schemaResults = [];
    //create the data array we are going to send back to the frontend.
    let queryFin = {};


    //check if they also want the data
    //build the where statement if they sent up and id
    let sqlWhere = `where ${tableName}.isDeleted = 0 `;

    //if ((recordId != "") && (foreignId == ""))
    //console.log(recordId)
    //check if we have a record ID but not a foreign Id the we just want to check against the id.
    if ((recordId != "") && (foreignKey == ""))
        sqlWhere = sqlWhere + ` and id = ${recordId}`

    //we have  a foreign Id and a record Id so check against the foreign id. 
    if ((foreignKey != "") && (recordId != "")) {
        sqlWhere = sqlWhere + ` and ${foreignKey} = ${recordId}`
    }

    //process the fields
    let tmp = fields.split(",");
    //not we dont want to show the isDeleted flag if there. 
    //console.log(tmp.length)
    let theQuery = ""
    if (tmp.length == 1) {
        theQuery = `SELECT * from ${tableName} ${sqlWhere} `
        //console.log("theQuery a")
        //console.log(theQuery)
        query = context.env.DB.prepare(theQuery);
    } else {
        let fields = "";
        for (var i = 0; i < tmp.length; ++i) {
            if (fields == "")
                fields = tmp[i];
            else
                fields = fields + "," + tmp[i]
        }

        theQuery = `SELECT ${fields} from ${tableName} ${sqlWhere}`
        //console.log("theQuery b")
        console.log(theQuery)
        query = context.env.DB.prepare(theQuery);
    }

    queryResults = await query.all();
    //console.log(queryResults.results)
    queryFin.data = queryResults.results;
    return new Response(JSON.stringify(queryFin), { status: 200 });
}
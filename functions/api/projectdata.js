/*
    todo:



    notes:


    naming convertion for KV stores.

    project-data<username>*<projectid>*<dataid>

*/

let projectId;
let payLoad;
let contentType;
const jwt = require('@tsndr/cloudflare-worker-jwt')
var uuid = require('uuid');

let dataArray = [];
let buildDataArray = (theData, theId = "") => {
    let id;
    if (theId == "")
        id = uuid.v4();
    else
        id = theId
    let projectData = { id: id, data: theData, createdAt: "21/12/2022" }
    dataArray.push(projectData)
    return (projectData)
}


let decodeJwt = async (req, secret) => {
    //get the bearer token
    let bearer = req.get('authorization');
    //check they sent a bearer token
    if (bearer == null) {
        //send blank
        return ("")
    } else {
        //check if its a bearer token
        try {
            let details = await jwt.decode(bearer, secret)
            return (details)
        } catch (error) {
            console.log(error)
            return ("")
        }

    }
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
    let token = await decodeJwt(request.headers, env.SECRET);
    //check its valid
    if (token == "") {
        return new Response(JSON.stringify({ error: "not authorised to update records" }), { status: 400 });
    } else {
        //get the content type
        const contentType = request.headers.get('content-type')
        //set a data array
        let theData;
        //set a query values var
        let theQueryValues = "updatedAt = CURRENT_TIMESTAMP";
        //set a query where
        let theQueryWhere = "";
        //check we have a content type
        if (contentType != null) {
            //get the data
            theData = await request.json();
            //loop through the data
            for (var i = 0; i < theData.data.length; ++i) {
                //build the update query
                let theQuery = `UPDATE projectData SET `
                //loop through the field values
                for (const key in theData.data[i]) {
                    //set the data
                    const tdata = theData.data[i];
                    //check it is not an id or table 
                    if ((key != "table") && (key != "id")) {
                        //build the fields
                        theQueryValues = theQueryValues + `,fieldValue = '${tdata[key]}' `
                    }
                    //check for ad id and add a put.
                    if (key == "id")
                        theQueryWhere = ` where id = '${tdata[key]}'`

                }
                //build the query
                theQuery = theQuery + theQueryValues + ` ${theQueryWhere}`;
                //return it
                const info = await context.env.DB.prepare(theQuery).run();
            }
            //return
            return new Response(JSON.stringify({ message: `The record has been updated` }), { status: 200 });
        }
    }



}

export async function onRequestPost(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;


    let theData;
    let token = await decodeJwt(request.headers, env.SECRET);
    if (token == "") {
        return new Response(JSON.stringify({ error: "Not allowed to add records" }), { status: 400 });
    } else {
        //get the content type
        const contentType = request.headers.get('content-type')
        //check we have a content type
        if (contentType != null) {
            //get the data
            theData = await request.json();
            //console.log(theData);
            const dataId = uuid.v4();
            for (var i = 0; i < theData.data.length; ++i) {
                const theSQL = `INSERT INTO projectData ('projectId','projectDataId','SchemaId','fieldValue') VALUES ('${theData.projectId}','${dataId}','${theData.data[i].id}','${theData.data[i].fieldValue}')`
                //console.log(theSQL);
                const insertResult = await context.env.DB.prepare(theSQL).run();
            }
        }
    }
    return new Response(JSON.stringify({ message: "Record added" }), { status: 200 });

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
    let token = await decodeJwt(request.headers, env.SECRET);
    if (token == "") {
        return new Response(JSON.stringify({ error: "not allowed to delete records" }), { status: 400 });
    } else {
        //get the content type
        const contentType = request.headers.get('content-type')
        let theData;
        if (contentType != null) {
            theData = await request.json();
            const info = await context.env.DB.prepare(`UPDATE projectData SET isDeleted = '1',deletedAt = CURRENT_TIMESTAMP WHERE projectDataId = '${theData.id}'`)
                //.bind(1,CURRENT_TIMESTAMP,theData.id)
                .run();
            return new Response(JSON.stringify({ message: `Record has been deleted` }), { status: 200 });

        }
    }
    return new Response(JSON.stringify({ error: "server error" }), { status: 400 });

}





export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    try {
        //make a data object
        let finData = {};
        //set the results object
        let results = []
        //get the search params
        const { searchParams } = new URL(request.url);
        //get the project id
        let projectId = searchParams.get('projectId');
        //get the project dataId 
        const projectDataId = searchParams.get('projectDataId');
        //set the template
        const getTemplate = searchParams.get('getTemplate');
        //set up the KV
        const KV = context.env.snapshot;
        //debug
        //console.log(getTemplate);
        //console.log(projectDataId)
        //console.log(projectId)
        if ((projectId != null) && (projectId != "")) {

            //get the schema
            const query = context.env.DB.prepare(`SELECT id,isUsed,fieldName,originalFieldName from projectSchema where projectId = '${projectId}'`);
            const queryResults = await query.all();

            //debug
            //const querya = context.env.DB.prepare(`SELECT * from projectData`);
            //get the results
            //const queryResultsa = await querya.all();
            //console.log(queryResultsa)

            //get the projects and group by id
            const query2 = context.env.DB.prepare(`SELECT projectData.projectDataId from projectData where projectData.projectId = '${projectId}' and isDeleted = 0 group by projectDataId `);
            //get the results
            const queryResults2 = await query2.all();
            //console.log(queryResults2)
            //loop through the projectdata results
            for (var i = 0; i < queryResults2.results.length; ++i) {
                //get the id
                let projectDataId = queryResults2.results[i].projectDataId;
                //get the data
                const query3 = context.env.DB.prepare(`SELECT projectData.id,projectData.projectDataId,projectData.schemaId,projectSchema.isUsed,projectSchema.originalFieldName,projectSchema.fieldName,projectData.fieldValue from projectData LEFT JOIN projectSchema ON projectData.schemaId = projectSchema.id where projectData.projectDataId = '${projectDataId}' and projectData.isDeleted = 0`);
                //get the results
                const queryResults3 = await query3.all();
                //put them into our array
                results.push(queryResults3.results);
                //debugs
                //console.log(queryResults3.results)
            }
            //get the template
            let tmpTemplate = {}
            if (getTemplate != null) {
                //run the query
                const queryTemplate = context.env.DB.prepare(`SELECT templateName as name from projects where id = '${projectId}'`);
                let queryTemplateResult = await queryTemplate.first();
                //get it from KV
                const template = await KV.get(`template-${projectId}`);
                //set the template details
                tmpTemplate.template = template
                tmpTemplate.name = queryTemplateResult.name
                finData.template = tmpTemplate;
            } else {
                //set a blank template
                let tmpTemplate = {}
                tmpTemplate.template = ""
                tmpTemplate.name = ""
                finData.template = tmpTemplate;
            }


            //store the schema
            finData.schema = queryResults.results;
            //store the results. 
            finData.data = results;
            //console.log(finData)
        } else {
            //return the one project
            const queryData = context.env.DB.prepare(`SELECT projectData.projectId,projectData.id,projectData.projectDataId,projectData.schemaId,projectSchema.isUsed,projectSchema.originalFieldName,projectSchema.originalFieldName,projectSchema.fieldName,projectData.fieldValue from projectData LEFT JOIN projectSchema ON projectData.schemaId = projectSchema.id where projectData.projectDataId = '${projectDataId}' `);
            //get the results
            const queryDataResults = await queryData.all();
            //put them into our array
            //results.push(queryDataResults.results);
            finData.data = queryDataResults.results;
            //get the template
            let tmpTemplate = {}
            if (getTemplate != null) {
                //run the query
                const queryTemplate = context.env.DB.prepare(`SELECT templateName as name from projects where id = '${projectId}'`);
                let queryTemplateResult = await queryTemplate.first();
                //get it from KV
                const template = await KV.get(`template-${projectId}`);
                //set the template details
                tmpTemplate.template = template
                tmpTemplate.name = queryTemplateResult.name
                finData.template = tmpTemplate;
            } else {
                //set a blank template
                let tmpTemplate = {}
                tmpTemplate.template = ""
                tmpTemplate.name = ""
                finData.template = tmpTemplate;
            }
            //console.log(finData)
        }
        //debug
        //console.log(queryResults)
        //console.log(queryResults2)
        //console.log(finData);
        return new Response(JSON.stringify(finData), { status: 200 });
    } catch (error) {
        console.log(error)
        return new Response(error, { status: 200 });
    }
}
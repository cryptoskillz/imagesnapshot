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

let decodeJwt = async (req, secret) => {
    let bearer = req.get('authorization')
    bearer = bearer.replace("Bearer ", "");
    let details = await jwt.decode(bearer, secret)
    return (details)
}

let dataArray = [];
let buildDataArray = (theData) => {
    let id = uuid.v4();
    let projectData = { id: id, data: theData }
    dataArray.push(projectData)
    return (projectData)
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

    try {
        //set a data array
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
                //delete the schema data
                const deleteResult = await context.env.DB.prepare(`DELETE from projectSchema where projectId = '${theData.projectId}'`).run();
                //console.log(deleteResult)

                //get the fields
                let theFields = theData.fields.fields;
                //split it 
                theFields = theFields.split(',');
                for (var i = 0; i < theFields.length; ++i) {
                    let theField = theFields[i];
                    //insert the schema into the database
                    const insertResult = await context.env.DB.prepare(`INSERT INTO projectSchema ('projectId','fieldName','originalFieldName') VALUES ('${theData.projectId}','${theField}','${theField}')`).run();
                }

                //delete old records
                const deleteResult2 = await context.env.DB.prepare(`DELETE from projectData where projectId = ${theData.projectId}`).run();
                //console.log(deleteResult);
                
                //add them
                let counter=0;
                for (var i = 0; i < theData.data.length; ++i) {
                    //get the fieldname 
                    const dataId = uuid.v4();
                    for (const key in theData.data[i]) {
                        //set the data
                        const tdata = theData.data[i];
                        //get the schema id from the fieldname
                        const query = context.env.DB.prepare(`SELECT * from projectSchema where projectId = '${theData.projectId}' and fieldName = '${key}'`);
                        const queryResult = await query.first();
                        //insert it
                        const insertResult = await context.env.DB.prepare(`INSERT INTO projectData ('projectId','projectDataId','SchemaId','fieldValue') VALUES ('${theData.projectId}','${dataId}','${queryResult.id}','${tdata[key]}')`).run();
                    }
                    //inc a counter
                    counter++;
                }
                return new Response(JSON.stringify({ message: `${counter} records imported` }), { status: 200 });
            }
        }
    } catch (error) {
        return new Response(error, { status: 200 });
    }
}
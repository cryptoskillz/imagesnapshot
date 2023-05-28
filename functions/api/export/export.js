
export async function onRequestGet(context) {
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;
    let finData = {}
    let results = []
    let dataArray = [];

    //get the paramaters
    const { searchParams } = new URL(request.url);

    //get the project id
    let projectId = searchParams.get('projectId');
    //get the secret id
    let secretId = searchParams.get('secretId');
    //get the show project flag
    let showProject = searchParams.get('showProject');
    //get the show data flag 
    let showData = searchParams.get('showData');

    //clean up
    if (showProject == null)
        showProject = 1;
    if (showData == null)
        showData = 1;

    //get the project
    const queryProject = context.env.DB.prepare(`SELECT id,name,template,templateName from projects where id = '${projectId}'`);
    const queryProjectResults = await queryProject.first();

    //get the project data
    const queryProjectData = context.env.DB.prepare(`SELECT projectData.projectDataId from projectData where projectData.projectId = '${projectId}' and isDeleted = 0 group by projectDataId `);
    const queryProjectDataResults = await queryProjectData.all();
    //add the project
    if (showProject == 1)
        finData.project = queryProjectResults

    //loop through the projectdata results
    for (var i = 0; i < queryProjectDataResults.results.length; ++i) {
        //get the id
        let projectDataId = queryProjectDataResults.results[i].projectDataId;
        //get the data
        const query3 = context.env.DB.prepare(`SELECT projectData.id,projectData.projectDataId,projectData.schemaId,projectSchema.isUsed,projectSchema.fieldName,projectData.fieldValue from projectData LEFT JOIN projectSchema ON projectData.schemaId = projectSchema.id where projectData.projectDataId = '${projectDataId}' and projectData.isDeleted = 0`);
        //get the results
        const queryResults3 = await query3.all();
        let dataRow = "";
        for (var i2 = 0; i2 < queryResults3.results.length; ++i2) {
            //get the data
            let theRow = queryResults3.results[i2];
            if (dataRow == "")
                dataRow = dataRow + theRow.fieldValue;
            else
                 dataRow = dataRow +','+ theRow.fieldValue;
        }
        //put them into our array
        results.push(dataRow);
    }
    //store the data
    finData.data = results
    return new Response(JSON.stringify({ "result":finData }), { status: 200 });

}
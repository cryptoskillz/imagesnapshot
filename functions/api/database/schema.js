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
    //get the paramaters
    const { searchParams } = new URL(request.url);
    //get the table name
    let tableName = searchParams.get('tablename');
    //get the fields
    let fields = searchParams.get('fields');
    //set a fields array
    let fieldsArray = []
    //set a fin fields array
    let finFields = [];
    //check if the fields are pushed up and split it.
    if (fields != null)
        fieldsArray = fields.split(',');
    //check if we only want 1 field and just add it to the array
    if (fields.includes(",")) 
        fieldsArray.push(fields)
    //get the table schema
    let query = context.env.DB.prepare(`PRAGMA table_info(${tableName});`);
    //get them all
    let queryResults = await query.all();
    //check we have some fields to process
    //we have to check this way as when you init an array in JS it always sets its length to zero. 
    if (fieldsArray[0] != '') {
        //loop through the field results
        for (var i = 0; i < queryResults.results.length; ++i) {
            //look for it the fields array
            for (var i2 = 0; i2 < fieldsArray.length; ++i2) {
                //check if the name is the same.
                if (fieldsArray[i2] == queryResults.results[i].name)
                    finFields.push(queryResults.results[i])
            }
        }
    } else {
        //just return all the fields
        finFields = queryResults.results;
        
    }

    return new Response(JSON.stringify(finFields), { status: 200 });
}
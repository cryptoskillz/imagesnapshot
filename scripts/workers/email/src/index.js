/**

STEPS

sign up for a postmark account here 

https://postmarkapp.com/

verify an email.  I used email cloudflare email routing to make this easy

set the following vars in your wrangler.toml 

EMAILFROM
EMAILAPI
EMAILTOKEN

test it from command lone

sudo wrangler dev

curl "http://127.0.0.1:8787" -X POST


if you want to pass it some vars to test with
https://api.postmarkapp.com/email/withTemplate
const templateVariables = { name: 'John Doe' };


//text 
curl "http://127.0.0.1:8787" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
 "to": "test@cjmtrading.xyz",
  "subject": "Postmark test",
  "textBody": "Hello dear Postmark user.",
  "htmlBody": "<html><body><strong>Hello</strong> dear Postmark user.</body></html>",
  "MessageStream": "outbound"
  }'

template

curl "http://127.0.0.1:8787" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
 "to": "test@cjmtrading.xyz",
"templateId": 30429839,
          "templateVariables": {
              "name": "John Smith",
              "product_name": "building blocks",
              "action_url": "a",
              "login_url": "b",
              "username": "c",
              "sender_name": "f"
          }
}'


curl "http://127.0.0.1:8787" \
  -X POST \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@cjmtrading.xyz",
    "templateId": 30429839,
          "templateVariables": {
              "name": "John Smith",
              "product_name": "building blocks",
              "action_url": "a",
              "login_url": "b",
              "username": "c",
              "sender_name": "f"
          }
}'


 */




async function handleRequest(request) {
    //get the url paramaters
    /*
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('to');
    */
    if (request.method == "POST") {

        //debug 
        /*
        console.log(EMAILFROM)
        console.log(EMAILAPI)
        console.log(EMAILTOKEN);
        set these in your wrangler.TOML file
        */

        let method = "";
        theData = await request.json();
       // let templateVariables = JSON.parse(theData.templateVariables);
        //console.log("theData")
        //console.log(theData)
        //console.log(theData.templateVariables)
        //The data to send to the Postmark API
        const data = {
            From: `${EMAILFROM}`,
            To: `${theData.to}`,
        }
        //console.log( theData.templateVariables);
       
        //check the template id
        if (theData.templateId != undefined) {
            method = "email/withTemplate"
            data.TemplateId = theData.templateId
            //let tmpJson = JSON.parse(theData.templateVariables)
            data.TemplateModel = theData.templateVariables
        } else {
            method = "email"
            if (theData.subject != undefined)
                data.Subject = theData.subject
            if (theData.textBody != undefined)
                data.TextBody = theData.textBody
            if (theData.htmlBody != undefined)
                data.HextBody = theData.htmlBody

        }
               console.log("data.TemplateModel")

       console.log(data.TemplateModel)

        //console.log(EMAILAPI + method)
        //return;

        // The options for the fetch request
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Postmark-Server-Token': EMAILTOKEN
            },
            body: JSON.stringify(data)
        }
        // Send the request to the Postmark API
        const response = await fetch(EMAILAPI + method, options)
        console.log(response)
        // Check if the request was successful
        if (response.ok) {
            return new Response(JSON.stringify({ "message": "Email sent!" }, 200))
        } else {
            return new Response(JSON.stringify({ "message": "An error occurred" }, 400))
        }

    } else {
        return new Response(JSON.stringify({ "message": "POST ONLY" }, 400));

    }
}
addEventListener('fetch', event => {
    event.passThroughOnException()
    return event.respondWith(handleRequest(event.request));
});
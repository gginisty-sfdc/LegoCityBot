"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    processor = require('./modules/processor'),
    handlers = require('./modules/handlers'),
    postbacks = require('./modules/postbacks'),
    uploads = require('./modules/uploads'),
    messenger = require('./modules/messenger'),
    einstein = require('./modules/einstein'),
    FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN,
    app = express();

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

/*local dev section*/
if(process.env.DEVENV) {
    console.log('Running in local dev env');

    app.get('/test', (req, res) => {
      console.log('dev start ',process.env.DEV_FB_SENDERID);
      res.sendStatus(200);
      /* test file upload

        messenger.send({text: `test dev env`}, process.env.DEV_FB_SENDERID);
        uploads.processUpload(process.env.DEV_FB_SENDERID,
          [{"type":"image","payload":{"url":"https://images-na.ssl-images-amazon.com/images/I/916d9Ww1QwL._SL1500_.jpg"}}]
        );
*/
/*test intent text
      //  let result = einstein.getIntent(req.query.text).then(result =>{  console.log('intent',result);});
        let result = einstein.getIntent(req.query.text).then(result =>{
          console.log("intent ", result);
        if (result.probability>0.9) {
            let handler = handlers[result.label];
            if (handler && typeof handler === "function") {
                handler(process.env.DEV_FB_SENDERID, req.query.text);
            } else {
                console.log("Handler " + result.label + " is not defined");
            }
        }
        else {
          messenger.send({text: `Désolé je n'ai pas compris.\nEnvoyez-moi la photo d'un vaisseau et je vous donnerai toutes les informations.`}, process.env.DEV_FB_SENDERID);
        }
      });*/

    });

}

/*end local dev section*/


app.use(express.static('public'));

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.get('/orderdone', handlers['orderdone']);

app.post('/webhook', async(req, res) => {
    let events = req.body.entry[0].messaging;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let sender = event.sender.id;
        if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
            messenger.send({text: `Sorry I'm taking a break right now.`}, sender);
        } else if (event.message && event.message.text) {
          if (event.message.quick_reply) {
            let payload = event.message.quick_reply.payload;
            console.log(event.message.quick_reply.payload);
            let postback = postbacks[payload];
            if (postback && typeof postback === "function") {
                postback(sender, payload);
            } else {
                console.log("Postback Quick Reply " + postback + " is not defined");
            }
          }
          else {
            //let result = processor.match(event.message.text);
            console.log('text',event.message.text);
            let result = await einstein.getIntent(event.message.text);
            console.log('intent',result);
            if (result.probability>0.9) {
                let handler = handlers[result.label];
                if (handler && typeof handler === "function") {
                    handler(sender, event.message.text);
                } else {
                    console.log("Handler " + result.label + " is not defined");
                }
            }
            else {
              messenger.send({text: `Désolé je n'ai pas compris.\nEnvoyez-moi la photo d'un vaisseau et je vous donnerai toutes les informations.`}, sender);
            }
          }
        } else if (event.postback) {
            let payload = event.postback.payload.split(",");
            let postback = postbacks[payload[0]];
            if (postback && typeof postback === "function") {
                postback(sender, payload[1]);
            } else {
                console.log("Postback " + postback + " is not defined");
            }
        } else if (event.message && event.message.attachments) {
            uploads.processUpload(sender, event.message.attachments);
        }
    }
    res.sendStatus(200);
});

app.listen(app.get('port'), function () {
    console.log('Heroku bot - Express server listening on port ' + app.get('port'));
});

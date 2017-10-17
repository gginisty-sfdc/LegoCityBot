"use strict";

let messenger = require('./messenger'),
formatter = require('./formatter'),
einstein = require('./einstein'),
nodeGeocoder = require('node-geocoder'),
ingenico = require('./ingenico'),
hueLights = require('./hue-lights');
//require('./vision-service-mock')
var options = {
  provider: 'google'
};

//var geocoder = nodeGeocoder(options);
exports.doAct = async(sender, shipType) => {
  hueLights.light(shipType);
  messenger.send({text: `Le ${shipType}. Very good choice. Here are its detailed specs:`}, sender);
  let returnUrl="https://sdo-demo-main-141e22218df-14-15950af6391.secure.force.com/Public/ingenico_PostCheckout?sender="+sender+"&shipType="+shipType.replace('-','').replace(' ','').toLowerCase();

  let redirecturl = await ingenico.createCheckout(returnUrl,shipType);
//  console.log('ingenico',redirecturl);
  if(redirecturl!==null)
      messenger.send(formatter.ficheinfo(shipType,redirecturl), sender);

};


exports.processUpload = async(sender, attachments) => {
  if (attachments.length > 0) {
    let attachment = attachments[0];
    if (attachment.type === "image") {
      hueLights.reset();
      messenger.send({text: 'Let me analyse this picture with Einstein Vision...'}, sender);
      setTimeout(function () {messenger.writingIcon(sender);}, 50)
      let shipType = await einstein.classify(attachment.payload.url);
      console.log('classification defined:',shipType);
      if(shipType.probability<0.4){
        console.log("probability too low",shipType.probability);
        messenger.send({text: `I do not recognize this spaceship. Please try again.`}, sender);
      }
      else{
            this.doAct(sender,shipType.label);
          }

    }else if (attachment.type === "location") {
/*
      messenger.getUserInfo(sender).then(response => {
        messenger.send(formatter.renderRooms(response), sender);
      });

      console.log('attachment.payload.coordinates.lat: ', attachment.payload.coordinates.lat);
      console.log('attachment.payload.coordinates.long: ', attachment.payload.coordinates.long);
      console.log('geocoder: ', geocoder);

      geocoder.reverse({lat: attachment.payload.coordinates.lat, lon: attachment.payload.coordinates.long}).then(function(res) {
        console.log('result: ', res);
        console.log('ZIPCODE!: ', res[0].zipcode);

        messenger.setZip(res[0].zipcode);

        /*
        messenger.getSuggestion(res[0].zipcode, '2').then(response => {
        messenger.send({text: `${response.service_plan}`}, sender);
      });
      */
/*
    }).catch(function(err) {
      console.log('err: ', err);
    });
*/


  } else {
    messenger.send({text: 'This type of attachment is not supported'}, sender);
  }
}
};

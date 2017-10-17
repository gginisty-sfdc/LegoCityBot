"use strict";

let moment = require("moment"),
    numeral = require("numeral");

 var price={"tiefighter":1250.99,"xwing":1399.99,"uwing":1250.99};
 var commlinks={xwing:process.env.COMMUNITY_XWING,tiefighter:process.env.COMMUNITY_TIE_FIGHTER,uwing:process.env.COMMUNITY_UWING};


exports.bonjour = response => {
    return {
        "text":"Hello " + response.first_name + ", and welcome to your StarForce assistant.",
    }
};
exports.shipChoice = () =>{
  return {
      "text":"Which spaceship do you prefer? ",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"X-WING",
          "payload":"xwing"
        },
        {
          "content_type":"text",
          "title":"U-WING",
          "payload":"uwing"
        },
        {
          "content_type":"text",
          "title":"Tie Fighter",
          "payload":"tiefighter"
        }
      ]
  }
}

exports.recu = shipType =>{

    return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":"Rachel Skywalker",
        "merchant_name":"StarForce",
        "order_number":new Date().getTime(),
        "currency":"EUR",
        "payment_method":"Visa 7977",
        "elements":[
          {
            "title":shipType,
            "quantity":1,
            "price":price[shipType],
            "currency":"EUR",
            "image_url":'https://legocitybot.herokuapp.com/'+shipType+'.png?'+process.env.HEROKU_RELEASE_VERSION
          }
        ],
        "address":{
          "street_1":"6 rue Daguerre",
          "city":"Paris",
          "postal_code":"75014",
          "state":"Ile-De-France",
          "country":"FR"
        },
        "summary":{
          "total_cost":price[shipType]
        }
      }
    }
  }
};

exports.information = response => {
  //  console.log('onBoard2');
    return {
        "text":"Un vaisseau vous plaît ? Envoyez-moi sa photo et je vous donnerai toutes les informations."
      }
};

exports.avis = vaisseau => {
  //  console.log('onBoard2');
    return {
        "text":"Un vaisseau vous plaît ? Envoyez-moi sa photo et je vous donnerai toutes les informations."
      }
};


exports.ficheinfo = (shipType,checkouturl) => {

    let elements = [];
        elements.push(
            {
                title: shipType,
                "image_url": 'https://legocitybot.herokuapp.com/'+shipType.replace('-','').replace(' ','').toLowerCase()+'.png?'+process.env.HEROKU_RELEASE_VERSION,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Fiche Technique",
                        "payload": "fiche,"+shipType
                    },
                    {
                        "type":"web_url",
                        "title":"Avis Communauté",
                        "url": "https://sdodemo-main-141e22218e0-144-15950af6391.force.com/starforce/s/topic/"+commlinks[shipType.replace('-','').replace(' ','').toLowerCase()]+"?"+process.env.HEROKU_RELEASE_VERSION,
                        "webview_height_ratio": "full",
                        "messenger_extensions": false

                    },
                    {
                      "type":"web_url",
                      "title":"Acheter - "+price[shipType.replace('-','').replace(' ','').toLowerCase()]+"€",
                      "url": checkouturl,
                      "webview_height_ratio": "tall",
                      "messenger_extensions": false,
                      "webview_share_button":"hide"
                    }
                ]
            }
        );
// console.log("bouton",elements[0].buttons[2]);
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

exports.fiche = shipType => {
    return {
        "attachment": {
            "type": "image",
            "payload": {
                "url": 'https://legocitybot.herokuapp.com/'+shipType.replace('-','').replace(' ','').toLowerCase()+'-specs.png?'+process.env.HEROKU_RELEASE_VERSION
            }
        }
    };
};

exports.sendLocation = response => {
    return {
        "text":"Où est situé votre logement?",
        "quick_replies":[
          {
            "content_type":"location"
          }
        ]
    }
};

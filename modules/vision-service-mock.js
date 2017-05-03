"use strict";

exports.classify = imageURL => new Promise((resolve, reject) => {

  var jwt = require('jsonwebtoken');
  var request = require('request');

  var url = process.env.EINSTEIN_VISION_URL
  var private_key = process.env.EINSTEIN_VISION_PRIVATE_KEY
  var account_id = process.env.EINSTEIN_VISION_ACCOUNT_ID

  /*var reqUrl = `${url}v1/oauth2/token`;

  // JWT payload
  var rsa_payload = {
    "sub":account_id,
    "aud":url
  }

  var rsa_options = {
    header:{
      "alg":"RS256",
      "typ":"JWT"
    },
    expiresIn: '1h'
  }

  // Sign the JWT payload
  var assertion = jwt.sign(
    rsa_payload,
    private_key,
    rsa_options
  );

  var options = {
    url: reqUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    },
    body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(assertion)}`
  }

  console.log('vision service oauth request options',options);
  // Make the OAuth call to generate a token
  request.post(options, function(error, response, body) {
    console.log('vision service token request json',body);
    var data = JSON.parse(body);
    console.log('vision service token request',data);
    console.log('access token',data["access_token"]);
    resolve(data["access_token"]);
  });*/

  let token='b86ee158ef03eea5fce8e458a33be9b00bc4cde0';
  var options = {
    url: url+'v1/vision/predict',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Cache-Control': 'no-cache',
      'Authorization': 'Bearer '+token,
    },
    body:`samplelocation=${imageURL},modelId=GeneralImageClassifier`
  }

    console.log('vision service  request ',options);
  request.post(options, function(error, response, body) {
    console.log('vision service response ',body);
  });
  /*
  setTimeout(() => {
    resolve("X-WING");
  }, 2000);*/
});

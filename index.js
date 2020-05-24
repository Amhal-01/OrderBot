const trackParse = require("./trackParse");
const firebase = require("firebase");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const port = 80;
const url = "https://api.telegram.org/bot";
const boToken = "1205793846:AAF9Z3ucXZvh3xOJkkd_dlK_FmPtRNT9jGI";
const bot = `${url}${boToken}/sendMessage`;

// Init Firebase
firebase.initializeApp({
  apiKey: "AIzaSyDicfUdYPjZzQyeVV5QXUPd1DrrSxH4tfQ",
  authDomain: "order-bot-telegram.firebaseapp.com",
  databaseURL: "https://order-bot-telegram.firebaseio.com",
  projectId: "order-bot-telegram",
  storageBucket: "order-bot-telegram.appspot.com",
  messagingSenderId: "304073465944",
  appId: "1:304073465944:web:57f64e7a62b83c34c46a2d",
});
const ref = firebase.database().ref();
const tnRef = ref.child("tracking_numbers");

app.use(bodyParser.json());
app.post("/", (req, res) => {
  const chatId = req.body.message.chat.id;
  const sentMessage = req.body.message.text;
  if (sentMessage.toUpperCase().indexOf("/ABOUTME") === 0) {
    sendMessage(
      chatId,
      "I'm Lexy your kind bot :) I can track any order.",
      res
    );
  } else if (sentMessage.toUpperCase().includes("/TRACK")) {
    let tn = "";
    if (sentMessage !== undefined) {
      tn = sentMessage.replace("/track", "");
      tn = tn.replace(/ /g, "");
      tn = tn.replace(/\n/g, "");
    }
    console.log(tn);
    getTrack(tn);
    function getTrack(tn) {
      trackParse(tn)
        .then((response) => {
          if (tn.length < 5 || tn.length > 50) throw "Wrong key";
          if (response !== "") {
            sendMessage(chatId, response, res);
            tnRef.push({
              tracking_number: tn.toUpperCase(),
              content: response,
              timestamp: Date.now(),
            });
          } else throw "To be resent.";
        })
        .catch((error) => {
          if (error.includes("To be resent")) {
            getTrack(tn);
          } else if (error.includes("Wrong key")) {
            console.error(error);
            sendMessage(
              chatId,
              "Invalid, tracking number must be a combination of alphanumeric characters of 5-50 characters in length.",
              res
            );
          } else {
            console.error(error);
            sendMessage(
              chatId,
              "Please try again... Sorry for the inconvenience!",
              res
            );
          }
        });
    }
  } else if (
    sentMessage.indexOf("") !== 0 ||
    sentMessage.toUpperCase().indexOf("/START") === 0
  ) {
    sendMessage(
      chatId,
      "Hello and welcome to order tracker :) To track your number: /track your_tracking_number",
      res
    );
  }
});
app.listen(port, () => {
  console.log("Bot started on port: " + port);
});

function sendMessage(chatId, reply, res) {
  axios
    .post(bot, {
      chat_id: chatId,
      text: reply,
    })
    .then((response) => {
      res.status(200).send({});
    })
    .catch((error) => {
      console.log(error);
    });
}

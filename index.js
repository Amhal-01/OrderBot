const TelegramBot = require("node-telegram-bot-api");
const trackParse = require("./trackParse");
const firebase = require("firebase");
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

const bot = new TelegramBot("1205793846:AAF9Z3ucXZvh3xOJkkd_dlK_FmPtRNT9jGI", {
    polling: true,
});

// bot.setWebHook(process.env.HEROKU_URL + bot.token)

console.log("Bot server started");

bot.on("text", (message) => {
    if (message.text.toUpperCase().indexOf("/ABOUTME") === 0) {
        bot.sendMessage(
            message.chat.id,
            "I'm Lexy your kind bot :) I can track any order."
        );
    } else if (message.text.toUpperCase().includes("/TRACK")) {
        let tn = "";
        if (message.text !== undefined) {
            tn = message.text.replace("/track", "");
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
                        bot.sendMessage(message.chat.id, response);
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
                        bot.sendMessage(
                            message.chat.id,
                            "Invalid, tracking number must be a combination of alphanumeric characters of 5-50 characters in length."
                        );
                    } else {
                        console.error(error);
                        bot.sendMessage(
                            message.chat.id,
                            "Please try again... Sorry for the inconvenience!"
                        );
                    }
                });
        }
    } else if (
        message.text.indexOf("") !== 0 ||
        message.text.toUpperCase().indexOf("/START") === 0
    ) {
        bot.sendMessage(
            message.chat.id,
            "Hello and welcome to order tracker :) To track your number: /track your_tracking_number"
        );
    }
});
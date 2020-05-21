const $ = require("cheerio");
const puppeteer = require("puppeteer");
const chalk = require("chalk");

const error = chalk.bold.red;
const success = chalk.keyword("green");

// const url = "https://t.17track.net/en#nums=1ZR9W1030312359339";

async function trackParse(tn) {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    const url = "https://t.17track.net/en#nums=" + tn
    const tmp = await page.goto(url).then(() => {
      return page.content();
    });
    let content = $("#cl-details", tmp).data("clipboardText");
    content = content.replace("Powered by www.17track.net", "");
    content = content.replace(/=/g, "");
    await browser.close();
    console.log(content)
    return content;
  } catch (e) {
    console.log(error(e));
    await browser.close();
    return;
  }
}


module.exports = trackParse;
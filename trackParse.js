const $ = require("cheerio");
const puppeteer = require("puppeteer");

async function trackParse(tn) {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    const url = "https://t.17track.net/en#nums=" + tn
    const tmp = await page.goto(url).then(() => {
      return page.content();
    });
    let content = $("#cl-details", tmp).data("clipboardText");
    if (content !== undefined) {
      content = content.replace("Powered by www.17track.net", "");
      content = content.replace(/=/g, "");
    }
    await browser.close();
    return content;
  } catch (e) {
    console.error(e);
    await browser.close();
    return;
  }
}


module.exports = trackParse;
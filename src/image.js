const request = require("request");
const cheerio = require("cheerio");
const Discord = require("discord.js");
const bot = new Discord.Client();
const PREFIX = "$";
var version = "1.3";

bot.on("ready", () => {
  console.log("Bot is online " + version);
});

bot.on("message", (message) => {
  const [cmnd_name, ...args] = message.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
  switch (cmnd_name) {
    case "image":
      image(message, args[0]);
      break;
  }
});

function image(message, keyword) {
  var options = {
    url: "http://results.dogpile.com/serp?qc=images&q=" + `${keyword}`,
    method: "GET",
    headers: {
      Accept: "text/html",
      "User-Agent": "Chrome",
    },
  };
  request(options, function (error, response, responseBody) {
    if (error) {
      return;
    }

    $ = cheerio.load(responseBody);
    var links = $(".image a.link");
    var urls = new Array(links.length)
      .fill(0)
      .map((v, i) => links.eq(i).attr("href"));
    console.log(urls);
    if (!urls.length) {
      return;
    }
    // Send result
    message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
  });
}

bot.login(process.env.DISCORDJS_BOTS_TOKEN);

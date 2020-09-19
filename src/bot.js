require("dotenv").config();

// client allows us to interact with discord api
const { Client, WebhookClient } = require("discord.js");

//create a instance of discord client
// partials is a discordJs concept that says only cached messages can be operated
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});
const PREFIX = "%";

const webhookClient = new WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

client.on("ready", () => {
  console.log(`${client.user.tag} is now logged in`);
});

client.on("message", async (message) => {
  // preventing bot from sending msg again and again in loop
  if (message.author.bot) return;
  console.log(`"${message.content}" is written by ${message.author.username}`);
  if (message.content === "hello") {
    message.reply("hey, How are You");
    // message.reply("hello"); this would stuck us in a recursive loop
    // to not tag
    message.channel.send("Welcome, Hi there!!");
  }

  if (message.content.startsWith(PREFIX)) {
    // eg. %kick 1 2 3 now args is array of 1,2,3
    const [cmnd_name, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    // or split(" ");

    if (cmnd_name === "kick") {
      if (!message.member.hasPermission("KICK_MEMBERS"))
        return message.reply("permissions inadequate!!");
      if (args.length === 0) return message.reply("Please provide an id");
      const member = member.guild.members.cache.get(args[0]);
      if (member) {
        member
          .kick()
          .then((member) => {
            message.channel.send(`Kicked ${member}`);
          })
          .catch((err) => message.channel.send("Permissions inadequate!!"));
      } else {
        message.channel.send("member not found");
      }
    } else if (cmnd_name === "ban") {
      if (!message.member.hasPermission("BAN_MEMBERS"))
        return message.reply("permissions inadequate!!");
      if (args.length === 0) return message.reply("Please provide an id");

      try {
        const user = await message.guild.members.ban(args[0]);
        message.channel.send(`${user} banned successfully`);
      } catch (error) {
        console.log(error);
        message.channel.send(
          "An error occured, either perrminssions inadequate or user not found"
        );
      }
    } else if (cmnd_name === "general") {
      const msg = args.join(" ");
      webhookClient.send(msg);
    }
  }
});

// adding roles
client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (
    reaction.message.id === "756860034583101550" ||
    "756923617765228574" ||
    "756923715995959367"
  ) {
    switch (name) {
      case "🍎":
        member.roles.add("");
        break;
      case "🍌":
        member.roles.add("");
        break;
    }
  }
});

// REMOVING roles
client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji;
  const member = reaction.message.guild.members.cache.get(user.id);
  if (
    reaction.message.id === "756860034583101550" ||
    "756923617765228574" ||
    "756923715995959367"
  ) {
    switch (name) {
      case "🍎":
        member.roles.remove("");
        break;
      case "🍌":
        member.roles.remove("");
        break;
    }
  }
});

client.login(process.env.DISCORDJS_BOTS_TOKEN);

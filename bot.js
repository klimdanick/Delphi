const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const bot = new discord.Client();

const PREFIX = botConfig.prefix;

var servers = {}; 

const YTDL = require("ytdl-core");

function play(connection, message) {
    var server = servers[message.guild.id];
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

bot.on("ready", async () => {

    console.log(`${bot.user.username} is online`)

    bot.user.setActivity(`Model Services | https://discord.gg/cyumpqm | ${botConfig.prefix}help`, { type: "PLAYING" });
});

bot.on("message", function(message) {
    // console log messages
    if (message.guild && message.author && message) console.log("[" + message.guild.name + ", " + message.guild.id + "]" + "[" + message.channel.name + "]" + "[" + message.author.username + ", " + message.author + "] " + message);
    else console.log(" [" + message.author.username + ", " + message.author + "] " + message);
    

    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLocaleLowerCase()) {
        case "help":
            var botEmbed = new discord.RichEmbed()
            .setDescription("Delphi | music bot | help")
            .addBlankField()
            .addField(`${PREFIX}help`, "laat deze info zien.")
            .addField(`${PREFIX}play`, "speelt een nummer af.")
            .addField(`${PREFIX}skip`, "gaat naar het volgende nummer in de lijst.")
            .addField(`${PREFIX}stop`, "stopt de bot.")
            .addBlankField()
            .setFooter("https://discord.gg/cyumpqm | Game Services | door @klimdanick#1438");

            message.channel.send(botEmbed);
            break;
        case "play":
            if (!args[1]) {
                message.channel.send("zet A.U.B. een youtube link bij het commando!");
                return;
            }
            if (!message.member.voiceChannel) {
                message.channel.send("je moet in een voice chennal zitten!");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };
            var server = servers[message.guild.id];
            server.queue.push(args[1]);
            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];
            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
        case "queue":
            var server = servers[message.guild.id];
            if (!servers[message.guild.id]) message.channel.send("deze server heeft geen queue.");
            else if (servers[message.guild.id]) message.channel.send("error, queue niet gevonden maar is wel aanwezig.");
            else message.channel.send("error, queue niet gevonden maar is wel aanwezig.");
            break;
        case "message":
            message.delete();
            P = message.mentions.users.first();
            var botEmbed = new discord.RichEmbed()
            .setColor("#850000")
            .setDescription(message.content.slice (8));
            P.sendMessage(botEmbed);
            break;
    }

    });



bot.login(process.env.BOT_TOKEN);

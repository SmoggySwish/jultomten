const Discord = require("discord.js");
const bot = new Discord.Client();

const token = "NjQ1MDIwNzUyODM5NDQyNDUz.Xc8nAw.JA5gHlIBkIaykSix8Ys7ZVPGYAo";

const namn = "Tomten";

const ytdl = require("ytdl-core");

const PREFIX = "§";

var servers = {};

bot.on("ready", () => { console.log("Bots are online, Captain.")});

bot.on("message", msg => 
{ 
    let args = msg.content.substring(PREFIX.length).split(" ");

    switch(args[0])
    {
        case "pling":
            msg.reply("plong");
        break;

        case "coke":
            msg.reply("Klart grabben ska ha coke!")
            const cokee = new Discord.RichEmbed()
            .addField("Till: ", msg.author.username)
            .addField("Från: ", namn)
            .setColor(0xFF0000)
            .setImage("https://media-assets-03.thedrum.com/cache/images/thedrum-prod/s3-news-tmp-111981-coke_santa--2x1--652.jpg")
            msg.channel.sendEmbed(cokee);
        break;

        case "hej":
            msg.reply("HO HO HO, Finns det några snälla barn?")
        break;

        case "hjälp":
            msg.reply("pling, coke, hej")
        break;

        case "nuke":
            if (args[1] === "EVERYTHING")
            {
                msg.channel.bulkDelete(1000);
            }
            else if (!args[1]) return msg.reply("Hur många risodlare vill du spränga?")
            else if (args[1] < 10)
            {
                msg.channel.bulkDelete(args[1] + 1);
            }
            else
            {
                msg.reply("Inte så många tack!");
            }
        break;

        case "play":
            
            function play(connection, msg){
                var server = servers[msg.guild.id]

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]) {play(connection, msg);}
                    else {connection.disconnect();}
                })
            }


            if (!args[1]) {msg.channel.send("Länk tack :|"); return;} 
            if (!msg.member.voiceChannel) {msg.channel.send("SITT NER FÖRFAN!"); return;}
            
            if(!servers[msg.guild.id]) servers[msg.guild.id] = { queue : [] }

            var server = servers[msg.guild.id];

            server.queue.push(args[1]);

            if(!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection){
                play(connection, msg);
            })
        break;

        case "skip":
        var server = servers[msg.guild.id];
        if(server.dispatcher) server.dispatcher.end();
        msg.channel.send("Vi skippar den tycker jag.");
        break;
       
       case "stop":
           var server = servers[msg.guild.id];
           if(msg.guild.voiceConnection)
           {
               for(var i = server.queue.length -1; i >= 0; i--){
                   server.queue.splice(i,1);
               }
               server.dispatcher.end();
               console.log("Stopped the queue");
               msg.channel.send("Nu packar jag ihop!")
           }
           if(msg.guild.connection) msg.guild.voiceConnection.disconnect();
        break;

    }

});



bot.login(token);
const { MessageEmbed } = require("discord.js"), 
fs = require("fs"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };



module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    if(message.author.id === "658665476171366412"){
        let str_content = { 
            antiraid: {
                role_wl: false,
                antibot: false,
                antiraid: false,
                antiwebhook: false,
                antispam: false
            }
        };
        let str_data = JSON.stringify(str_content);
        // --
        fs.readFile(`./Data/${message.guild.id}.json`, async (err, data) => {
                if (err) 
                 await
                 fs.writeFileSync(`./Data/${message.guild.id}.json`, str_data);
                 message.channel.send(':white_check_mark: **Anti Raid setup**')
        });
    }else
    if(message.author.id === message.guild.owner.id){
    let str_content = { 
        antiraid: {
            role_wl: false,
            antibot: false,
            antiraid: false,
            antiwebhook: false,
            antispam: false
        }
    };
    let str_data = JSON.stringify(str_content);
    // --
    fs.readFile(`./Data/${message.guild.id}.json`, async (err, data) => {
            if (err) 
             await
             fs.writeFileSync(`./Data/${message.guild.id}.json`, str_data);
             message.channel.send(':white_check_mark: **Anti Raid setup**')
    });
}else return message.channel.send(":x: **Command only usable by the server owner**");
}


module.exports.help = {
    name: "setupar",
    aliases: ['arrs','raids', "rs", "antiraidsetup", "arsetup"],
    category: 'Anti Raid',
    description: "Pour setup l'antiraid kodb",
  };

var fs = require("fs"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };

module.exports.run = (client, message, args) => {
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    var config = require("../../config.json"),
    db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
       if (args.length) {
        let str_content = args.join(" ")
        db.color = str_content
        message.channel.send(`\`${getNow().time}\` :white_check_mark: ${message.author}, You have defined the color of the embeds of the guild in \`${str_content}\`.`);
    } else {
        message.channel.send(`\`${getNow().time}\` :x: ${message.author}, You did not provide any value, please reorder including a color.`);
    }


    
fs.writeFile(`./serveur/${message.guild.id}.json`, JSON.stringify(db), (x) => {
    if (x) console.error(x)
  });
};


module.exports.help = {
    name: "color",
    aliases: ['colorembed','theme'],
    category: 'Administration',
    description: "Permet de changer la couleur des embeds du serveur",
  };

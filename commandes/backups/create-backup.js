const backup = require('discord-backup');
const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed(),
fs = require("fs")

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
        return message.channel.send(':x: **You do not have permission to use this command**.');
    }
    backup.create(message.guild).then((backupData) => {
        
   let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
        embed.setColor(db.color)
        .setTitle("🦖 Your Backup is ready !")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=747538814209097860&permissions=8&scope=bot%20applications.commands")
        .setTimestamp()
        .addField(`**Backup ID:**`, `${backupData.id}`, true)
        .setDescription(`**Do the ** \`\`backup load\`\` + **ID Command for load your backup**`, true)
        .setFooter("Kodb")
        return message.channel.send(embed);

    }).catch(error =>
       console.log(error),
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      );

};

module.exports.help = {
    name: "backup-create",
    aliases: ['create-backup','create-b',],
    category: 'Backup',
    description: "Pour creer une backup avec kodb",
  };

const { MessageEmbed } = require("discord.js"), 
fs = require("fs"), 
ms = require("ms"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };


module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
    let config = require("./../../config.json")
    filter = (reaction, user) => ['1️⃣','2️⃣', '3️⃣','4️⃣','5️⃣'].includes(reaction.emoji.name) && user.id === message.author.id,
    dureefiltrer = response => { return response.author.id === message.author.id };

    var embed = new MessageEmbed()
.setAuthor(`🦖 Server management`)
.setColor(db.color)
.setTitle(`Server management part, people with administrator permissions on the servers where the bot is present will be able to use the commands in this category.
    
> \`List of commands\``)
.setDescription(`
[Invite me:](${config.lien})\n\`giveaway\`\n - Used to display the giveaway configuration panel.
\n\n\`reroll\`\n - Re-select a winner of the last giveaway.
\n\n\`statut\`\n - Used to display the Custom Status configuration panel.
\n\n\`tempchannel\`\n - Used to display the configuration panel for temporary rooms.
\n\n\`membercount\`\n - Used to display the configuration panel for temporary rooms.
\n\n\`logs\`\n - Used to display the logs configuration panel.
\n\n\`autorole\`\n - Used to display the autorole configuration panel.\n\n`)
.setFooter(`\n\nkodb  1/5`)
message.channel.send(embed).then(async m => { 
    const collector = m.createReactionCollector(filter, { time: 900000 });
    collector.on('collect', async r => { 
    if(r.emoji.name === "1️⃣") {
        m.edit(embed)
        m.reactions.resolve(`1️⃣`).users.remove(message.author);

} else if(r.emoji.name === '2️⃣') {

var embed2 = new MessageEmbed()
.setAuthor(`🦖 Auto server moderation`)
.setColor(db.color)
.setDescription(`Server moderation part, people with pre-defined roles on the servers where the bot is present will be able to use the commands in this category.
    
> List of commands\n\n\n`)
.setDescription(`
[Invite me:](${config.lien})\n\`info-backup\`\n - Allows you to display the information of a backup.
\n\`create-backup\`\n - Allows you to create a server backup.
\n\`load-backup\`\n - Allows to load a backup of a server.
\n\`mpanel\`\n - Allows you to display the moderator configuration panel.
\n\`mute\`\n - Remove permission to speak in all text Channels.
\n\`unmute\`\n - Restore permission to speak in all text Channels.
\n\`ban\`\n - Ban somebody from the server.
\n\`unban\`\n - Unban anyone from the server.
\n\`nuke\`\n - Allows you to nuke the channel where the command is written.
\n\`clear\`\n - Allows you to delete messages from a channel.
\n\`voicemove\`\n - Moves everyone from the voice channel to another voice channel.\n\n`)
.setFooter(`\n\nkodb  2/5`)
m.edit(embed2)
m.reactions.resolve(`2️⃣`).users.remove(message.author);

} else if(r.emoji.name === '3️⃣') {
var embed3 = new MessageEmbed()
.setAuthor(`🦖 Fun category`)
.setColor(db.color)
.setTitle(`These are categories not useful to the server, it's for fun everyone can use them.
    
> \`List of commands\``)
.setDescription(`
[Invite me:](${config.lien})\n\`kiss\`\n - Give a kiss.
\n\`fight\`\n - Fight anyone.
\n\`hug\`\n - Hug anyone.\n\n`)
.setFooter(`\n\nkodb  3/5`)
m.edit(embed3)
m.reactions.resolve(`3️⃣`).users.remove(message.author);

} else if(r.emoji.name === '4️⃣') {
var embed4 = new MessageEmbed()
.setAuthor(`🦖 Utilities category`)
.setColor(db.color)
.setTitle(`These are categories useful to the server, some commands are accessible to everyone.
    
> \`List of commands\``)
.setDescription(`
[Invite me:](${config.lien})\n\`vc\`, \`vocalmembers\`,\`voicemember\` \n - Get the number of people in voice as well as the number of people on the server.
\n\`la\`, \`listeadmin\` \n - List of all people with administrator permissions on the server.
\n\`lrm\`, \`listerolemembers\` \n - Get the list of person in a role.
\n\`help\`, \`aide\` \n - Displays the list of commands.\n\n`)
.setFooter(`\n\nkodb  4/5`)
m.edit(embed4)
m.reactions.resolve(`4️⃣`).users.remove(message.author);

} else if(r.emoji.name === '5️⃣') {
    var embed4 = new MessageEmbed()
    .setAuthor(`🦖 Anti Raid Category`)
    .setColor(db.color)
    .setTitle(`Anti Raid part, only the server owner can execute these commands.
        
    > \`List of commands\``)
    .setDescription(`
    [Invite me:](${config.lien})\n\`configar\`, \`craid\`,\`configantiraid\` \n - Configure Anti Raid.\n\n
    [Invite me:](${config.lien})\n\`setupar\`, \`arrs\`,\`rs\` \n - Configurz your own anti-raid.\n\n`)
    .setFooter(`\n\nkodb  5/5`)
    m.edit(embed4)
    m.reactions.resolve(`5️⃣`).users.remove(message.author);
    
    }

});
await m.react("1️⃣")
await m.react("2️⃣")
await m.react("3️⃣")
await m.react("4️⃣")
await m.react("5️⃣")
setTimeout(() => {
   m.reactions.resolve(`1️⃣`).users.remove(client.user);
   m.reactions.resolve(`2️⃣`).users.remove(client.user);
   m.reactions.resolve(`3️⃣`).users.remove(client.user);
   m.reactions.resolve(`4️⃣`).users.remove(client.user);
   m.reactions.resolve(`5️⃣`).users.remove(client.user);
}, 20000);
    });
};



module.exports.help = {
    name: "help",
    aliases: ['aide','commands'],
    category: 'Administration',
    description: "Obtenez les informations de votre abonnement kodb",
  };

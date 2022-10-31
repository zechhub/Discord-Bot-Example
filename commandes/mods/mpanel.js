const { MessageEmbed } = require("discord.js"), 
fs = require("fs"), 
ms = require("ms"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };

function update(message, db) {
    fs.writeFile(`./serveur/${message.guild.id}.json`, JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
};

module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
   let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8")),
   filter = (reaction, user) => ['📃','🤫', '⚒️','🔇'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };
   const msgembed = new MessageEmbed()
   .setAuthor(`<a:emoji_51:865008218220789771> Moderation configuration menu of ${message.guild.name}`)
   .setColor(db.color)
   .setDescription("`📃` Define the moderation logs channel\n`🤫` Define the role with permissions to mute members\n`⚒️` Define the role with permissions to ban members\n`🔇` Define the muted role\n\n> Current configurations:")
   .addField("`📃` Logs:", db.mods.logs, true)
   .addField("`🤫` Role that can mute:", db.mods.mute, true)
   .addField("`⚒️`  Role that cant ban:", db.mods.ban, true)
   .addField("`🔇` Muted", db.mods.muted, true)
   .setFooter(`kodb`)
    message.channel.send(msgembed)
    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
if(r.emoji.name === "📃") {
    message.channel.send(`\`${getNow().time}\` 📃 Please enter the channel ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return  message.channel.send(`\`${getNow().time}\` 📃 Incorrect channel.`);
        db.mods.logs = channel.id 
        message.channel.send(`\`${getNow().time}\` 📃 You changed the logs channel to \`${channel.name}\``)
        m.edit({ embed: { author: { name: `🦖 Moderation configuration menu of ${message.guild.name}`}, color: db.color, description: "`📃` Define the moderation logs channel\n`🤫` Define the role with mute permissions for members\n`⚒️` Define the role with permissions to ban members\n`🔇` Define the muted role\n\n> Current configurations:", fields: [ { name: "`📃` Logs:", value: db.mods.logs, inline:true }, { name: "`🤫` Role that can mute:", value: db.mods.mute, inline: true}, { name: "`⚒️` Role that cant ban:", value: db.mods.ban, inline: true}, { name: "`🔇` Muted", value: db.mods.muted, inline: true} ]} });               
        update(message, db)
    });
        });
} else if(r.emoji.name === '🤫') {
    message.channel.send(`\`${getNow().time}\` 🤫 Please enter the role ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var role = message.guild.roles.cache.get(msg.content)
        if(!role) return  message.channel.send(`\`${getNow().time}\` 🤫 Incorrect role.`);
        db.mods.mute = role.id 
        message.channel.send(`\`${getNow().time}\` 🤫 You changed the role to \`${role.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `🦖 Moderation configuration menu of ${message.guild.name}`}, color: db.color, description: "`📃` Define the moderation logs channel\n`🤫` Define the role with mute permissions for members\n`⚒️` Define the role with permissions to ban members\n`🔇` Define the muted role\n\n> Current configurations:", fields: [ { name: "`📃` Logs:", value: db.mods.logs, inline:true }, { name: "`🤫` Role that can mute:", value: db.mods.mute, inline: true}, { name: "`⚒️` Role that cant ban:", value: db.mods.ban, inline: true}, { name: "`🔇` Muted", value: db.mods.muted, inline: true} ]} });
        });
    });
} else if(r.emoji.name === '⚒️') {
    message.channel.send(`\`${getNow().time}\` ⚒️ Please enter the role ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var role = message.guild.roles.cache.get(msg.content)
        if(!role) return  message.channel.send(`\`${getNow().time}\` ⚒️ Incorrect role.`);
        db.mods.ban = role.id 
        message.channel.send(`\`${getNow().time}\` ⚒️ You changed the role to \`${role.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `🦖 Moderation configuration menu of ${message.guild.name}`}, color: db.color, description: "`📃` Define the moderation logs channel\n`🤫` Define the role with mute permissions for members\n`⚒️` Define the role with permissions to ban members\n`🔇` Define the muted role\n\n> Current configurations:", fields: [ { name: "`📃` Logs:", value: db.mods.logs, inline:true }, { name: "`🤫` Role that can mute:", value: db.mods.mute, inline: true}, { name: "`⚒️` Role that cant ban:", value: db.mods.ban, inline: true}, { name: "`🔇` Muted", value: db.mods.muted, inline: true} ]} });
        });
    });
} else if(r.emoji.name === '🔇') {
    message.channel.send(`\`${getNow().time}\` 🔇 Please enter the role ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var role = message.guild.roles.cache.get(msg.content)
        if(!role) return  message.channel.send(`\`${getNow().time}\` 🔇 Incorrect role.`);
        db.mods.muted = role.id 
        message.channel.send(`\`${getNow().time}\` 🔇 You changed the role to \`${role.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `🦖 Moderation configuration menu of ${message.guild.name}`}, color: db.color, description: "`📃` Define the moderation logs channel\n`🤫` Define the role with mute permissions for members\n`⚒️` Define the role with permissions to ban members\n`🔇` Define the muted role\n\n> Current configurations:", fields: [ { name: "`📃` Logs:", value: db.mods.logs, inline:true }, { name: "`🤫` Role that can mute:", value: db.mods.mute, inline: true}, { name: "`⚒️` Role that cant ban:", value: db.mods.ban, inline: true}, { name: "`🔇` Muted", value: db.mods.muted, inline: true} ]} });
        });
    });
}
});
await m.react("📃")
await m.react("🤫")
await m.react("⚒️")
await m.react("🔇")
    });
};


module.exports.help = {
    name: "mods",
    aliases: ['mpanel','modspanel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration de la modération du serveur.",
  };
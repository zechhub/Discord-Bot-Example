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
   filter = (reaction, user) => ['✨', '📥','🔊','👤','💭'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`📚 Modification of the parameters concerning the logs of ${message.guild.name}`)
   .setColor(db.color)
   .setFooter(`kodb`)
   .setDescription("`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs \n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration")
   .addField("`📥` Entry logs", db.logs.serveur, true)
   .addField("`🔊` Voice logs", db.logs.vocal, true)
   .addField("`👤` Roles logs", db.logs.role, true)
   .addField("`💭` Messages logs", db.logs.message, true)
    message.channel.send(msgembed)
    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
if(r.emoji.name === "✨") { 
message.channel.send(`\`${getNow().time}\` ✨ Creation of the current logs category..`).then(msg => {
        m.guild.channels.create('Logs', {
            type: 'category',
            permissionsOverwrites: [{
              id: message.guild.id,
              deny: ['VIEW_CHANNEL']
            }]
        }).then(c => {
            c.guild.channels.create('join-leave', {
                type: 'text',
                parent: c.id,
                permissionOverwrites: [
                   {
                     id: message.guild.id,
                     deny: ['VIEW_CHANNEL']
                  },
                ],
              }).then(joinleave => {
            db.logs.serveur = joinleave.id
            c.guild.channels.create('vocaux', {
                type: 'text',
                parent: c.id,
                permissionOverwrites: [
                   {
                     id: message.guild.id,
                     deny: ['VIEW_CHANNEL']
                  },
                ],
              }).then(vocaux => {
            db.logs.vocal = vocaux.id
            c.guild.channels.create('role', {
                type: 'text',
                parent: c.id,
                permissionOverwrites: [
                   {
                     id: message.guild.id,
                     deny: ['VIEW_CHANNEL']
                  },
                ],
              }).then(role => {
            db.logs.role = role.id
            c.guild.channels.create('message', {
                type: 'text',
                parent: c.id,
                permissionOverwrites: [
                   {
                     id: message.guild.id,
                     deny: ['VIEW_CHANNEL']
                  },
                ],
              }).then(message => {
                db.logs.message = message.id
                update(message, db)
                m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });         
                msg.edit(`\`${getNow().time}\` ✨ Creation of the log category successfully completed.`)
                  });
                });
            });
            });
        })
        // --
        });
} else if(r.emoji.name === "📥") {
    message.channel.send(`\`${getNow().time}\` 📥 Please enter the Channel ID or write \`false\` to disable logs`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content === "false") {
          db.logs.serveur = false
          message.channel.send(`\`${getNow().time}\` 📥 You have disabled input logs`)
          update(message, db)
          m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });         
        } else {  
        var channel = message.guild.channels.cache.get(msg.content)

        if(!channel) return  message.channel.send(`\`${getNow().time}\` 📥 Incorrect Channel`)
        db.logs.serveur = channel.id
        message.channel.send(`\`${getNow().time}\` 📥 You have changed the entry log channel to \`${channel.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });         
        }
      });
        });
} else if(r.emoji.name === "🔊") {
    message.channel.send(`\`${getNow().time}\` 🔊 Please enter the channel ID or write \`false\` to disable logs`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();

        if(msg.content === "false") {
          db.logs.vocal = false
          message.channel.send(`\`${getNow().time}\` 🔊 You have deactivated the input logs`)
          update(message, db)
          m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });                   
        } else {  
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return  message.channel.send(`\`${getNow().time}\` 🔊 Incorrect Channel.`)
        db.logs.vocal = channel.id
        message.channel.send(`\`${getNow().time}\` 🔊 You have changed the voice log channel to \`${channel.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });                  
        }
      });
        });
} else if(r.emoji.name === "👤") {
    message.channel.send(`\`${getNow().time}\` 👤 Please enter the Channel ID or write \`false\` to disable logs.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        
        if(msg.content === "false") {
          db.logs.role = false
          message.channel.send(`\`${getNow().time}\` 👤 You have disabled role logs`)
          update(message, db)
          m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });               
        } else { 
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return  message.channel.send(`\`${getNow().time}\` 👤 Incorrect Channel.`)
        db.logs.role = channel.id
        message.channel.send(`\`${getNow().time}\` 👤 You have changed the role log channel to \`${channel.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });                  
        }
      });
        });
} else if(r.emoji.name === "💭") {
    message.channel.send(`\`${getNow().time}\` 💭 Please enter the Channel ID or write \`false\` to disable logs.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content === "false") {
          db.logs.message = false
          message.channel.send(`\`${getNow().time}\` 💭 You have disabled message logs`)
          update(message, db)
          m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });                
        } else { 
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return  message.channel.send(`\`${getNow().time}\` 💭 Incorrect Channel.`)
        db.logs.message = channel.id
        message.channel.send(`\`${getNow().time}\` 💭 You have changed the message log channel to \`${channel.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `📚 Modification of the parameters concerning the logs of ${message.guild.name}`}, color: db.color, description: "`✨`  Create a configuration for me\n`📥` Define the service entry log channel \n`🔊` Define the voice movement logs\n`👤`  Define the log channel about role \n`💭` Define the message log channel\n\n>  Actual Configuration" , fields: [ {name: "`📥` Entry logs", value: db.logs.serveur, inline: true }, { name: "`🔊` Voice logs", value: db.logs.vocal, inline: true},{ name: "`👤` Roles logs", value: db.logs.role, inline: true}, { name: "`💭` Message logs", value: db.logs.message, inline: true}   ] } });           
        }
      });
        });
}
});
await m.react("✨")
await m.react("📥")
await m.react("🔊")
await m.react("👤")
await m.react("💭")
    });
};


module.exports.help = {
    name: "logs",
    aliases: ['lpanel','logspanel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des logs.",
  };
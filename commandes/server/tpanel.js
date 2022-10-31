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
   config = require("../../config.json"),
   winner = null,
   presence = {
   "false": "Desable",
   "true": "enable"
   },
   filter = (reaction, user) => ['✨', '🏷️','✅','❌','📖','🎗️'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };
   const msgembed = new MessageEmbed()
   .setAuthor(`🕙 Modification of the temporary channel of ${message.guild.name}`)
   .setColor(db.color)
   .setDescription("`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:")
   .addField("`📖` Category", db.tempo.category, true)
   .addField("`🏷️` Channel", db.tempo.channel, true)
   .addField("`🎗️` Emoji", db.tempo.emoji, true)
    message.channel.send(msgembed).then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
    if(r.emoji.name === "✨") {
        message.channel.send(`\`${getNow().time}\` ✨ Creation of the category of temporary voice channel in progress..`).then(msg => {
            m.guild.channels.create('Temporary Channel', {
                type: 'category',
                permissionsOverwrites: [{
                  id: message.guild.id,
                  allow: ['VIEW_CHANNEL','CONNECT','SPEAK']
                }]
              }).then(c => {
                db.tempo.category = c.id
                c.guild.channels.create('➕ Create', {
                    type: 'voice',
                    parent: c.id,
                    permissionOverwrites: [
                       {
                         id: message.guild.id,
                         allow: ['VIEW_CHANNEL','CONNECT','SPEAK']
                      },
                    ],
                  }).then(v => {
                db.tempo.channel = v.id
                update(message, db)
                m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });         
                msg.edit(`\`${getNow().time}\` ✨ Creation of the personalized salons category successfully completed.`)
                  });
              })
        })
    } else if(r.emoji.name === "📖") {
        message.channel.send(`\`${getNow().time}\` 📖 Please enter Category ID.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            var category = message.guild.channels.cache.get(msg.content)
            if(!category) return  message.channel.send(`\`${getNow().time}\` 📖 Incorrect Channel.`);
            if(category.type !== "category") return message.channel.send(`\`${getNow().time}\` 📖 Incorrect Channel.`);
            db.tempo.channel = category.id 
            message.channel.send(`\`${getNow().time}\` 📖 You have changed the channel from category to \`${category.name}\``)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });  
            });
            });
    } else if(r.emoji.name === "🏷️") {
        message.channel.send(`\`${getNow().time}\` 🏷️ Please enter the voice channel ID.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            var category = message.guild.channels.cache.get(msg.content)
            if(!category) return  message.channel.send(`\`${getNow().time}\` 🏷️ Incorrect Channel.`);
            if(category.type !== "voice") return message.channel.send(`\`${getNow().time}\` 🏷️ Incorrect Channel.`);
            db.tempo.channel = category.id 
            message.channel.send(`\`${getNow().time}\` 🏷️ You have changed the creative channel to \`${category.name}\``)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });          
            });
            });
    } else if(r.emoji.name === "🎗️") {
        message.channel.send(`\`${getNow().time}\` 🎗️ Please send the emoji you want.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            db.tempo.emoji = msg.content
            message.channel.send(`\`${getNow().time}\` 🎗️ You changed the emoji to \`${db.tempo.emoji}\`.`)
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });           
            });
        });
    } else if(r.emoji.name === '✅') {
        if(db.tempo.module === true) { return message.channel.send(`\`${getNow().time}\` ✅ Module is already enabled.`); }
        db.tempo.module = true
        update(message, db)
        m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });          
        message.channel.send(`\`${getNow().time}\` ✅ You have enabled the temporary channel`)
    } else if(r.emoji.name === '❌') {
            if(db.tempo.module === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already desabled.`);
            db.tempo.module = false
            update(message, db)
            m.edit({ embed: { author: { name: `🕙 Modification of the temporary channel of ${message.guild.name}`}, color: db.color, description:  "`✨` Creates an automatic configuration\n`📖` Edit category\n`🏷️` Edit the creative channel\n`🎗️` Change the emoji to the prefix of temporary channels\n`✅`Enable the module\n`❌` Desable the module\n\n > Actual Configuration:" , fields: [ {name: "`📖` Category", value: db.tempo.category, inline: true }, { name: "`🏷️` Channel", value: db.tempo.channel, inline: true},{ name: "`🎗️` Emoji", value: db.tempo.emoji, inline: true}   ] } });  
            message.channel.send(`\`${getNow().time}\` ❌ You have desabled the temporary channel`)
    }
// --
});
await m.react("✨")
await m.react("📖")
await m.react("🏷️")
await m.react("🎗️")
await m.react("✅")
await m.react("❌")
    });

};


module.exports.help = {
    name: "tpanel",
    aliases: ['configtempo','tempo','tempchannel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des salons temporaires.",
  };
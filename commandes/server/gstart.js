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
   "false": "Désactivé",
   "true": "Activé"
   },
   filter = (reaction, user) => ['🕙', '🏷️','🕵️','🔊','🎁','✅'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`🎉 Launch a giveaway on ${message.guild.name}`)
   .setColor(db.color)
   .setDescription(`\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`)
   .addField(`\`🕙\`  Time`, ms(db.giveaway.duree), true)
   .addField(`\`🏷️\`  Channel`, `<#${db.giveaway.channel}>`, true)
   .addField(`\`🕵️\` Imposed winner`, `${db.giveaway.gagnant}`, true)
   .addField(`\`🔊\` Voice Presence`, `${presence[db.giveaway.voice]}`, true)
   .addField(`\`🎁\` Gain`, `${db.giveaway.gain}`, true)
   .setFooter(`kodb`)
    message.channel.send(msgembed)
    .then(async m => {
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
    if (r.emoji.name === '🕙') {
        message.channel.send(`\`${getNow().time}\` 🕙 Please enter a value for the time.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            if(!msg.content.endsWith("d") && !msg.content.endsWith("h") && !msg.content.endsWith("m")) return message.channel.send(`\`${getNow().time}\` 🕙 Temps incorrect.`)
            db.giveaway.duree = ms(msg.content)
            message.channel.send(`\`${getNow().time}\` 🕙 You changed the time of the next giveaway to **${ms(db.giveaway.duree)}**`)
            m.edit({ embed: { author: { name: `🎉 Launch a giveaway on ${message.guild.name}`}, color: db.color, description: `\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`, fields: [ {name: `\`🕙\`  Time`, value: ms(db.giveaway.duree), inline: true }, { name: `\`🏷️\`  Channel`, value: `<#${db.giveaway.channel}>`, inline: true}, { name: `\`🕵️\` Imposed winner`, value: `${db.giveaway.gagnant}`, inline: true }, { name: `\`🔊\` Voice presence`, value: `${presence[db.giveaway.voice]}`, inline: true }, { name: `\`🎁\` Gain`, value: `${db.giveaway.gain}`, inline: true }   ] } });         
            update(message, db)
        });
        })
    // --
    } else if(r.emoji.name === '🏷️') {
        message.channel.send(`\`${getNow().time}\` 🏷️ Please enter the channel ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return  message.channel.send(`\`${getNow().time}\` 🏷️ Incorrect channel.`)
        db.giveaway.channel = channel.id
        message.channel.send(`\`${getNow().time}\` 🏷️ You have changed the channel of the next giveaway to \`${channel.name}\``)
        m.edit({ embed: { author: { name: `🎉 Launch a giveaway on ${message.guild.name}`}, color: db.color, description: `\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`, fields: [ {name: `\`🕙\`  Time`, value: ms(db.giveaway.duree), inline: true }, { name: `\`🏷️\`  Channel`, value: `<#${db.giveaway.channel}>`, inline: true}, { name: `\`🕵️\` Imposed winner`, value: `${db.giveaway.gagnant}`, inline: true }, { name: `\`🔊\` Voice presence`, value: `${presence[db.giveaway.voice]}`, inline: true }, { name: `\`🎁\` Gain`, value: `${db.giveaway.gain}`, inline: true }   ] } });   
        update(message, db)
        });
        });
    } else if(r.emoji.name === '🕵️') {
        message.channel.send(`\`${getNow().time}\` 🕵️ Please enter the user id. (or write \`false\` to disable it)`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
                var msg = cld.first();
                if(msg.content === "false") {
                    db.giveaway.gagnant = false
                    message.channel.send(`\`${getNow().time}\` 🕵️ You have deactivated the predefined winners`)
                    m.edit({ embed: { author: { name: `🎉 Launch a giveaway on ${message.guild.name}`}, color: db.color, description: `\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`, fields: [ {name: `\`🕙\`  Time`, value: ms(db.giveaway.duree), inline: true }, { name: `\`🏷️\`  Channel`, value: `<#${db.giveaway.channel}>`, inline: true}, { name: `\`🕵️\` Imposed winner`, value: `${db.giveaway.gagnant}`, inline: true }, { name: `\`🔊\` Voice presence`, value: `${presence[db.giveaway.voice]}`, inline: true }, { name: `\`🎁\` Gain`, value: `${db.giveaway.gain}`, inline: true }   ] } });     
                    update(message, db)
                } else {
                var users = message.guild.members.cache.get(msg.content)
                if(!users)  return  message.channel.send(`\`${getNow().time}\` 🕵️ Incorrect User.`)
                db.giveaway.gagnant = users.id
                message.channel.send(`\`${getNow().time}\` 🕵️ You have changed the predefined winner to \`${users.user.username}\``)
                m.edit({ embed: { author: { name: `🎉 Launch a giveaway on ${message.guild.name}`}, color: db.color, description: `\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`, fields: [ {name: `\`🕙\`  Time`, value: ms(db.giveaway.duree), inline: true }, { name: `\`🏷️\`  Channel`, value: `<#${db.giveaway.channel}>`, inline: true}, { name: `\`🕵️\` Imposed winner`, value: `${db.giveaway.gagnant}`, inline: true }, { name: `\`🔊\` Voice presence`, value: `${presence[db.giveaway.voice]}`, inline: true }, { name: `\`🎁\` Gain`, value: `${db.giveaway.gain}`, inline: true }   ] } });         
                update(message, db)
                }
            });
        });
    } else if(r.emoji.name === '🔊') {
        message.channel.send(`\`${getNow().time}\` :x: **Options temporarily disabled.**`)
    } else if(r.emoji.name === '🎁') {
        message.channel.send(`\`${getNow().time}\` 🎁 Please write what you would like to give.`).then(mp => {
            mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
            .then(cld => {
            var msg = cld.first();
            db.giveaway.gain = msg.content
            message.channel.send(`\`${getNow().time}\` 🎁 The next giveaway the prize to be won will be \`${db.giveaway.gain}\`.`)
            m.edit({ embed: { author: { name: `🎉 Launch a giveaway on ${message.guild.name}`}, color: db.color, description: `\`🕙\` Change the duration \n \`🏷️\` Edit Channel \n \`🕵️\` Define an imposed winner \n \`🔊\` Change the requirement to be vocal \n \`🎁\` Modifier le gain \n \`✅\` Start the giveaway \n \n > Actual Configuration:`, fields: [ {name: `\`🕙\`  Time`, value: ms(db.giveaway.duree), inline: true }, { name: `\`🏷️\`  Channel`, value: `<#${db.giveaway.channel}>`, inline: true}, { name: `\`🕵️\` Imposed winner`, value: `${db.giveaway.gagnant}`, inline: true }, { name: `\`🔊\` Voice presence`, value: `${presence[db.giveaway.voice]}`, inline: true }, { name: `\`🎁\` Gain`, value: `${db.giveaway.gain}`, inline: true }   ] } });        
            update(message, db)
            });
        });
    } else if(r.emoji.name === '✅') {
        var channel = message.guild.channels.cache.get(db.giveaway.channel)
        if(!channel) return message.channel.send(`\`${getNow().time}\` :x: **Erreur rencontrée**: please redefine the giveaway channel.`)
        message.channel.send(`\`${getNow().time}\` ✅ Giveaway launched in ${channel}.`)
    
       var timestamp = Date.now() + db.giveaway.duree
        var embed = new MessageEmbed()
        .setTitle(db.giveaway.gain)
        .setDescription(`React with :tada: to participate!
        Giveaway Time: **${ms(db.giveaway.duree)}**
        Launched by: ${message.author}`)
        .setColor(3553599)
        .setFooter(`End of the giveaway at`)
        .setTimestamp(timestamp)
        .setFooter(`kodb`)
        var msg = await channel.send(embed)
        msg.react("🎉")
    
        setTimeout(() => {
            db.giveaway.last = msg.id
            update(message, db)
        if (msg.reactions.cache.get("🎉").count <= 1) {
            message.channel(`\`${getNow().time}\` :x: **Erreur rencontrée**: no winner`)
        }
        if(db.giveaway.gagnant !== false) {
            winner = message.guild.members.cache.get(db.giveaway.gagnant)
            if(!winner) return winner = msg.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot).random();
        } else if(db.giveaway.voice === true) {
            winner = msg.reactions.cache.get("🎉").users.cache.filter((u) => !u.voice).random()
        } else {
            winner = msg.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot).random()
        }
        var embed = new MessageEmbed()
        .setTitle(db.giveaway.gain)
        .setDescription(`
        Winner: ${winner}
        Launched by: ${message.author}`)
        .setColor(3553599)
        .setFooter(`End of the giveaway at`)
        .setFooter(`kodb`)
        .setTimestamp(Date.now())
        msg.edit(embed)
        channel.send(`Congrulation, <@${winner.id}> you have win the **${db.giveaway.gain}**`)
        }, db.giveaway.duree);
    }

});
    await m.react("🕙")
    await m.react("🏷️")
    await m.react("🕵️")
    await m.react("🔊")
    await m.react("🎁")
    await m.react("✅")
})

};


module.exports.help = {
    name: "giveaway",
    aliases: ['gstart','giveawaystart'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des giveaways.",
  };
const { MessageEmbed } = require("discord.js"), 
fs = require("fs"), 
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };

function update(message, db) {
    fs.writeFile(`./serveur/${message.guild.id}.json`, JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
};
let config = require("./../../config.json")
module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
   let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8")),
   filter = (reaction, user) => ['✨','👤','👥', '⭐','🌟','🔉','🔊'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`📊 Changing settings about member counters of ${message.guild.name}`)
   .setColor(db.color)
   .setDescription(`\`✨\` Create a configuration for me\n\`👤\` Configure the total member counter channel\n\`👥\` Change the format of the total member counter\n\`⭐\` Configure the online member counter channel\n\`🌟\` Change the format of the online member counter\n\`🔉\`  Configure the voice member counter channel\n\`🔊\` Change the format of the voice member counter\n\n>  [Invite me:](${config.lien})`)
   .addField("`👤` Total member counter:", db.membercounter.total, true)
   .addField("`⭐` Online members Counter:", db.membercounter.online, true)
   .addField("`🔉` Compteur des membres en Vocal:", db.membercounter.vocal, true)
   .addField("`👥` Total Member Counter Format:", db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), true)
   .addField("`🌟` Online Member Counter Format:", db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), true)
   .addField("`🔊` Voice Member Counter Format:", db.membercounter.vocalformat.replace(`<count>`, message.guild.members.cache.filter(m => m.voice.channel).size), true)
   .setFooter(`kodb`)
    message.channel.send(msgembed)

.then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
if(r.emoji.name === "✨") { 
        message.channel.send(`\`${getNow().time}\` ✨ Creation of the current logs category..`).then(msg => {
                m.guild.channels.create('📊 Member Counter', {
                    type: 'category',
                    permissionsOverwrites: [{
                      id: message.guild.id,
                      deny: ['CONNECT'],
                      allow: ['VIEW_CHANNEL']
                    }]
                }).then(c => {
                    c.setPosition(0)
                    c.guild.channels.create(`👥 Members: ${message.guild.memberCount}`, {
                        type: 'voice',
                        parent: c.id,
                        permissionOverwrites: [
                           {
                             id: message.guild.id,
                             deny: ['CONNECT'],
                             allow: ['VIEW_CHANNEL']
                          },
                        ],
                      }).then(total => {
                    db.membercounter.totalformat = `👥 Members: <count>`
                    db.membercounter.total = total.id
                    c.guild.channels.create(`✅ Online: ${message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size}`, {
                        type: 'voice',
                        parent: c.id,
                        permissionOverwrites: [
                           {
                             id: message.guild.id,
                             deny: ['CONNECT'],
                             allow: ['VIEW_CHANNEL']
                          },
                        ],
                      }).then(online => {
                    db.membercounter.onlineformat = `✅ Online: <count>`
                    db.membercounter.online = online.id
                    c.guild.channels.create(`🎧 In Voice: ${message.guild.members.cache.filter(m => m.voice.channel).size}`, {
                        type: 'voice',
                        parent: c.id,
                        permissionOverwrites: [
                           {
                             id: message.guild.id,
                             deny: ['CONNECT'],
                             allow: ['VIEW_CHANNEL']
                          },
                        ],
                      }).then(vocal => {
                        db.membercounter.vocalformat =  `🎧 In Voice: <count>`
                        db.membercounter.vocal = vocal.id
                        update(message, db)
                        m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
                        msg.edit(`\`${getNow().time}\` ✨ Successful creation of the member count category.`)
                          });
                        });
                    });
                    });
                })
} else if(r.emoji.name === "👤") {
    message.channel.send(`\`${getNow().time}\` 👤 Please enter the Channel ID or write \`false\` to disable the counter.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content === "false") {
          db.membercounter.total = false
          db.membercounter.guild = message.guild.id
          message.channel.send(`\`${getNow().time}\` 👤 You have desable the Counter.`)
          update(message, db)
          m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
         } else { 
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return message.channel.send(`\`${getNow().time}\` 👤 Incorrect Channel.`)
        db.membercounter.total = channel.id
        console.log(db.membercounter.total )
        db.membercounter.guild = message.guild.id
        message.channel.send(`\`${getNow().time}\` 👤 You have changed the Member Counters Channel to \`${channel.name}\``)
        update(message, db)
        channel.setName(db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount)).catch(console.error)
        m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} });      
        }
      });
        });
} else if(r.emoji.name === "👥") {
    message.channel.send(`\`${getNow().time}\` 👥 Please write the format you want, add \`<count>\` to add the number of members`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content.includes('<count>')) {
            db.membercounter.totalformat = msg.content
            db.membercounter.guild = message.guild.id
            message.channel.send(`\`${getNow().time}\` 👥 You changed the format of the member counter to \`${msg.content.replace(`<count>`, message.guild.memberCount)}\``)
            update(message, db)
            console.log(db.membercounter.total)
            var channel = client.channels.cache.get(db.membercounter.total)
            if(!channel) return;
            channel.setName(db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount)).catch(console.error).then(console.log)
            m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
        } else {
        message.channel.send(`\`${getNow().time}\` 👥 Incorrect Format, please add \`<count>\` in the format.`)
        }
        });
    });
} else if(r.emoji.name === "⭐") {
    message.channel.send(`\`${getNow().time}\` ⭐ Please enter the Channel ID or write \`false\` to disable the counter.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content === "false") {
          db.membercounter.online = false
          db.membercounter.guild = message.guild.id
          message.channel.send(`\`${getNow().time}\` ⭐ You have deactivated the counter`)
          update(message, db)
          m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} });      
         } else { 
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return message.channel.send(`\`${getNow().time}\` ⭐ Incorrect Channel.`)
        db.membercounter.online = channel.id
        db.membercounter.guild = message.guild.id
        message.channel.send(`\`${getNow().time}\` ⭐ You have changed the Channel from the online members counter to \`${channel.name}\``)
        update(message, db)
        channel.setName(db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size)).catch(console.error)
        m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
        }
      });
        });
} else if(r.emoji.name === "🌟") {
    message.channel.send(`\`${getNow().time}\` 🌟 Please write the format you want, add \`<count>\` to add the number of members`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content.includes('<count>')) {
            db.membercounter.onlineformat = msg.content
            db.membercounter.guild = message.guild.id
            message.channel.send(`\`${getNow().time}\` 🌟 You have changed the format of the online members counter to \`${msg.content.replace(`<count>`, message.guild.members.filter(m => m.presence.status === 'online').size)}\``)
            update(message, db)
            var channel = client.channels.cache.get(db.membercounter.online)
            if(!channel)
            channel.setName(db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size)).catch(console.error)
            m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} });      
        } else {
        message.channel.send(`\`${getNow().time}\` 🌟 Incorrect Format, please add \`<count>\` in the format.`)
        }
        });
    });
} else if(r.emoji.name === "🔉") {
    message.channel.send(`\`${getNow().time}\` 🔉 Please enter the Channel ID or write \`false\` to disable the counter.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content === "false") {
          db.membercounter.vocal = false
          db.membercounter.guild = message.guild.id
          message.channel.send(`\`${getNow().time}\` 🔉 You have deactivated the counter`)
          update(message, db)
          m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
         } else { 
        var channel = message.guild.channels.cache.get(msg.content)
        if(!channel) return message.channel.send(`\`${getNow().time}\` 🔉 Incorrect Channel.`)
        db.membercounter.vocal = channel.id
        db.membercounter.guild = message.guild.id
        message.channel.send(`\`${getNow().time}\` 🔉 You have changed the format of the Voice members counter to \`${channel.name}\``)
        update(message, db)
        channel.setName(db.membercounter.vocalformat.replace(`<count>`, message.guild.members.cache.filter(m => m.voice.channel).size)).catch(console.error)
        m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
        }
      });
        });
} else if(r.emoji.name === "🔊") {
    message.channel.send(`\`${getNow().time}\` 🔊 Please write the format you want, add \`<count>\` to add the number of members`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        if(msg.content.includes('<count>')) {
            db.membercounter.vocalformat = msg.content
            db.membercounter.guild = message.guild.id
            message.channel.send(`\`${getNow().time}\` 🔊 You changed the format of the member counter to \`${msg.content.replace(`<count>`, message.guild.memberCount)}\``)
            update(message, db)
            var channel = client.channels.cache.get(db.membercounter.vocal)
            if(!channel)
            channel.setName(db.membercounter.vocalformat.replace(`<count>`, message.guild.members.cache.filter(m => m.voice.channel).size)).catch(console.error)
            m.edit({ embed: { author: { name: `📊 Changing settings about member counters of ${message.guild.name}`}, color: db.color, description:  "`✨` Create a configuration for me\n`👤`Configure the total member counter channel\n`👥` Change the format of the total member counter\n`⭐` Configure the online member counter channel\n`🌟` Change the format of the online member counter\n`🔉`  Configure the voice member counter channel\n`🔊` Change the format of the voice member counter\n\n", fields: [ {name: "`👤` Total member counter:", value: db.membercounter.total, inline: true }, { name: "`⭐` Online members Counter:", value: db.membercounter.online, inline: true},{ name: "`🔉` Compteur des membres en ligne:", value: db.membercounter.vocal, inline: true}, { name: "`👥` Total Member Counter Format:", value: db.membercounter.totalformat.replace(`<count>`, message.guild.memberCount), inline: true}, { name: "`🌟` Online Member Counter Format:", value: db.membercounter.onlineformat.replace(`<count>`, message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size), inline: true}, { name: "`🔊` Voice Member Counter Format:", value: db.membercounter.vocalformat.replace(`<count>`,  message.guild.members.cache.filter(m => m.voice.channel).size), inline: true} ]} }); 
        } else {
        message.channel.send(`\`${getNow().time}\` 🔊 Incorrect Format, please add \`<count>\` in the format.`)
        }
        });
    });
} 
});
await m.react("✨")
await m.react("👤")
await m.react("👥")
await m.react("⭐")
await m.react("🌟")
await m.react("🔉")
await m.react("🔊")
    });

};


module.exports.help = {
    name: "membercount",
    aliases: ['mbpanel','cpanel','membercounterpanel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des compteurs de membre.",
  };
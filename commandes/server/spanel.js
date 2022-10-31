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
   filter = (reaction, user) => ['👥', '🏷️','✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`😄 Changing the settings about the Custom Status of ${message.guild.name}`)
   .setColor(db.color)
   .setDescription("`👥`  Define the role to be given\n`🏷️` Définir le statut a mettre \n`✅` Enable the module\n`❌` Desable the module\n\n> Actual Configuration:")
   .addField("`👥` Rôle", db.statut.role, true)
   .addField("`🏷️` Statut", db.statut.state, true)
   .setFooter(`Owly BOT`)
    message.channel.send(msgembed)
    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
    if(r.emoji.name === '👥') {
		message.channel.send(`\`${getNow().time}\` 👥 Veuillez entrée l'ID du rôle.`).then(mp => {
			mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
			.then(cld => {
			var msg = cld.first();
			var role = message.guild.roles.cache.get(msg.content)
			if(!role) return  message.channel.send(`\`${getNow().time}\` 👥 Rôle incorrect.`)
            db.statut.role = role.id
            m.edit({ embed: { author: { name: `😄 Changing the settings about the Custom Status of ${message.guild.name}`}, color: db.color, description: "`👥`  Define the role to be given\n`🏷️` Define the role to be given \n`✅` Enable the module\n`❌` Desable the module\n\n> Actual Configuration:", fields: [ {name: "`👥` Rôle", value: db.statut.role, inline: true }, { name: "`🏷️` Statut", value: db.statut.state, inline: true}  ] } });         
            update(message, db)
			message.channel.send(`\`${getNow().time}\` 👥 You changed the role to be given in \`${role.name}\``)
			});
			});
	} else if(r.emoji.name === '🏷️') {
		message.channel.send(`\`${getNow().time}\` 🏷️ Please enter the status users should have.`).then(mp => {
			mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
			.then(cld => {
			var msg = cld.first();
            db.statut.state = msg.content
            m.edit({ embed: { author: { name: `😄 Changing the settings about the Custom Status of ${message.guild.name}`}, color: db.color, description: "`👥`  Define the role to be given\n`🏷️` Define the role to be given \n`✅` Enable the module\n`❌` Desable the module\n\n> Actual Configuration:", fields: [ {name: "`👥` Rôle", value: db.statut.role, inline: true }, { name: "`🏷️` Statut", value: db.statut.state, inline: true}  ] } });                
            update(message, db)
			message.channel.send(`\`${getNow().time}\` 🏷️ You have changed the status that users should have in \`${msg}\``)
			});
			});
	} else if(r.emoji.name === '✅') {
        if(db.statut.module === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already enabled.`); }
        db.statut.module = true
        m.edit({ embed: { author: { name: `😄 Changing the settings about the Custom Status of ${message.guild.name}`}, color: db.color, description: "`👥`  Define the role to be given\n`🏷️` Define the role to be given \n`✅` Enable the module\n`❌` Desable the module\n\n> Actual Configuration:", fields: [ {name: "`👥` Rôle", value: db.statut.role, inline: true }, { name: "`🏷️` Statut", value: db.statut.state, inline: true}  ] } });              
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have activate the **Custom Statut** auto role`)
    } else if(r.emoji.name === '❌') {
            if(db.statut.module === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already desabled.`);
            db.statut.module = false
            m.edit({ embed: { author: { name: `😄 Changing the settings about the Custom Status of ${message.guild.name}`}, color: db.color, description: "`👥`  Define the role to be given\n`🏷️` Define the role to be given \n`✅` Enable the module\n`❌` Desable the module\n\n> Actual Configuration:", fields: [ {name: "`👥` Rôle", value: db.statut.role, inline: true }, { name: "`🏷️` Statut", value: db.statut.state, inline: true}  ] } });                  
            update(message, db)
            message.channel.send(`\`${getNow().time}\` ❌ You have desable the **Custom Statut** auto role`)
    }
});
await m.react("👥")
await m.react("🏷️")
await m.react("✅")
await m.react("❌")
    });

};


module.exports.help = {
    name: "statut",
    aliases: ['spanel','statutpanel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration des Custom Status.",
  };
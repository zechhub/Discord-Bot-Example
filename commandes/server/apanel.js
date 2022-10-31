const { MessageEmbed } = require("discord.js"), 
fs = require("fs"), 
ms = require("ms"),
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
   filter = (reaction, user) => ['🎭', '✅','❌'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`🦖 Modification of the parameters of ${message.guild.name}`)
   .setColor(db.color)
   .setFooter(`kodb`)
   .setDescription(`\`🎭\` Change the role\n\`✅\` Enable the module\n\`❌\` Desable the module\n\n> [Invite me:](${config.lien})`)
   .addField("`🎭` Rôle", db.autorole.role, true)

    message.channel.send(msgembed)
    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 
if(r.emoji.name === "🎭") {
    message.channel.send(`\`${getNow().time}\` 🎭 Please enter the role ID.`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
        var msg = cld.first();
        var role = message.guild.roles.cache.get(msg.content)
        if(!role) return  message.channel.send(`\`${getNow().time}\` 🎭 Incorrect channel.`);
        db.autorole.role = role.id 
        message.channel.send(`\`${getNow().time}\` 🎭 You changed the role to \`${role.name}\``)
        update(message, db)
        m.edit({ embed: { author: { name: `🦖 Modification of the parameters of ${message.guild.name}`}, color: db.color, description: `\`🎭\` Change the role\n\`✅\` Enable the module\n\`❌\` Desable the module\n\n> [Invite me:](${config.lien})`, fields: [ { name: "`🎭` Rôle", value: db.autorole.role, inline:true } ]} });               
    });
        });
    } else if(r.emoji.name === '✅') {
        if(db.autorole.module === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
        db.autorole.module = true
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have enabled the **Custom Statut** auto role.`)
    } else if(r.emoji.name === '❌') {
            if(db.autorole.module === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
            db.autorole.module = false
            update(message, db)
            message.channel.send(`\`${getNow().time}\` ❌ You have desabled the **Custom Statut** auto role.`)
    }
});
await m.react("🎭")
await m.react("✅")
await m.react("❌")
    });
};


module.exports.help = {
    name: "autorole",
    aliases: ['apanel','autorolepanel'],
    category: 'Gestion de serveur',
    description: "- Permet d'afficher le panel de configuration de l'autorole.",
  };

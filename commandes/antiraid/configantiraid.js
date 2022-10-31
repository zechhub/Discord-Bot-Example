const { error } = require("console");

const { MessageEmbed } = require("discord.js"), 
fs = require("fs"),
getNow = () => { return { time: new Date().toLocaleString("en-GB", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }), }; };


function update(message, db) {
    fs.writeFile(`./Data/${message.guild.id}.json`, JSON.stringify(db), (x) => {
        if (x) console.error(x)
      });
};

module.exports.run = async (client, message, args) => {
    if(!message.guild) return;
    if(message.author.id === "740532241888837693"){
        
        fs.readFile(`./Data/${message.guild.id}.json`, async (err, data) => {
            if (err) return  message.channel.send(":x: **Please execute the `rs` command to setup the anti raid mode**");
    let db_guild = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
    let db = JSON.parse(fs.readFileSync(`./Data/${message.guild.id}.json`, "utf8"));
filter = (reaction, user) => ['📗','📕','✔️', '✖️','🎭','📣','📢','💷','💵'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`<a:emoji_54:865008343345004566> Modification of the Anti-Webhook settings of ${message.guild.name}`)
   .setColor(db_guild.color)
   .setFooter(`Kodb`)
   .setDescription(" `📗` Enable the Anti-Webhook module \n `📕` Desable the Anti-Webhook module \n\n `✔️`Enable the Anti-Bot module \n `✖️` Desable the Anti-Bot module \n\n `🎭`Configure the whitelist role\n\n `📣` Enable the Anti-Spam and Anti-Invites module \n `📢` Desable the Anti-Spam and Anti-Invites module \n\n `💵`  Enable the Anti-Raid module\n `💷` Desable the Anti-Raid module")
   message.channel.send(msgembed)


    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 


    //anti webhook
if(r.emoji.name === '📗') {
        if(db.antiraid.antiwebhook === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
        db.antiraid.antiwebhook = true
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti webhook module`)
    } else if(r.emoji.name === '📕') {
            if(db.antiraid.antiwebhook === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
            db.antiraid.antiwebhook = false
            update(message, db)
            message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti webhook module`)


//anti bot 
} else if(r.emoji.name === '✔️') {
        if(db.antiraid.antibot === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
        db.antiraid.antibot = true
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti bot module`)


} else if(r.emoji.name === '✖️') {
    if(db.antiraid.antibot === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
    db.antiraid.antibot = false
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti bot module`)


    //role qui sera whitelist
} else if(r.emoji.name === '🎭') {
    message.channel.send(`\`${getNow().time}\` 🎭 Please enter the role id. (or write \`None\` to disable it)`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
            var msg = cld.first();
            if(msg.content === "None") {
                db.antiraid.role_wl = false
                message.channel.send(`\`${getNow().time}\` 🎭 You have deactivated the whitelist role, only you could bypass the anti-virus`)
                update(message, db)
            } else {
            var rolew = message.guild.roles.cache.get(msg.content)
            if(!rolew)  return  message.channel.send(`\`${getNow().time}\` 🎭 Incorrect role.`)
            db.antiraid.role_wl = rolew.id
            message.channel.send(`\`${getNow().time}\` 🎭 You changed the whitelist role to  \`${rolew.id}\``)
            update(message, db)
            }
        });
    });


    //anti spam
} else if(r.emoji.name === '📣') {
    if(db.antiraid.antispam === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
    db.antiraid.antispam = true
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti spam module`)


} else if(r.emoji.name === '📢') {
if(db.antiraid.antispam === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
db.antiraid.antispam = false
update(message, db)
message.channel.send(`\`${getNow().time}\` ❌ You have deactivated the anti spam module`)



  //anti raid
} else if(r.emoji.name === '💵') {
    if(db.antiraid.antiraid === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
    db.antiraid.antiraid = true
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti-raid module`)


} else if(r.emoji.name === '💷') {
if(db.antiraid.antiraid === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
db.antiraid.antiraid = false
update(message, db)
message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti raid module`)

}
});
await m.react("📗")
await m.react("📕")
await m.react("✔️")
await m.react("✖️")
await m.react("🎭")
await m.react("📣")
await m.react("📢")
await m.react("💵")
await m.react("💷")
});
return;
})

    }else
    if(message.author.id === message.guild.owner.id){
        fs.readFile(`./Data/${message.guild.id}.json`, async (err, data) => {
            if (err) return  message.channel.send(":x: **Please execute the `rs` command to setup the anti raid mode**");
    let db_guild = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
    let db = JSON.parse(fs.readFileSync(`./Data/${message.guild.id}.json`, "utf8"));
filter = (reaction, user) => ['📗','📕','✔️', '✖️','🎭','📣','📢','💷','💵'].includes(reaction.emoji.name) && user.id === message.author.id,
   dureefiltrer = response => { return response.author.id === message.author.id };

   const msgembed = new MessageEmbed()
   .setAuthor(`🦖 Modification of the Anti-Webhook settings of ${message.guild.name}`)
   .setColor(db_guild.color)
   .setFooter(`Kodb`)
   .setDescription(" `📗` Enable the Anti-Webhook module \n `📕` Desable the Anti-Webhook module \n\n `✔️`Enable the Anti-Bot module \n `✖️` Desable the Anti-Bot module \n\n `🎭`Configure the whitelist role\n\n `📣` Enable the Anti-Spam and Anti-Invites module \n `📢` Desable the Anti-Spam and Anti-Invites module \n\n `💵`  Enable the Anti-Raid module\n `💷` Desable the Anti-Raid module")
   message.channel.send(msgembed)


    .then(async m => { 
const collector = m.createReactionCollector(filter, { time: 900000 });
collector.on('collect', async r => { 


    //anti webhook
if(r.emoji.name === '📗') {
        if(db.antiraid.antiwebhook === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
        db.antiraid.antiwebhook = true
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti webhook module`)
    } else if(r.emoji.name === '📕') {
            if(db.antiraid.antiwebhook === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
            db.antiraid.antiwebhook = false
            update(message, db)
            message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti webhook module`)


//anti bot 
} else if(r.emoji.name === '✔️') {
        if(db.antiraid.antibot === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
        db.antiraid.antibot = true
        update(message, db)
        message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti bot module`)


} else if(r.emoji.name === '✖️') {
    if(db.antiraid.antibot === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
    db.antiraid.antibot = false
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti bot module`)


    //role qui sera whitelist
} else if(r.emoji.name === '🎭') {
    message.channel.send(`\`${getNow().time}\` 🎭 Please enter the role id. (or write \`None\` to disable it)`).then(mp => {
        mp.channel.awaitMessages(dureefiltrer, { max: 1, time: 30000, errors: ['time'] })
        .then(cld => {
            var msg = cld.first();
            if(msg.content === "None") {
                db.antiraid.role_wl = false
                message.channel.send(`\`${getNow().time}\` 🎭 You have deactivated the whitelist role, only you could bypass the anti-virus`)
                update(message, db)
            } else {
            var rolew = message.guild.roles.cache.get(msg.content)
            if(!rolew)  return  message.channel.send(`\`${getNow().time}\` 🎭 Incorrect role.`)
            db.antiraid.role_wl = rolew.id
            message.channel.send(`\`${getNow().time}\` 🎭 You changed the whitelist role to  \`${rolew.id}\``)
            update(message, db)
            }
        });
    });


    //anti spam
} else if(r.emoji.name === '📣') {
    if(db.antiraid.antispam === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
    db.antiraid.antispam = true
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti spam module`)


} else if(r.emoji.name === '📢') {
if(db.antiraid.antispam === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
db.antiraid.antispam = false
update(message, db)
message.channel.send(`\`${getNow().time}\` ❌ You have deactivated the anti spam module`)



  //anti raid
} else if(r.emoji.name === '💵') {
    if(db.antiraid.antiraid === true) { return message.channel.send(`\`${getNow().time}\` ✅ The module is already activated.`); }
    db.antiraid.antiraid = true
    update(message, db)
    message.channel.send(`\`${getNow().time}\` ✅ You have activated the anti-raid module`)


} else if(r.emoji.name === '💷') {
if(db.antiraid.antiraid === false) return message.channel.send(`\`${getNow().time}\` ❌ The module is already deactivated.`);
db.antiraid.antiraid = false
update(message, db)
message.channel.send(`\`${getNow().time}\` ❌ You have disabled the anti raid module`)

}
});
await m.react("📗")
await m.react("📕")
await m.react("✔️")
await m.react("✖️")
await m.react("🎭")
await m.react("📣")
await m.react("📢")
await m.react("💵")
await m.react("💷")
});
return;
})
}else return message.channel.send(":x: **Commande uniquement utilisable par l'owner du serveur**");
}

module.exports.help = {
    name: "configar",
    aliases: ['configantiraid','craid',],
    category: 'Anti Raid',
    description: "Pour config l'antiraid kodb",
  };

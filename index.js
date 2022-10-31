// --  Formule pour déclarer les variables
const
      config = require("./config.json"),
      { readdirSync } = require("fs"),
      { Client, Collection, MessageEmbed} = require("discord.js"),
      client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] }),
      figlet = require('figlet'),
      colors = require('colors'),
      fs = require('fs'),
      readline = require('readline'),
      talkedRecently = new Set();
client.commands = new Collection()

client.login(config.login.token)
console.clear()
console.log(` Bienvenue sur la version `.white + `${config.bot.version}`.green + ` du ` + `Kodb Bot`.blue + `                       
                                   ___________________________________________________`.red)

const loadEvents = (dir = "./modules/") => {
  readdirSync(dir).forEach(dirs => {
  const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
                                  
  for (const event of events) {
  const evt = require(`${dir}/${dirs}/${event}`);
  const evtName = event.split(".")[0];
  client.on(evtName, evt.bind(null, client));
  console.log(`[EVENTS]`.red + ` Chargement de l'évènement >`.white + ` ${evtName}.js`.red);
  };
});
};
loadEvents()

const loadCommands = (dir = "./commandes/") => {
  readdirSync(dir).forEach(dirs => {
  const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
      
  for (const file of commands) {
  const getFileName = require(`${dir}/${dirs}/${file}`);
  client.commands.set(getFileName.help.name, getFileName);
  console.log(`[COMMANDS]`.red + ` Chargement de la commande >`.white + ` ${getFileName.help.name}.js`.red);
  };
});
};
loadCommands()

client.on("ready", function(){
  setInterval(() => {
    client.user.setPresence({ activity: { name: `${client.guilds.cache.size} Serveurs | ${client.guilds.memberCount} Utilisateurs`, type: 1, url: "https://www.twitch.tv/ogagal"}})
    setTimeout(() => {
      client.user.setPresence({ activity: { name: `.help`, type: "COMPETING"}})
    }, 10000);
  }, 20000);
})




client.on("message", message=>{
  if(message.author.bot)return;
  if(!message.guild)return;
  if(message.content === `.invite`){
  embed.setTitle(`Thank for Asking ! `)
  .setDescription(`[Add me Here!](${invite})`)
  .setFooter("Cordially kodb Team")
  message.channel.send(embed)
  console.log(`[ Commande Invite ]`.green , " => ", `User: ${message.author.username}`.cyan, " => ", `Guild: ${message.guild}`.cyan)
  }
})



/*

client.on("guildCreate", guild=>{
  var embed4 = new MessageEmbed()
  .setColor("GREEN")
  .setTitle(`New Server ${guild.name}`)
  .setDescription(`Creator: ${guild.owner.user.tag}\n\nMembers: ${guild.members.cache.size}`)
 let g = client.guilds.cache.get("935171494433128528")
  g.channels.cache.get("935171494433128528").send(embed4)
})

client.on("guildDelete", guild=>{
  var embed4 = new MessageEmbed()
  .setColor("RED")
  .setTitle(`GoodBye Server ${guild.name}`)
  .setDescription(`Members: ${guild.members.cache.size}`)
  let g = client.guilds.cache.get("935171494433128528")
  g.channels.cache.get("935171494433128528").send(embed4)
})
*/



//ANTIRAID




//anti webhook
let bot = client;
bot.on("webhookUpdate", function(webhook) {
  fs.readFile(`./Data/${webhook.guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${webhook.guild.id}.json`, "utf8"));
  let guild = webhook.guild;
  let userid = webhook.id;
  if (db.antiraid.antiwebhook === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "WEBHOOK_CREATE"}); // Fetching the audot logs.

      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()

          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
            if (member.user.bot) {
              member
                .kick("ANTIRAID")
                .catch(error =>
                  console.log(
                    "[",
                    "ERROR".red,
                    "]",
                    "une erreur est survenue que je ne peux régler".green
                  )
                );
              return;
              }
            let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé de "creer ou supprimer un webhook lors du mode raid"`
              )
              .setColor("RANDOM");
            member.roles.cache.forEach(r => {
              member.roles
                .remove(r)
                .catch(error =>
                  console.log(
                    "[",
                    "ERROR".red,
                    "]",
                    "une erreur est survenue que je ne peux régler".green
                  )
                );
      });
      guild.owner.send(embedz).catch(error =>
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      );
    }else return;
    });
  }
});
})




//anti lien et anti spam



client.on("message", message => {
  if(!message.guild)return;
  fs.readFile(`./Data/${message.guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${message.guild.id}.json`, "utf8"));
    if (db.antiraid.antispam === true){
      if(message.member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
  if (message.content.includes("discord.gg")) {
    if (message.author.id === message.guild.owner.id) return;
    if (message.author.id === client.user.id) return;
    if (message.author.bot) return;
    message
      .delete()
      .catch(error =>
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      );
    message.channel
      .send(
        ":warning: **Oula attention vous n'avez pas les permissions de poster un lien sur ce serveur**"
      )
      .catch(error =>
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      )
      .then(m =>
        setTimeout(() => {
          m.delete().catch(error =>
            console.log(
              "[",
              "ERROR".red,
              "]",
              "une erreur est survenue que je ne peux régler".green
            )
          );
        }, 5000)
      );
    message
      .delete()
      .catch(error =>
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      );
    return;
  }
  let g = message.guild;
  if (!g) return;
  if (message.author.id === message.guild.owner.id) return;
  if (message.author.bot) return;
  if (talkedRecently.has(message.author.id)) {
    message.channel
      .send(
        ":warning: **Oula attention!!! Vous envoyez des messages trop rapidement.**"
      )
      .then(m =>
        setTimeout(() => {
          m.delete();
        }, 1000)
      );
    message
      .delete()
      .catch(error =>
        console.log(
          "[",
          "ERROR".red,
          "]",
          "une erreur est survenue que je ne peux régler".green
        )
      );
    return;
  }

  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 900);
}else return;
})
});




//anti bot

bot.on("guildMemberAdd", thebot=> {
  if(!thebot.user.bot)return;
  fs.readFile(`./Data/${thebot.guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${thebot.guild.id}.json`, "utf8"));
  let guild = thebot.guild;
  let userid = thebot.id;
  if (db.antiraid.antibot === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "BOT_ADD"}); // Fetching the audot logs.

      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;

              thebot
                .kick("ANTIRAID")
                .catch(error =>
                  console.log(
                    "[",
                    "ERROR".red,
                    "]",
                    "une erreur est survenue que je ne peux régler".green
                  )
                );
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "d'ajouter le bot ${thebot.user.username} lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})





//anti raid partie anti channel

bot.on("channelCreate", function(channel) {
  let guild = channel.guild;
  if(!guild)return;
  fs.readFile(`./Data/${channel.guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${channel.guild.id}.json`, "utf8"));
  if (db.antiraid.antiraid === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE"}); // Fetching the audot logs.
      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
              channel
                .delete("ANTIRAID")
                .catch(error =>
                  console.log(
                    "[",
                    "ERROR".red,
                    "]",
                    "une erreur est survenue que je ne peux régler".green
                  )
                );
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "de creer le channel lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})




bot.on('channelDelete', function(channel) {
  let guild = channel.guild;
  fs.readFile(`./Data/${guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${guild.id}.json`, "utf8"));
  if (db.antiraid.antiraid === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE"}); // Fetching the audot logs.
      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "de supprimer un channel lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})




//anti raid partie anti role

bot.on("roleCreate", function(role) {
  let guild = role.guild;
  fs.readFile(`./Data/${guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${guild.id}.json`, "utf8"));
  if (db.antiraid.antiraid === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "ROLE_CREATE"}); // Fetching the audot logs.
      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
              role
                .delete()
                .catch(error =>
                  console.log(
                    "[",
                    "ERROR".red,
                    "]",
                    "une erreur est survenue que je ne peux régler".green
                  )
                );
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "de creer un role lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})



bot.on("roleDelete", function(role) {
  let guild = role.guild;
  fs.readFile(`./Data/${guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${guild.id}.json`, "utf8"));
  if (db.antiraid.antiraid === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE"}); // Fetching the audot logs.
      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "de supprimer un role lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})



//anti raid partie anti ban



bot.on("guildBanAdd", function(guild) {
  fs.readFile(`./Data/${guild.id}.json`, async (err, data) => {
    if (err) return;
    let db = JSON.parse(fs.readFileSync(`./Data/${guild.id}.json`, "utf8"));
  if (db.antiraid.antiraid === true) {
      // find the log entry for this specific channel
    const AuditLogFetch = await guild.fetchAuditLogs({limit: 1, type: "MEMBER_BAN_ADD"}); // Fetching the audot logs.
      const deletionLog = AuditLogFetch.entries.first();
      const { executor, user } = deletionLog;
      const Entry = AuditLogFetch.entries.first()
          var autor = Entry.executor;
          if(autor.id === client.user.id)return;
          if (guild.owner.id === autor.id) return;
          guild.members.cache.forEach(member => {
            if(autor.id === member.id){
              if(member.roles.cache.find(role => role.id === db.antiraid.role_wl)) return;
                member.roles.cache.forEach(r => {
                  member.roles
                    .remove(r)
                    .catch(error =>
                      console.log(
                        "[",
                        "ERROR".red,
                        "]",
                        "une erreur est survenue que je ne peux régler".green
                      )
                    )});
              let embedz = new MessageEmbed()
              .setTitle(`Salut ${guild.owner.user.username}`)
              .addField("Quelque chose cloche ce serveur ", `${guild.name}`)
              .addField(
                `\nL'Utilisateur: ${member.user.username}`,
                `\nA essayé "de ban un membre lors du mode raid"`
              )
              .setColor("RANDOM");
              guild.owner.send(embedz).catch(error =>
                console.log(
                  "[",
                  "ERROR".red,
                  "]",
                  "une erreur est survenue que je ne peux régler".green
                )
              );
    }else return;
    });
  }
});
})







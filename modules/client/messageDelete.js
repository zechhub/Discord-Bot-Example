var getNow = () => { return {time: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}},
fs = require("fs");


module.exports = async (client, message) => {
    fs.readFile(`./serveur/${message.guild.id}.json`, async (err, data) => {
        if (err) return;
    if(!message.guild) return;
    let db = JSON.parse(fs.readFileSync(`./serveur/${message.guild.id}.json`, "utf8"));
    if(!db) return;
    if(db.logs.message === false) return;
    str_chan = message.guild.channels.cache.find(c => c.id === db.logs.message)
    if(!str_chan) return;

    if(!message.author) return;
    if(message.author.bot) return;
    // --
    var fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
    }),
    deletionLog = fetchedLogs.entries.first();
    if(!deletionLog) return str_chan.send({embed:{ description: ` **${message.author.username}**#${message.author.discriminator} (\`${message.author.id}\`) have delete a message in [\`${message.channel.name}\`](https://discord.com/channels/${message.guild.id}/${message.channel.id}) \n  \`\`\`${message.content}\`\`\``, color: 3553599, author: { name: "❌ Deletation" }, footer: { text: `🕙 ${getNow().time}` } }}) 
    const { executor, target } = deletionLog;    
    if (target.id === message.author.id) {
    str_chan.send({embed:{ description: ` **${executor.username}**#${executor.discriminator} (\`${executor.id}\`) have delete the message of **${message.author.username}**#${message.author.discriminator} (\`${message.author.id}\`) in the channel [\`${message.channel.name}\`](https://discord.com/channels/${message.guild.id}/${message.channel.id}) \n \`\`\`${message.content}\`\`\``, color: 3553599, author: { name: "❌ Deletation" }, footer: { text: `🕙 ${getNow().time}` } }}) 
    } else { 
    str_chan.send({embed:{ description: ` **${message.author.username}**#${message.author.discriminator} (\`${message.author.id}\`) have delete his message in [\`${message.channel.name}\`](https://discord.com/channels/${message.guild.id}/${message.channel.id}) \n  \`\`\`${message.content}\`\`\``, color: 3553599, author: { name: "❌ Deletation" }, footer: { text: `🕙 ${getNow().time}` } }}) 
    }
});
    };
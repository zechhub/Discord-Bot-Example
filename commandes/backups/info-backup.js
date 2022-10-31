const Discord = require('discord.js');
const backup = require('discord-backup');

exports.run = async (client, message, args) => {

    const backupID = args.join(' ');

    if (!backupID)
        return message.channel.send(':x: **Please enter your backup ID**! \n\n```info-backup "ID"```');

    backup.fetch(backupID).then((backup) => {

        const date = new Date(backup.data.createdTimestamp);
        const yyyy = date.getFullYear().toString(), mm = (date.getMonth()+1).toString(), dd = date.getDate().toString();
        const formattedDate = `${yyyy}/${(mm[1]?mm:"0"+mm[0])}/${(dd[1]?dd:"0"+dd[0])}`;

        const embed = new Discord.MessageEmbed()
            .setAuthor('🐦 Backup Info', backup.data.iconURL)
            .addField('**Name:**', backup.data.name)
            .addField('**Size:**', backup.size + ' kb')
            .addField('**Created the:**', formattedDate)
            .setFooter('**Backup ID:**', backup.id);

        return message.channel.send(embed);

    }).catch((err) => {

        if (err === 'No backup found')
            return message.channel.send(':x: **No Backup matches this ID** '+backupID+'!');
        else
            return message.channel.send(':x: **An error has occurred** : '+(typeof err === 'string') ? err : JSON.stringify(err));

    });

};

module.exports.help = {
    name: "backup-info",
    aliases: ['i-backup','info-backup',],
    category: 'Backup',
    description: "Pour voir ce que contient une backup avec kodb",
  };
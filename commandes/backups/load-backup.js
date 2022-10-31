const backup = require('discord-backup');
const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed();
const fs = require("fs");



exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(':x: **You must have administrator permissions to load a backup**.');
    }

    const backupID = args.join(' ');

    backup.fetch(backupID).then(() => {
        embed.setTitle("<a:AS0006254_00:865018532542283797> Are you sure?")
        .setColor("RED")
        .addField(":warning: **All channel and roles will be deleted are you sure?**", "Send `-yes` ou `no`!")
        .setTimestamp()
        .setFooter("kodb")
        message.channel.send(embed);

        const collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id && ['-yes', 'no'].includes(m.content), {
            time: 60000,
            max: 1
        });
        collector.on('collect', (m) => {
            const confirm = m.content === '-yes';
            collector.stop();
            if (confirm) {

                backup.load(backupID, message.guild).then(() => {

                    return message.author.send('🦖 Backup Loaded !');
            
                }).catch((err) => {
            
                    if (err === 'No backup found')
                        return message.channel.send(':x: **No backup found with the ID ** '+backupID+'!');
                    else
                        return message.author.send(':x: An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err));
            
                });

            } else {
                return message.channel.send(':x: **Operation canceled**.');
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time')
                return message.channel.send(':x: **End of order!**');
        })

    }).catch(() => {
        return message.channel.send(':x: **No backup found with the ID ** '+backupID+'!');
    });

};

module.exports.help = {
    name: "backup-load",
    aliases: ['l-backup','load-backup',],
    category: 'Backup',
    description: "Pour load une backup avec kodb",
  };
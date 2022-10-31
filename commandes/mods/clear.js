const { MessageEmbed } = require("discord.js"), 
fs = require("fs");

module.exports.run = async (client, message, args) => { 
    if(!message.guild) return;
    let input = args;
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      return message.channel
        .send(
          "You don't have permission:\n `manage_messages`",
        );
    }

    if (isNaN(input)) {
      return message.channel
        .send(':x: **Invalid number**')
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    }

    if (Number(input) < 0) {
      return message.channel
        .send(':x: **Invalid number**')
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    }
    if (Number(input) > 99) {
        return message.channel
          .send(':x: **Invalid number**')
          .then((sent) => {
            setTimeout(() => {
              sent.delete();
            }, 2500);
          });
      }

    // add an extra to delete the current message too
    const amount = Number(input) > 100
      ? 101
      : Number(input) + 1;

    message.channel.bulkDelete(amount, true)
    .then((_message) => {
      message.channel
        // do you want to include the current message here?
        // if not it should be ${_message.size - 1}
        .send(`Bot cleared \`${_message.size}\` messages :broom:`)
        .then((sent) => {
          setTimeout(() => {
            sent.delete();
          }, 2500);
        });
    });
}

module.exports.help = {
name: "clear",
aliases: ['c'],
category: 'moderation',
description: "clear les messages",
 };

const { PermissionsBitField } = require("discord.js");

module.exports = {
    conf: {
        name: "kick",
        description: "Kick a user from the server.",
        usage: "<prefix>kick <@user> [reason]",
        aliases: [],
        dir: "moderation",
    },
    run: (client, message, args) => {
        /* Check for kick permissions */
        const kickPermission = PermissionsBitField.Flags.KickMembers;
        if (!message.guild.members.cache.get(message.author.id)
                                       .permissions.has(kickPermission)) {
            return message.reply(`${client.emotes.x} You're missing permissions`);
        }
        if (!message.guild.members.me.permissions.has(kickPermission)) {
            return message.channel.send(`${client.emotes.x} I'm missing permissions`);
        }

        const user = message.mentions.users.first();
        if (!user) {
            return message.reply(`${client.emotes.x} I can't find this user.\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }
        if (user.id === message.author.id) {
            return message.reply(`${client.emotes.x} You can't kick yourself.\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }
        if (user.id === client.user.id) {
            return message.reply(`${client.emotes.x} You can't kick me :)\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }

        const reason = args.slice(1).join(' ') || "No reason";
        message.guild.members.kick(user, { reason: reason }).then(member => { // kick
            const avatarFormat
            = member.avatar && member.avatar.startsWith("a_") ? "gif" : "png";

            message.react(client.emotes.v);
            client.channels.cache.get(client.config.channels.modlogs).send({embeds: [{
                color: client.color.messagecolor.red,
                author: {
                    name: `Kick › ${member.username}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.${avatarFormat}?size=512`
                },
                fields: [
                    { name: "User", value: `<@${member.id}>`, inline: true },
                    { name: "Moderator", value: `<@${message.author.id}>`, inline: true },
                    { name: "Reason", value: reason }
                ],
                footer: { text: `ID : ${message.author.id}` },
                timestamp: new Date()
            }]});

            setTimeout(() => {
                message.delete();
            }, 1500);
        });
    }
}
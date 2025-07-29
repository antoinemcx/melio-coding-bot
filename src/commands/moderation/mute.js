const { PermissionsBitField } = require("discord.js");

module.exports = {
    conf:{
        name: "mute",
        description: `Mute a non-moderator member`,
        usage: "<prefix>mute <@user> [reason]",
        aliases: ["timeout", "silence"],
        dir: "moderation",
    },
    run: (client, message, args) => {
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply(`${client.emotes.x} I can't find this user.\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }

        const reason = args.slice(1).join(" ") || "No reason";
        const guildMember = message.guild.members.cache.get(user.id);
        const authorPermissions
        = message.guild.members.cache.get(message.author.id).permissions;

        /* Check for mute permissions */
        if(!authorPermissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.reply(`${client.emotes.x} You're missing permissions.`);
        }
        if (user.id === message.author.id) {
            return message.reply(`${client.emotes.x} You can't mute yourself.\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }
        if (guildMember.roles.highest.position >= message.member.roles.highest.position
            && message.author.id !== message.guild.ownerID) {
            return message.reply(`${client.emotes.x} You can't mute a member `
                                 + "with a higher role than you.");
        }
        if (guildMember.roles.highest.position >= message.guild.members.me.roles.highest.position
            || user.id === message.guild.ownerID) {
            return message.reply(`${client.emotes.x} I can't mute this member.`);
        }
        
        guildMember.roles.add(client.config.roles.muted); // mute member

        message.react(client.emotes.v);
        client.channels.cache.get(client.config.channels.modlogs).send({embeds: [{
            color: client.color.messagecolor.orange,
            author: {
                name: `Mute › ${guildMember.user.username}`,
                icon_url: guildMember.user.displayAvatarURL({dynamic: true})
            },
            fields: [
                { name: "User", value: `<@${user.id}>`, inline: true },
                { name: "Moderator", value: `<@${message.author.id}>`, inline: true },
                { name: "Reason", value: reason }
            ],
            footer: { text: `ID : ${message.author.id}` },
            timestamp: new Date()
        }]});

        setTimeout(() => {
            message.delete();
        }, 1500);
    }
}
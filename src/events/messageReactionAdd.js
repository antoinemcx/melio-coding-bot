const { ChannelType, PermissionsBitField } = require("discord.js");

module.exports = async (client, reaction, user) => {
    if (!user.bot && reaction.emoji.name === client.config.ticketSystem.emoji) {
        if (getUserTicketChannel(reaction, user) !== undefined) {
            reaction.users.remove(user);
            
            user.send(`${client.emotes.x} You already have a ticket, `
                      + "you can't open another one.");
        } else {
            await reaction.users.remove(user);
            await createTicketChannel(client, reaction, user);
        }
    }
}

function getUserTicketChannel(reaction, user) {
    const channels = reaction.message.guild.channels;
    return channels.cache.filter(channel => channel.name === user.id).first();
}

/**
 * Creates a ticket channel for the user who reacted with the ticket emoji.
 * The channel is set to private and accessible only by the user and the bot.
 * 
 * @param {Object} client - The Discord client instance.
 * @param {Object} reaction - The reaction object containing the message and emoji.
 * @param {Object} user - The user who reacted to the message.
 * @returns {Promise<void>} - A promise that resolves when the channel is created.
 */
async function createTicketChannel(client, reaction, user) {
    await reaction.message.guild.channels.create({
        name: user.id,
        type: ChannelType.GuildText,
    }).then(async channel => {
        channel.setParent(client.config.ticketSystem.parentCategory);
        channel.permissionOverwrites.set([
            { id: user.id, allow: [ // allow the user
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ViewChannel,
            ]},
            { // dissalow everyone else
                id: reaction.message.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            }
        ]);

        /* Creation message */
        channel.send(`<@${user.id}>`);
        channel.send({embeds: [{
            color: client.color.messagecolor.embed,
            thumbnail: { url: user.displayAvatarURL({dynamic: true}) },
            description: `Hi <@${user.id}> 👋 !\n\nYou've created a private ticket, `
                         + "the administration should arrive at any moment.\n\n"
                         + "Please indicate the exact reason for creating this ticket "
                         + "as well as the potential other persons to be added.\n\n"
                         + "If you want to close the ticket, please contact the administration.",
            footer: {
                text: `${client.user.username} ©`,
                icon_url: client.user.avatarURL(),
            },
            timestamp: new Date()
        }]});
    });
}
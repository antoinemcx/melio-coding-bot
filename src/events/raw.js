/** Discord.js event handler to support events on old messages */
module.exports = async (client, payload) => { 
    const event = payload.t;
    const messageId = payload.d.message_id;

    if (event === "MESSAGE_REACTION_ADD"
        && messageId === client.config.ticketSystem.createTicketMessage) {
        const channel = client.channels.cache.get(payload.d.channel_id);

        /*
         * Emits event if the message is not cached.
         * If the message is cached, the messageReactionAdd event is
         * already handled by the client.
         */
        if (channel
            && channel.type !== "GUILD_TEXT" // valid channel
            && !channel.messages.cache.has(messageId)) {
            try {
                const message = await channel.messages.fetch(messageId);
                const reaction = message.reactions.cache.get(
                    client.config.ticketSystem.emoji);
                const user = client.users.cache.get(payload.d.user_id);

                client.emit('messageReactionAdd', reaction, user);
            } catch (error) {
                console.log(error);
            }
        }
    }
}
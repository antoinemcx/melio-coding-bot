module.exports = {
    conf: {
        name: "ping",
        description: "Pong !",
        usage: "<prefix>ping",
        aliases: [],
        dir: "zbot"
    },
    run: async (client, message, args) => {
        const msg = await message.reply(`Calculation in progress...`);
        msg.delete();

        const ping = msg.createdTimestamp - message.createdTimestamp;
        message.reply(`\\💓 My heart beats at \`${ping}ms\` and the API at \`${client.ws.ping} ms\``);
    }
}
const process = require("child_process");

module.exports = {
    conf: {
        name: "shell",
        description: "Allows the bot developer to execute commands in the bot's server shell",
        usage: "<prefix>shell <exec>",
        aliases: [],
        dir: "zbot",
        cooldown: 3,
        private: true
    },
    run: async (client, message, args) => {
        if(!args[0]) {
            return message.reply(`${client.emotes.x} Wrong usage`
                                 + `\n> Usage : \`${module.exports.conf.usage}\``);
        }

        const msg = await message.channel.send(`In process...`);

        process.exec(args.join(" "), (error, stdout) => {
            const result = (stdout || error);

            message.reply(
                `\`\`\`${result}\`\`\``,
                { code: "asciidoc", split: '\n' }
            ).catch(err => message.reply({embeds: [{
                title: "An error was found.",
                color: "RED",
                description: `${err}`
            }]}));
        })
        await msg.delete();
    }
}
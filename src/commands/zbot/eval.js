const util = require("util");

module.exports = {
    conf: {
        name: "eval",
        description: "Evaluates JavaScript code on the bot environment.",
        usage: "<prefix>eval <code>",
        aliases: ["e"],
        dir: "zbot",
        private: true
    },
    run: async (client, message, args) => {
        const code = args.join(" ");

        try {
            const ev = eval(code);
            let returnCode = util.inspect(ev, { depth: 1 });

            returnCode = returnCode.replace( // remove client token from output
                new RegExp(`${client.token}`, "g"),
                "nop?"
            );
            if (returnCode.length > 1900) { // truncate output if too long
                returnCode = returnCode.substr(0, 1900);
                returnCode = returnCode + "...";
            }

            message.react(client.emotes.v);
            message.reply({embeds: [{
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({dynamic: true})
                },
                color: client.color.messagecolor.embed,
                description: `**${client.emotes.v} Eval successful :**\n`
                             + `\`\`\`JS\n${returnCode}\`\`\``,
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    icon_url: client.user.avatarURL()
                }
            }]});
        } catch (err) {
            message.react(client.emotes.x);
            message.reply({embeds: [{
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({dynamic: true})
                },
                color: client.color.messagecolor.red,
                description: `**${client.emotes.x} Eval fail :**\n\`\`\`JS\n${err}\`\`\``,
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    icon_url: client.user.avatarURL()
                }
            }]});
        }
    }
}
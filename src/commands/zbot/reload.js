module.exports = {
    conf: {
        name: "reload",
        description: "Reloads a command file.",
        usage: "<prefix>reload <cmd>",
        aliases: ["r"],
        dir: "zbot",
        private: true
    },
    run: (client, message, args) => {
        if (!args[0]) {
            return message.reply(`${client.emotes.x} Wrong usage\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }

        const command = getCommand(client, args[0].toLowerCase());
        if (!command) {
            const cmdName = args[0].toUpperCase();
            return message.reply(`${client.emotes.x} I didn't find the \`${cmdName}\` command`);
        }

        const dir = command.conf.dir;
        delete require.cache[ // clear command from cache
            require.resolve(`../../commands/${dir}/${command.conf.name}`)
        ];
        const props = require(`../../commands/${dir}/${command.conf.name}`);

        client.commands.delete(args[0]); // update commands collection
        client.commands.set(props.conf.name, props);
        if (props.conf.aliases) {
            props.conf.aliases.forEach(alias => {
                client.aliases.set(alias, props.conf.name);
            });
        }
        message.react(client.emotes.v); // success reaction
    }
}

function getCommand(client, commandName) {
    if (client.commands.has(commandName)) {
        return client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
        return client.commands.get(client.aliases.get(commandName));
    }
    return null;
}
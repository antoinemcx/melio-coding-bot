module.exports = {
    conf: {
        name: "help",
        description: "Send help page & help command.",
        usage: "<prefix>help [commandName]",
        aliases: ["h", "halp", "commands"],
        dir: "zbot"
    },
    run: async (client, message, args) => {
        const categories = {
            dev: `\\💻 Development`,
            general: `\\🧰 General`,
            zbot: `\\🤖 ${client.user.username}`,
            mod: `\\🔨 Moderation`,
        };

        if(!args[0]) {
            /* Get all commands categories */
            let categorie = [];
            await client.commandes.forEach(async (cmd) => {
                if (!categorie.includes(cmd.conf.dir)) {
                    categorie.push(cmd.conf.dir);
                }
            });

            message.reply({embeds: [{
                color: client.color.messagecolor.embed,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({dynamic: true})
                },
                thumbnail: { url: client.user.avatarURL({size: 1024}) },
                description: `To get more information, type \`${client.config.prefix}help <commandName>\`.`
                             + "\n\n[`🎈 Website`](https://antoinemcx.fr) "
                             + "• [`🐲 Méliodas`](https://discordapp.com/oauth2/authorize?client_id=562571094947659783&permissions=8&scope=bot) "
                             + "• [`🎵 Naybor`](https://discordapp.com/oauth2/authorize?client_id=793213992910585898&permissions=8&scope=bot) "
                             + "• [`🤖 StellarBotList`](https://stellarbotlist.com)\nᅠ",
                fields: categorie.sort().map(c => {
                    /* Display commands in each category */
                    let commands = message.author.id === client.config.owner
                        ? client.commandes.filter((command) => command.conf.dir === c)
                        : client.commandes.filter((command) => command.conf.dir === c
                                                               && command.conf.private !== true);
                    return {
                        name: `${categories[c]} (${commands.size})`,
                        value: commands.map((command) => `\`${command.conf.name}\``).join(', '),
                    };
                }),
                footer: { text: `${client.user.username} ©` },
                timestamp: new Date()
            }]});
        /* Command name provided, look for the command help details */
        } else {
            let command = args[0];
            if (client.commandes.has(command)) {
                command = client.commandes.get(command);
            } else if(client.aliases.has(command)){
                command = client.commandes.get(client.aliases.get(command));
            }
            if(!command.conf) {
                return message.reply(`${client.emotes.x} I didn't find this command`
                                     + `\n> Usage : \`${module.exports.conf.usage}\``);
            }
            let re = /<prefix>/gi;

            message.reply({
                embeds: [{
                    color: client.color.messagecolor.embed,
                    author: {
                        name: `Advanced help - ${command.conf.name}`,
                        icon_url: message.author.displayAvatarURL({dynamic: true})
                    },
                    thumbnail: { url: client.user.avatarURL({size: 1024}) },
                    description: `**↬** Prefix : \`${client.config.prefix}\`\n`
                                 + "**↬** [] = `optional` / <> = `required`\n"
                                 + `**»** \`${command.conf.description}\`\nᅠ`,
                    fields: [{
                            name: `Category`,
                            value: categories[command.conf.dir]
                                ? categories[command.conf.dir] : command.conf.dir,
                            inline: true
                        },
                        {
                            name: `Cooldown`,
                            value: command.conf.cooldown
                                ? `\`${command.conf.cooldown} sec\`` : `\`2 secs\``,
                            inline: true
                        },
                        {
                            name: "Aliases",
                            value: getCommandAliases(command, client.config.prefix)
                                .map(a => `\`${a}\``).join(", "),
                            inline: true
                        },
                        {
                            name: "Usage",
                            value: `\`${command.conf.usage.replace(re, client.config.prefix)}\``
                        },
                    ],
                    footer: {
                        icon_url: client.user.avatarURL(),
                        text: `${client.user.username} ©`
                    },
                    timestamp: new Date()
                }]
            }).catch(e => {
                client.emit("error", e, message);
            });
        }
    }
}

function getCommandAliases(command, prefix) {
    let aliasesToSend = [];
    if(command.conf.aliases.length === 0) { // look for aliases
        aliasesToSend.push('No aliases');
    } else {
        for(let i = 0; i < command.conf.aliases.length; i++){
            let aliases = `<prefix>${command.conf.aliases[i]}`;
            aliasesToSend.push(aliases.replace(re, prefix));
        }
    }
    return aliasesToSend;
}
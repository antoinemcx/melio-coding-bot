module.exports = {
    conf: {
        name: "npm",
        description: "Allows developers to do searches related to an NPM Package (so on npmjs.com)",
        usage: "<prefix>npm <search>",
        aliases: [],
        dir: "dev",
        cooldown: 3
    },
    run: async (client, message, args) => {
        if(!args[0]) {
            return message.reply(`${client.emotes.x} Wrong usage\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }

        let res;
        try {
            res = await fetch(`https://api.npms.io/v2/search?q=${args[0]}`)
                  .then(res => res.json());
        } catch (e) {
            return message.reply(`${client.emotes.x} An error has occured.`);
        }
        if (!res || !res.results || res.results.length === 0) {
            return message.reply(`${client.emotes.x} I didn't find this package.`
                                    + `\n> Usage : \`${module.exports.conf.usage}\``);
        }

        const package = res.results[0].package;

        message.reply({embeds: [{
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({dynamic: true})
            },
            title: package.name,
            url: package.links.npm,
            color: client.color.messagecolor.embed,
            thumbnail: { url: "https://yohannvalentin.com/logos/npm.png" },
            description: `» \`${package.description}\`\n\n`
                + `\\👑 Author : \`${package.author ? package.author.name : "None"}\`\n`
                + `\\🔑 Version : \`${package.version}\`\n`
                + `\n\\🤝 Maintainers : \`${package.maintainers
                    ? package.maintainers.map(e => e.username).join(", ") : "None"}\`\n`
                + `\\📣 Keywords : \`${package.keywords
                    ? package.keywords.join(", ") : "None"}\`\n`
                + `\n\\🔗 [\`NPM\`](${package.links.npm})`
                + (package.links.repository
                    ? ` • [\`Repository\`](${package.links.repository})` : '')
                + (package.links.bugs ? ` • [\`Bugs\`](${package.links.bugs})` : ''),
            timestamp: new Date(),
            footer: { text: client.user.username, icon_url: client.user.avatarURL() },
        }]});
    }
}
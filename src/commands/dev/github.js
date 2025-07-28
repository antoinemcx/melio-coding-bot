module.exports = {
    conf: {
        name: "github",
        description: "Allows you to do searches related to github.com from a user",
        usage: "<prefix>github <userName>",
        aliases: ["gh"],
        dir: "dev",
        cooldown: 3
    },
    run: async (client, message, args) => {
        const name = args.join(' ');
        if(!name) {
            return message.reply(`${client.emotes.x} Wrong usage\n`
                                 + `> Usage : \`${module.exports.conf.usage}\``);
        }
        const url = `https://api.github.com/users/${name}`;

        let res;
        try {
            res = await fetch(url).then(res => res.json());
        } catch (e) {
            return message.reply(`${client.emotes.x} An error has occured`);
        }
        if(res.followers === undefined) {
            return message.reply(
                `${client.emotes.x} I was unable to find this user on GitHub`);
        }

        const createdAt = res.created_at
            ? new Date(res.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
            : "Unknown";

        message.reply({embeds: [{
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({dynamic: true})
            },
            color: client.color.messagecolor.embed,
            thumbnail: { url: res.avatar_url },
            description: `» \`${res.bio ? res.bio : "No Bio"}\`\n\n`
                         + `\\👑 Login : \`${res.login}\`\n`
                         + `\\🏷️ Name : \`${res.name}\`\n`
                         + `\\💼 Company : \`${res.company ? res.company : "No Company"}\`\n`
                         + `\n\\📅 Created : \`${createdAt}\`\n`
                         + `\n\\📥 Followers : \`${res.followers.toLocaleString()}\`\n`
                         + `\\🔖 Following : \`${res.following.toLocaleString()}\`\n`
                         + `\\📚 Public Repositories : \`${res.public_repos.toLocaleString()}\`\n`
                         + `\n\\📡 Location : \`${res.location ? res.location : "No Location"}\`\n`
                         + `\\📧 Email : \`${res.email ? res.email : "No Public Email"}\`\n`
                         + `\n\\🔗 [\`GitHub Profile\`](${res.html_url})`
                         + (res.blog ? ` • [\`Website\`](${res.blog})` : '')
                         + (res.twitter_username
                            ? ` • [\`Twitter\`](https://twitter.com/${res.twitter_username})` : ''),
            timestamp: new Date(),
            footer: { text:
                client.user.username,
                icon_url: client.user.avatarURL()
            },
        }]})
    }
}
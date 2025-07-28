const { getRankByUserId } = require("../../database/functions");
const { getRoleForLevel } = require("../../utils/leveling");

module.exports = {
    conf: {
        name: "leaderboard",
        description: "Get the leaderboard of the more active members",
        usage: "<prefix>leaderboard",
        aliases: ["lb"],
        dir: "general"
    },
    run: async (client, message, args) => {
        const userRanking = await getRankByUserId(client, message.author.id);
        const top_25 = await client.db.query(
            `SELECT * FROM leveling ORDER BY xp+0 DESC LIMIT 25`);

        const levelingRoles = client.config.levelingRoles;
        const userRank = getOrdinalSuffixOf(Number(userRanking[0].position) + 1);
        
        message.reply({embeds: [{
            color: client.color.messagecolor.embed,
            author: {
                name: message.author.tag,
                icon_url: message.author.displayAvatarURL({ dynamic: true })
            },
            thumbnail: { url: message.guild.iconURL() },
            timestamp: new Date(),
            description: `Your rank : \`${userRank}\`\n\n${top_25.map((user, k) =>
                `**${k+1}.** <@${user.userID}> **»** Level \`${user.level}\` `
                + (getRoleForLevel(user.level, levelingRoles)
                   ? `(<@&${getRoleForLevel(user.level, levelingRoles)[1]}>)` : '')
                + ` **›** ${user.xp} XP`
            ).join('\n')}`,
            footer: {
                text: client.user.username,
                icon_url: client.user.avatarURL()
            }
        }]});
    }
}

function getOrdinalSuffixOf(i) {
    let j = i % 10,
        k = i % 100;

    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
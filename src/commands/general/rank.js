const { createCanvas, loadImage, registerFont } = require("canvas");
const { AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { findUserById, getRankByUserId } = require("../../database/functions");
const { getLevelXP } = require("../../utils/leveling");

module.exports = {
    conf: {
        name: "rank",
        description: "View your XP progression and when will you get to your next level.",
        usage: "<prefix>rank [user]",
        aliases: ["level", "lvl", "me"],
        dir: "general"
    },
    run: async (client, message, args) => {
        let member = message.member;
        if (message.mentions.users.first() !== undefined) {
            member = message.guild.members.cache.get(message.mentions.users.first().id)
            if (!member) {
                return message.channel.send(`${client.emotes.x} I can't find this user`);
            }
        }
        if (member.user.bot) {
            return message.channel.send(
                `${client.emotes.x} The leveling system is not available for bots.`
            );
        }

        const msg = await message.reply({
            content: `Generating the rank card...`});

        /* Fetch user data */
        const userData = await findUserById(client, member.id);
        const currentXP = parseInt(userData ? userData.xp : 0);
        const currentLevel = parseInt(userData ? userData.level : 0);
        const thisLvlXP = getLevelXP(currentLevel);
        const nextLvlXP = getLevelXP(currentLevel + 1);
        const userLeaderboard = await getRankByUserId(client, member.id);

        /* Create the rank card */
        const canvas = createCanvas(1000, 275), ctx = canvas.getContext("2d");
        const barWidth = 600;
        const avatar = await loadImage(
            member.displayAvatarURL({ extension: "png", dynamic: false, size: 512 })
        );
        const background = await loadImage("https://i.imgur.com/vi9dE1Z.jpg");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        /* Circle around user's pfp */
        ctx.beginPath();
        ctx.arc(135, 137, 110, 0, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#2f3136";
        ctx.stroke();
        ctx.closePath();

        /* XP Progression Bar */
        ctx.lineJoin = "round";
        ctx.lineWidth = 45;
        ctx.strokeStyle = "#8ea0dd";
        ctx.strokeRect(300, 200, barWidth, 0); // empty bar
        ctx.strokeStyle = "#6880d5";
        ctx.strokeRect( // bar filled with XP
            300,
            200,
            (barWidth * (currentXP - thisLvlXP) / (nextLvlXP - thisLvlXP)),
            0
        );

        /* Display the current level */
        ctx.font = "bold 32px Sans";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText("Level", (810 + (currentLevel < 10 ? 28 : 0)), 152, 200);
        ctx.fillStyle = "#C4C4C4";
        ctx.fillText(currentLevel, (880 + (currentLevel < 10 ? 17 : 0)), 152, 80);

        /* Display the user rank and badges */
        ctx.font = "bold 32px Sans";
        ctx.fillStyle = "white";
        const badgeURL = getUserBadgeURL(member, client, message.guild.ownerId);
        if (badgeURL !== null) {
            const badge = await loadImage(badgeURL);
            ctx.drawImage(badge, 940, 12, 45, 45);
        }
        ctx.fillText(`#${currentXP === 0
                         ? '-' : (Number(userLeaderboard[0].position) + 1)}`,
                     ((badgeURL !== null ? 910 : 960)
                      - (currentLevel >= 10 ? 10 : 0)), 50, 200);

        /* Display the user name */
        ctx.font = "bold 35px Sans";
        ctx.textAlign = "start";
        ctx.fillText(`${member.user.username.length >= 22
                        ? `${member.user.username.substr(0,22)}...`
                        : member.user.username}`,
                     281, 152);

        /* Display the XP in the progress bar */
        ctx.font = "bold 30px Sans";
        ctx.textAlign = "center";
        const xpTextWidth = ctx.measureText(`${currentXP}/${nextLvlXP} XP`).width;
        ctx.fillText(`${currentXP}/${nextLvlXP} XP`, 990 - xpTextWidth, 210);

        /* Remove the corners */
        ctx.beginPath();
        ctx.arc(135, 137, 110, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        /* Add the avatar */
        ctx.drawImage(avatar, 10, 10, 240, 240);

        await msg.delete();
        message.reply({
            files: [new AttachmentBuilder(canvas.toBuffer(), { name: "rank.png" })]
        });
    }
}

function getUserBadgeURL(member, client, ownerId) {
    let badgeURL = null;
    
    if (member.id === ownerId) {
        badgeURL = "https://i.imgur.com/66Rwy37.png"; // server owner
    } else if (member.roles.cache.has(client.config.roles.partner)) {
        badgeURL = "https://i.imgur.com/VmOWtr3.png"; // partner
    } else if (member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        badgeURL = "https://i.imgur.com/wkBtU4N.png"; // moderator
    }
    return badgeURL;
}
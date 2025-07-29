const os = require("os");
const cpuStat = require("cpu-stat");
const { utc } = require("moment");
require("moment-duration-format");
const { version: djsversion } = require("discord.js");
const child_process = require("child_process");
const { formatBytes, parseDuration } = require("../../utils/parsing");

module.exports = {
    conf: {
        name: "botinfo",
        description: "Allows you to see informations about the bot and also the developper",
        usage: "<prefix>botinfo",
        aliases: ["bi", "bot-info"],
        dir: "zbot"
    },
    run: async (client, message, args) => {
        const msg = await message.reply(`Searching...`);

        const clientDeveloper = client.users.cache.get(client.config.owner);
        const ramUsage = formatBytes(process.memoryUsage().rss);
        const cores = os.cpus().length;
        const diskCapacity = 49; // assumed
        const clientCreationDate = utc(client.user.createdTimestamp).format('L');
        const clientRamUsage = formatBytes(process.memoryUsage().heapUsed);

        try {
            let diskStdout, memStdout;
            try {
                diskStdout = await execAsyncCommand("du -hs ~/");
            } catch (e) {
                diskStdout = null; // if not on a Unix system
            }
            try {
                memStdout = await execAsyncCommand("cat /proc/meminfo | head -n 3");
            } catch (e) {
                memStdout = null; // if not on a Unix system
            }

            const cpuPercent = await getCpuUsage();
            const diskUsage = diskStdout ? diskStdout.split(`G`)[0] : null;
            const memory = memStdout ? memStdout.split("\n") : [];
            const totalMemory = memory.length > 0
                ? (memory[0].split(':')[1].replace(/ /g, '').replace("kB", '') * 0.000001)
                : null;
            const usedMemory = totalMemory && memory.length > 2
                ? totalMemory - (memory[2].split(':')[1].replace(/ /g, '')
                                          .replace("kB", '') * 0.000001)
                : null;
            const clientRamPercentageUsage = totalMemory
                ? (((ramUsage.split(' ')[0] * 0.001) / totalMemory) * 100).toFixed(2)
                : null;

            await msg.edit({content: '** **', embeds: [{
                color: client.color.messagecolor.embed,
                author: {
                    name: message.author.tag,
                    icon_url: message.author.displayAvatarURL({dynamic: true})
                },
                thumbnail: { url: client.user.avatarURL({size: 1024}) },
                fields: [{
                    name: `\\🤖 ${client.user.username}`,
                    value: `Developer : \`${clientDeveloper.tag ?? '-'}\`\n`
                           + `Discord.JS : \`v${djsversion}\`\n`
                           + `Node.JS : \`${process.version}\`\n\n`
                           + `Commands : \`${client.commands.size}\`\n`
                           + `Users : \`${client.users.cache.size}\`\n`
                           + `Created at : \`${clientCreationDate}\`\n`
                           + `CPU Usage : \`${cpuPercent.toFixed(2)}%\`\n`
                           + `Ram Usage : \`${ramUsage} `
                           + `(Bot: ${clientRamUsage})\` | `
                           + `\`${clientRamPercentageUsage || '?'}%\``
                },
                {
                    name: `\\🖥️ VPS`,
                    value: `Platform : \`${process.platform}\` `
                           + `| Arch : \`${os.arch()}\` | Cores : \`${cores}\`\n`
                           + `Config : \`${os.cpus().map(i => `${i.model}`)[0]}\`\n`
                           + `Disk Usage : \`${diskUsage || '?'}/${diskCapacity} GB\` | `
                           + `\`${diskUsage
                               ? ((diskUsage / diskCapacity) * 100).toFixed(1) : '?'}%\`\n`
                           + "Ram Usage : `" + (usedMemory && totalMemory
                               ? `${usedMemory.toFixed(2)}/${totalMemory.toFixed(2)} GB\``
                               : "? GB`")
                           + ` | \`${usedMemory && totalMemory
                               ? ((usedMemory / totalMemory) * 100).toFixed(1) : '?'}%\``
                           + `\n\nUptime : \`${parseDuration(client.uptime)}\``
                }],
                timestamp: new Date(),
                footer: {
                    text: client.user.username,
                    icon_url: client.user.avatarURL()
                }
            }]});
        } catch (error) {
            console.error(error);
            return msg.edit(`${client.emotes.x} An error occurred while fetching bot usage.`);
        }
    }
}

function getCpuUsage() {
    return new Promise((resolve, reject) => {
        cpuStat.usagePercent((error, percent) => {
            if (error) return reject(error);
            resolve(percent);
        });
    });
}

function execAsyncCommand(cmd) {
    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (error, stdout) => {
            if (error) return reject(error);
            resolve(stdout);
        });
    });
}
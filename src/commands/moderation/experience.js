const { PermissionsBitField } = require("discord.js");
const { getRoleForLevel, getLevel } = require("../../utils/leveling");

module.exports = {
    conf: {
        name: "experience",
        description: "Reset, add or remove XP to a user",
        usage: "<prefix>experience <\"add\"|\"remove\"|\"reset\"> <user> [amount]",
        aliases: ["xp", "exp"],
        dir: "moderation",
    },
    run: async (client, message, args) => {       
        const adminPermission = PermissionsBitField.Flags.Administrator;
        if (!message.guild.members.cache.get(message.author.id)
                                       .permissions.has(adminPermission)) {
            return message.reply(`${client.emotes.x} You're missing permissions`);
        }
    
        const command = args[0];
        const user = message.mentions.users.first();
        let returnMessage = "";

        if (!command
           || !["add", "remove", "reset"].includes(command.toLowerCase())) {
            return message.reply(`${client.emotes.x} Wrong usage`
                                 + `\n> Usage : \`${module.exports.conf.usage}\``);
        }
        if (!user) {
            return message.reply(`${client.emotes.x} I can't find this user`
                                 + `\n> Usage : \`${module.exports.conf.usage}\``);
        }
        const amount = parseInt(args.slice(2).join(' '));
        if (command !== 'reset' && isNaN(amount)) {
            return message.reply(`${client.emotes.x} The amount is not a valid number...`
                                 + `\n> Usage : \`${module.exports.conf.usage}\``);
        }

        const userData = await findOrCreateUserById(client, user.id);
        const currentXP = parseInt(userData.xp);
        const currentLevel = parseInt(userData.level);
        const levelingRoles = client.config.levelingRoles;
        let currentRole = getRoleForLevel(currentLevel, levelingRoles);

        if (command === "reset") { // remove all XP and level
            if (currentXP === 0 && currentLevel === 0) {
                return message.reply(
                    `${client.emotes.x} \`${user.username}\` has no XP to reset.`
                );
            }

            await client.db.query(`UPDATE leveling SET xp=0,level=0 WHERE userID=${user.id};`);
            if (currentRole) {
                message.guild.members.cache.get(user.id).roles.remove(currentRole[1]);
            }

            returnMessage
            = `${client.emotes.v} \`${user.username}\`'s experience has been reset.`;
        /* Add or remove XP */
        } else if (command === "add" || command === "remove") {
            const newXP = command === "add"
                ? (currentXP + amount) : (currentXP - amount);
            const newLevel = getLevel(newXP);

            if (currentLevel === newLevel) {
                await client.db.query(`UPDATE leveling
                                       SET xp=${newXP >= 0 ? newXP : 0}
                                       WHERE userID=${user.id};`);
                        
                returnMessage = `${client.emotes.v} **${amount}XP** successfully `
                                + (command === "add" ? "added to" : "removed from")
                                + ` \`${user.username}\``;
            } else { // there is a level change
                await client.db.query(`UPDATE leveling
                                       SET xp=${newXP >= 0 ? newXP : 0},level=${newLevel}
                                       WHERE userID=${user.id};`);
                            
                let nextRole = getRoleForLevel(newLevel, levelingRoles);
                let nextRoleName = null;
                if (currentRole !== null) {
                    currentRole = currentRole[1]; // role id
                }
                if (nextRole !== null) {
                    nextRoleName = nextRole[0]; // role name
                    nextRole = nextRole[1]; // role id
                }

                if (currentRole !== nextRole) { // role change
                    const member = message.guild.members.cache.get(user.id);

                    /* Update roles */
                    if (currentRole !== null) {
                        await member.roles.remove(currentRole);
                    }
                    if (nextRole !== null) {
                        await member.roles.add(nextRole);
                    }

                    returnMessage
                    = `${client.emotes.v} **${amount}XP** successfully `
                      + (command === "add" ? "added to" : "removed from")
                      + ` \`${user.username}\``
                      + `\n> This member is now level **${newLevel}** `
                      + (nextRoleName !== null ? `and is now \`${nextRoleName}\`` : '');
                } else { // no role change
                    returnMessage
                    = `${client.emotes.v} **${amount}XP** successfully `
                      + (command === "add" ? "added to" : "removed from")
                      + ` \`${user.username}\``
                      + `\n> This member is now level **${newLevel}**`;
                }
            }
        }
        message.reply(returnMessage);
    }
}
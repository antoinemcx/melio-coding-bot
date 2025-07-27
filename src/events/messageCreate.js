const { Collection } = require("discord.js");
const { findUserById } = require("../database/functions");
const { getRoleForLevel, getNextLevelXP, getRolesLevels } = require("../utils/leveling");

module.exports = async (client, message) => {
    if (message.author.bot) {
        return;
    }

    /* Send a message when the bot is mentioned */
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))){
        return message.channel.send(`My prefix in this server is \`${client.config.prefix}\``);
    }

    /* Bot commands handling */
    if (message.content.startsWith(client.config.prefix)) {
        const command = message.content.split(' ')[0]
                                       .slice(client.config.prefix.length)
                                       .toLowerCase();
        const args = message.content.split(' ').slice(1);
        let cmd;
    
        if (client.commandes.has(command)) { // command
            cmd = client.commandes.get(command);
        } else if (client.aliases.has(command)) { // alias
            cmd = client.commandes.get(client.aliases.get(command));
        }
        if (!cmd) return; // no command found
    
        const props = require(`../commands/${cmd.conf.dir}/${cmd.conf.name}`);
    
        /* Cooldown management */
        const now = Date.now();
        if (!cooldowns.has(props.conf.name)) {
            cooldowns.set(props.conf.name, new Collection());
        }
        const timestamps = cooldowns.get(props.conf.name);
        const cooldownAmount = (props.conf.cooldown || 2) * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
            if (now < expirationTime) { // user is on cooldown
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send("<:eclock:832607311599108117> You can only use the `"
                                            + props.conf.name + "` command in **"
                                            + timeLeft.toFixed(1) + "** seconds");
            }
        }
        timestamps.set(message.author.id, now); // set the cooldown
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
        /* Run the command */
        try {
            cmd.run(client, message, args);
        } catch (e) {
            client.emit("error", e, message);
        }
    /* Leveling system for non-command messages */
    } else {
        if (client.config.channels.levelingExcluded.includes(message.channel.id)) {
            return;
        }

        await updateUserLevelAndRole(client, message);
    }
};

async function updateUserLevelAndRole(client, message) {
    const levelingRoles = client.config.levelingRoles;
    const xpToAdd = Math.floor(Math.random() * 7) + 8;
    const userData = await findUserById(client, message.author.id);

    if (userData === undefined) { // insert user if not found
        client.db.query(`INSERT INTO leveling VALUES ('${message.author.id}', '0', '0');`)
        return;
    };

    const currentXP = parseInt(userData.xp);
    const currentLevel = parseInt(userData.level);
    const newLevel = currentLevel + 1;
    /* Get the next level's XP requirement */
    const nextLevel = getNextLevelXP(currentLevel);

    if (nextLevel <= (currentXP + xpToAdd)) { // level up
        await client.db.query(`UPDATE leveling
                               SET xp=${currentXP + xpToAdd},level=${currentLevel + 1}
                               WHERE userID=${message.author.id};`);
        
        if (getRolesLevels(levelingRoles).includes(newLevel)) { // there is a role for this level
            const currentRole = getRoleForLevel(currentLevel, levelingRoles);

            if (currentRole) { // remove the previous role if exists
                message.member.roles.remove(currentRole[1]);
            }
            await message.member.roles.add(levelingRoles[newLevel][1]);
            await message.channel.send(
                `**Congratulations** <@${message.author.id}>, you are now level ${newLevel} !`
                + ` Thus, you unlock the \`${levelingRoles[newLevel][0]}\` role.`
            ).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });
        } else { // no role for this level
            await message.channel.send(
                `**Congratulations** <@${message.author.id}>, you are now level ${newLevel} ! Keep it up.`
            ).then(msg1 => {
                setTimeout(() => {
                    msg1.delete();
                }, 5000);
            });
        }
    } else {
        await client.db.query(`UPDATE leveling
                               SET xp=${currentXP + xpToAdd}
                               WHERE userID=${message.author.id};`);
    }
}

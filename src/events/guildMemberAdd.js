module.exports = async (client, member) => {    
    if (bot.config.production && member.user.bot === true) {
        member.roles.add(client.config.roles.bot);
    } else if (bot.config.production) {
        await member.roles.add(client.config.roles.member);

        /* Welcome message */
        await client.channels.cache.get(client.config.channels.welcome).send(
            `<:flag_usa:1006905606436827266> **Welcome <@${member.id}> (\`${member.user.username}#${member.user.discriminator}\`)**,`
            + "we strongly invite you to read <#748556126194237461> to find our rules and various information !\n"
            + "This server is focused on programming help, but the \"Melio's projects\" category remains dedicated to support for "
            + "the owner's (<@290467364372480000>) projects.\n\n"
            + `<:flag_fr:1006905603362390066> **Bienvenue <@${member.id}> (\`${member.user.username}#${member.user.discriminator}\`)**,`
            + " nous t'invitons vivement à lire <#748556126194237461> pour trouver nos règles et diverses informations ! "
            + "\nCe serveur est axé sur l'aide à la programmation, mais la catégorie \"Melio's projects\" reste toutefois dédiée "
            + "au support des projets du propriétaire (<@290467364372480000>)."
        );
    }
}
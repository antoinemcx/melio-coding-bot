module.exports = async (client, member) => {
    if (client.config.production) {
        client.channels.cache.get(client.config.channels.welcome).send(
            `[-] \`${member.user.username}#${member.user.discriminator}\` left the server...`
        );
        client.db.query(`DELETE FROM leveling WHERE userID=${member.user.id};`);
    }
}
module.exports = async (bot) => {
    bot.user.setPresence({ activities: [{
        name: `${bot.config.prefix}help • server's bot` }]
    });
    console.log("\x1b[33m%s\x1b[0m", `(!) ${bot.user.username} have been started...`);
};

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const bot = (global.bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: false }
}));
const fs = require('fs');

/* SET COLLECTION */
bot.commands = new Collection();
bot.aliases = new Collection();
cooldowns = new Collection();

/* SET UTILS */
bot.color = require('./src/utils/color.js');
require('./src/utils/errorHandler.js')(bot);

/* SET CONFIG */
bot.config = require('./config.js');
bot.emotes = require('./config.js').e;
bot.db = require('./src/database/db.js');

/* LOAD ALL FILE AND COMMANDS */
const commandsPath = "./src/commands/";
fs.readdir(commandsPath, (err, files) => {
    if (err) console.log(err);
    files.forEach(dir => {
        fs.readdir(`${commandsPath}${dir}/`, (err, file) => {
            if (err) console.log(err);
            file.forEach(f => {
                const props = require(`${commandsPath}${dir}/${f}`);
                bot.commands.set(props.conf.name, props);
                props.conf.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.conf.name);
                });
            });
            console.log("\x1b[36m%s\x1b[0m", `(!) "${dir}" directory loaded`);
        })
    });
});

/* LOAD ALL EVENTS */
const eventsPath = "./src/events/";
fs.readdir(eventsPath, (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        const event = require(eventsPath + file);
        let eventName = file.split(".")[0];
        bot.on(eventName, event.bind(null, bot));
    });
    console.log("\x1b[36m%s\x1b[0m", `(!) ${files.length} events loaded`);
});

bot.login(bot.config.token); // start bot
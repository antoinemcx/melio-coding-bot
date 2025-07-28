const axios = require("axios");

module.exports = {
    conf: {
        name: "status",
        description: "Check the status (down or up) of a website",
        usage: "<prefix>status <websiteURL>",
        aliases: ["isitdown", "website-status", "webstatus"],
        dir: "dev",
        cooldown: 3
    }, run: async (client, message, args) => {
        if(!args.join(" ")) {
            return message.reply(`${client.emotes.x} Wrong usage\n> Usage : \`${module.exports.conf.usage}\``);
        }
        const domainRegex = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/gi;
        const msg = await message.channel.send("Sending request...");

        let output = domainRegex.exec(args[0]);
        if(!output) {
            await msg.delete();
            await message.channel.send(`${client.emotes.x} Your query is not a valid domain.`);
            return;
        }
        output = output[0];

        /* Fetching the status of the website */
        let ms = new Date().getTime();
        let res = await axios.get(`http://${output}`).catch(err => { return { status: err.status } });

        if(res.status === 200) {
            await msg.delete();
            await message.channel.send(`Status code : **${res.status}** - `
                                       + `**${new Date().getTime() - ms}ms** taken.`
                                       + " The website is **up** !");
            await message.react(client.emotes.v);
            return;
        }
        else if(res.status === 400 || res.status === 503) {
            await msg.delete();
            await message.channel.send(`Status code : **${res.status}** - `
                                       + `**${new Date().getTime() - ms}ms** taken.`
                                       + `\nThe website seems up but respond with ${res.status}.`);
            await message.react(client.emotes.v);
            return;
        }
        else {
            await msg.delete();
            await message.channel.send("The website didn't response. "
                                       + "It seems to be **down** or doesn't exist...");
            await message.react(client.emotes.v);
            return;
        }
    }
}
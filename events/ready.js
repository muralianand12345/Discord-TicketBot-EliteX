const moment = require('moment');
const tz = require('moment-timezone');
const config = require('../config.json');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ready',
    execute(client) {
        const activities = [
            "Queries 24/7!",
            "EliteX RolePlay ❤️",
            "Ticket.exe",
            "your Tickets and Finding Solutions",
            "Music and Vibing",
            "discord.gg/elitexrp",
            "Grand Theft Auto V",
            "Red Dead Redemption II"
          ];
        console.log(`${client.user.tag} Bot is ready to rock n roll!`);
        console.log('Developed For EliteX Rp <3');

        setInterval(() => {
                const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
                const newActivity = activities[randomIndex];
                client.user.setActivity(newActivity,{ type : "PLAYING"});
            }, 5000);


        const needDatenTime = client.config.DATE.ENABLE;

        if (needDatenTime == "true") {
            console.log('Date and Time has been enabled');
            const TIMEZONE = client.config.DATE.TIMEZONE;
            const FORMAT = client.config.DATE.FORMATDATE;
            const CHANNEL_ID = client.config.DATE.CHAN_ID;
            const UPDATE_INTERVAL = client.config.DATE.UPDATE_INTERVAL;

            const timeNow = moment().tz(TIMEZONE).format(FORMAT);
            const clockChannel = client.channels.cache.get(CHANNEL_ID);
            clockChannel.edit({ name: `🕒 ${timeNow}` }, 'Clock update').catch(console.error);

            setInterval(() => {
                const timeNowUpdate = moment().tz(TIMEZONE).format(FORMAT);
                clockChannel.edit({ name: `🕒 ${timeNowUpdate}` }, 'Clock update').catch(console.error);
            }, UPDATE_INTERVAL);

        } else if (needDatenTime == "false") {
            console.log('Date and Time has been disabled');
        } else {
            console.log('Error Has been occured at Time and Date!');
        }

        const err_log=client.channels.cache.get(config.ERR_LOG.CHAN_ID)

        const embed = new MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`Bot Restart Completed and Online ❤️`)
            .setTimestamp();
        err_log.send({embeds:[embed]});

    },
};

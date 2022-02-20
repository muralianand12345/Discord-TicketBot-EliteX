const moment = require('moment');
const tz = require('moment-timezone');
//const chalk = require('chalk');

module.exports = {
    name: 'ready',
    execute(client) {
        const activities = [
            "Your Queries 24/7!",
            "Your Queries 24/7!",
            "Your Queries 24/7!",
            "Your Ticket",
            "Music and Vibing",
            "OwnerPlayz's Command"
          ];
        console.log(`${client.user.tag} Bot is ready to rock n roll!`);
        console.log('Developed For EliteX Rp <3');

        const needDatenTime = client.config.DateNTime;
        if (needDatenTime == "true") {
            console.log('Date and Time has been enabled');
            const TIMEZONE = client.config.TIMEZONE;
            const FORMAT = client.config.FORMATDate;
            const CHANNEL_ID = client.config.dateChannel;
            const UPDATE_INTERVAL = client.config.UPDATE_INTERVAL;
            
            setInterval(() => {
                const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
                const newActivity = activities[randomIndex];
                client.user.setActivity(newActivity,{ type : "LISTENING"});
            }, 5000);

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

        

    },
};

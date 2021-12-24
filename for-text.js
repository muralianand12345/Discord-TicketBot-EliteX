const {
    Client,
    Intents
} = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

const channelId = require('./config.json').ticketChannel;

client.on('ready', client => {
    console.log(`Bot ${client.user.tag} is logged in!`);
    client.channels.cache.get(channelId).send('Text any thing here!');
    //client.channels.cache.get(channelId).send('Text any thing here 2!');

});

client.login(require('./token.json').token);
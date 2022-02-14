const fs = require('fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const keep_alive = require('./keep_alive.js')

//config file for channels and owner id
const config = require('./config.json');

//token env
require('dotenv').config();
var token = process.env.TOKEN;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

//Discord
const Discord = require('discord.js');
client.discord = Discord;
//config
client.config = config;

//command file auto read
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
};

//events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

//interaction 
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client, config);
    } catch (error) { //auto error 
        console.error(error);
        return interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    };
});

//bot login
client.login(token);
const fs = require('fs');
require("dotenv").config();
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientID = process.env.ClIENTID;
const Token = process.env.TOKEN;

//Slash commands 
const slashcommands = [];
const slashcommandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of slashcommandFiles) {
  const command = require(`./commands/${file}`);
  slashcommands.push(command.data.toJSON());
}

const rest = new REST({
  version: '9'
}).setToken(Token);

rest.put(Routes.applicationCommands(clientID), {
    body: slashcommands
  }).then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
  //console.log(`${slashcommands} Loaded to the Client`);
  slashcommands.forEach( eachcommands => {
    console.log(`${eachcommands.name} has been loaded`);
  });

//config file for channels and owner id
const config = require('./config.json');


const client = new Client({
    intents: [Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES],
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
    } catch(error) { //auto error 
        global.console.log(error);
        return interaction.reply({
            content: `An **ERROR** occured! Kindly Contact - ${client.config.ERR_LOG.ERR_TAG}`,
            ephemeral: true
        });
    };
});

try{
    client.on('messageCreate', async message => {
        //ignore bots
        if (message.author.bot) {
            return;
        };

        //reply when tagged
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            const botReply = [
                "Hello! How can I help you?",
                "Yes, how can I help you?",
                "Raise a ticket, we are happy to help you!",
                "At your service ❤️",
                "Yes Sir!",
                "Official EliteX Roleplay Discord Bot"
            ];
            const randomIndex = Math.floor(Math.random() * (botReply.length - 1) + 1);
            const newActivity = botReply[randomIndex];

            message.reply({ content: newActivity })
        }

        //debugging
        /*if(message.author.id !== '678402714765361182') {
            return message.reply({ content: "This command is for developers Only! "})
        }*/

    });
} catch(err) {
    const errTag = client.config.ERR_LOG.ERR_TAG;
    const errChan = client.config.ERR_LOG.CHAN_ID;
    const errorSend = client.channels.cache.get(errChan);
    errorSend.send(`**ERROR!** ${errTag} \n${err}\nCommand: \`Mention Reply\``);
}

client.login(Token);

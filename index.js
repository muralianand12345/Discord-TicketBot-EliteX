const fs = require('fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');

//config file for channels and owner id
const config = require('./config.json');


const client = new Client({
    intents: [Intents.FLAGS.DIRECT_MESSAGES,Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
});

//Discord
const Discord = require('discord.js');
client.discord = Discord;
//config
client.config = config;

//console read and print
let console = process.openStdin()
console.addListener("data", res => {
    let info = res.toString().trim().split(/ +/g)
    client.channels.cache.get(client.config.consoleChannel).send(info.join(" "));
});

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
            content: `An **ERROR** occured! Kindly Contact - ${client.config.errTag}`,
            ephemeral: true
        });
    };
});

try{
    client.on('messageCreate', async message => {
        //ignore bots
        if (message.author.bot) return;

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
    const errTag = client.config.errTag;
    const errChan = client.config.errorLog;
    const errorSend = client.channels.cache.get(errChan);
    errorSend.send(`**ERROR!** ${errTag} \n${err}\nCommand: \`Mention Reply\``);
}

require("dotenv").config();
const Token = process.env.TOKEN;
client.login(Token);

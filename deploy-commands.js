const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();

const Token = process.env.TOKEN;
const clientID = process.env.ClIENTID;
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({
    version: '9'
}).setToken(Token);

rest.put(Routes.applicationCommands(clientID), {
    body: commands
}).then(() => console.log('Successfully registered application commands.')).catch(console.error);
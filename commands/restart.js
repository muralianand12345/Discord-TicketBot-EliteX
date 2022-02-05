const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const owner_ID = require("../config.json").ownerID;
const ID = "678402714765361182";
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
var token = process.env.TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts Bot(Owner Only!)'),
    async execute(interaction, client) {
        client.channels.cache.get(client.config.errorLog).send(`Command Used: \`RESTART\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``);

        if (!owner_ID || !ID)
            return interaction.reply("This command is developers only");

        try {
            await interaction.reply("RESTARTING FAST AS FUCK BOIIIIII ...").then((m) => {
                client.destroy(token);
            });
            await wait(10000).then((m) => {
                client.login(token);
            });
            await interaction.editReply("Damn Son! I'm Back 🔥");   
        } catch(err) {
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** <@678402714765361182> \n${err}\nCommand: \`RESTART\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    },
};
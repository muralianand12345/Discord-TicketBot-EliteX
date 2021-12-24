const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders');
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdowns Bot(Owner Only!)'),
    async execute(interaction, client) {

        if (!owner_ID)
            return interaction.reply("This command is developer Only");

        interaction.reply("THE BOT HAS BEEN SHUTDOWN!").then((m) => {
            client.destroy();
        });
    },
};
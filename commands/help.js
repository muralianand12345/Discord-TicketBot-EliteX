const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help Command'),
    async execute(interaction, client) {
        const helpEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Help Command')
            .setURL('https://discord.gg/5aUsH6QEGh')
            .setDescription('Commands')
            .setThumbnail('https://cdn-icons-png.flaticon.com/512/682/682055.png')
            .addFields({ name: 'add', value: 'Adds a member to the ticket' }, { name: '\u200B', value: '\u200B' }, { name: 'ban', value: 'Bans a member from the server', inline: true }, { name: 'kick', value: 'Kicks a member from the server', inline: true }, { name: 'help', value: 'Displays this command' }, { name: '\u200B', value: '\u200B' }, { name: 'botinfos', value: 'Displays about the Bot', inline: true })
            //.setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            //.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

        interaction.reply({ embeds: [helpEmbed] });

    }
};
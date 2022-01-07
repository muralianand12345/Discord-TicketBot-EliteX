const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {
        let embed = new discord.MessageEmbed()
            .setAuthor("PONG!", client.user.avatarURL())
            .addField("Ping:", Math.round(client.ws.ping) + "ms")
            .setColor("RANDOM")
            .setFooter(client.config.footerText, client.user.avatarURL());
        interaction.reply({ embeds: [embed] });
    }
};
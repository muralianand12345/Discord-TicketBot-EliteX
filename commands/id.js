const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('id')
        .setDescription('Citzen ID and Name (Ticket Command)')
        .addStringOption(
            option =>
            option.setName('citiname')
            .setDescription('Citizen Name')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('citiid')
            .setDescription('Citizen ID')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const commandName = "ID";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});     

        try {
            const chan = client.channels.cache.get(interaction.channelId);
            if (chan.name.includes('ticket')) {
                const citizenName = interaction.options.getString('citiname');
                const citizenID = interaction.options.getString('citiid');
                
                const embed = new MessageEmbed()
                .setColor("GREEN")
                .addFields(
                    { name: 'Citizen Name', value: citizenName, inline: true },
                    { name: 'Citizen ID', value: citizenID, inline: true },
                )
                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply("**You Must Be In A Ticket To Use This Command!**");
            }

        } catch(err) {
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    },
};

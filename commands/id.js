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
        const logMsg = `Command Used: \`ID\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);      

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
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\n${logMsg}`);
        }
    },
};

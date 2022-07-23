const {
    SlashCommandBuilder
} = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add someone to the ticket (Ticket Command) ')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to add to ticket')
            .setRequired(true)),
    async execute(interaction, client) {
        const commandName = "ADD";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});

        try{
            const chan = client.channels.cache.get(interaction.channelId);
            const user = interaction.options.getUser('target');
            if (chan.name.includes('ticket')) {
                chan.edit({
                    permissionOverwrites: [{
                        id: user,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: client.config.roleSupport,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                ],
            }).then(async() => {
                interaction.reply({
                    content: `<@${user.id}> has been added to the ticket!`
                });
            });
        } else {
            interaction.reply({
                content: 'You are not in a ticket!',
                ephemeral: true
            });
        };

        } catch(err) {
            const errTag = client.config.errTag;
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.errorLog).send({ content: `${errTag}`, embeds: [errEmbed] });
        } 
        
    },
};
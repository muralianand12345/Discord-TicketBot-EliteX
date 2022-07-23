const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const RoleID3 = require("../config.json").Role3ID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('VP Announcement')
        .addChannelOption(
            option =>
            option.setName('channelid')
            .setDescription('Channel you want to send!')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('text')
            .setDescription('Announcements')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const commandName = "ANNOUNCE";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});

        const annnouceText = interaction.options.getString('text');
        const annchannel = interaction.options.getChannel('channelid'); 
        const User = interaction.member; 

        if ( User.roles.cache?.has(`${RoleID3}`)) {

            if (annchannel.type !== 'GUILD_TEXT') {
                interaction.reply({ content: "`Select Only Text Channels`", ephemeral: true });
                return;
            }
    
            try {
               client.channels.cache.get(annchannel.id).send({ content: annnouceText })
               interaction.reply("Announcement Has Been Sent To The Channel!");
    
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
        } else {
            return interaction.reply({content: "You do not have the required permission to execute this command!", ephemeral: true});
        }

        
    },
};


const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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

        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(client.discord.Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply({
            content: 'You do not have the required permission to execute this command!',
            ephemeral: true
        });

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
    },
};


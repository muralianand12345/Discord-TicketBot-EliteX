const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a person.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to ban')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for ban')
            .setRequired(false)),
    async execute(interaction, client) {
        const commandName = "BAN";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(client.discord.Permissions.FLAGS.BAN_MEMBERS)) return interaction.reply({
            content: 'You do not have the required permission to execute this command! (`BAN_MEMBERS`)',
            ephemeral: true
        });

        if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
            content: 'The person you want to ban is above you!',
            ephemeral: true
        });

        if (!user.bannable) return interaction.reply({
            content: "The person you want to ban is above me! So I can't ban it.",
            ephemeral: true
        });
        try{
            if (interaction.options.getString('reason')) {
                user.ban({
                    reason: interaction.options.getString('reason'),
                    days: 1
                });
                interaction.reply({
                    content: `**${user.user.tag}** Has been successfully banned!`
                });
            } else {
                user.ban({
                    days: 1
                });
                interaction.reply({
                    content: `**${user.user.tag}**Has been successfully banned!`
                });
            };

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
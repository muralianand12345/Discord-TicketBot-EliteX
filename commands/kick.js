const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a person.')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to kick')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason to kick')
            .setRequired(false)),
    async execute(interaction, client) {
        const commandName = "KICK";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});
        
        const user = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.options.getUser('target').id);
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(client.discord.Permissions.FLAGS.KICK_MEMBERS)) return interaction.reply({
            content: 'You do not have the required permission to execute this command! (`KICK_MEMBERS`)',
            ephemeral: true
        });

        if (user.roles.highest.rawPosition > executer.roles.highest.rawPosition) return interaction.reply({
            content: 'The person you want to kick is above you!',
            ephemeral: true
        });

        if (!user.kickable) return interaction.reply({
            content: "The person you want to kick is above me! So I can't kick it.",
            ephemeral: true
        });

        try {
            if (interaction.options.getString('reason')) {
                user.kick(interaction.options.getString('reason'))
                interaction.reply({
                    content: `**${user.user.tag}** Has been successfully kicked!`
                });
            } else {
                user.kick()
                interaction.reply({
                    content: `**${user.user.tag}** Has been successfully kicked!`
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
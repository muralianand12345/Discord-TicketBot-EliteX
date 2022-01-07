const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('VP Announcement')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Announcements')
            .setRequired(true)),
    async execute(interaction, client) {
        const tagMember = require('../config.json').TagMember;
        const annnouceText = interaction.options.getString('text');
        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(client.discord.Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply({
            content: 'You do not have the required permission to execute this command!',
            ephemeral: true
        });

        let embed = new client.discord.MessageEmbed()
            .setTitle(annnouceText)
            .setColor("RANDOM")
            .setFooter(client.config.footerText, client.user.avatarURL());
        interaction.reply({ embeds: [embed], content: `@${tagMember}` });

        //client.channels.cache.get(channelId).send({ embeds: [embed] });

    },
};
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('About the Bot <3'),
    async execute(interaction, client) {
        const embed = new client.discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Made Only For EliteX ... Made with 💗')
            .setFooter(client.config.footerText, client.user.avatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    },
};
const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('About the Bot <3'),
    async execute(interaction, client) {
        client.channels.cache.get(client.config.errorLog).send(`Command Used: \`BOTINFO\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``);
        try {
            const embed = new client.discord.MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Made Only For EliteX ... Made with 💗')
            .setFooter(client.config.footerText, client.user.avatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        } catch(err) {
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** <@678402714765361182> \n${err}\nCommand: \`BOTINFO\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    },
};
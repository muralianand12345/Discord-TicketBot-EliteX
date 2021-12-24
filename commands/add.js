const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Add someone to the ticket')
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Member to add to ticket')
            .setRequired(true)),
    async execute(interaction, client) {
        const chan = client.channels.cache.get(interaction.channelId);
        const user = interaction.options.getUser('target');

        if (chan.name.includes('ticket')) {
            chan.edit({
                permissionOverwrites: [{
                        id: user,
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
    },
};
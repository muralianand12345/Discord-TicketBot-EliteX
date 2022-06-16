const {
    SlashCommandBuilder
} = require('@discordjs/builders');

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
        const logMsg = `Command Used: \`BAN\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
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
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\n${logMsg}`);
        }

        
    },
};
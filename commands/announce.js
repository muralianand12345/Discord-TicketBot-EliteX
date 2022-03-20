const {
    SlashCommandBuilder
} = require('@discordjs/builders');

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
        const logMsg = `Command Used: \`ANNOUNCE\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        const tagMember = require('../config.json').TagMember;

        const annnouceText = interaction.options.getString('text');
        const annchannel = interaction.options.getChannel('channelid');  

        const executer = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        if (!executer.permissions.has(client.discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
            interaction.reply({ content: 'You do not have the required permission to execute this command!', ephemeral: true});
            return;
        }

        if (annchannel.type !== 'text') {
            interaction.reply({ content: "`Select Only Text Channels`", ephemeral: true });
            return;
        }

        try {
           client.channels.cache.get(annchannel.id).send({ content: annnouceText })
           interaction.reply("Announcement Has Been Sent To The Channel!");

        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`ANNOUNCE\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
    },
};


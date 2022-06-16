const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed, MessageActionRow } = require('discord.js');

const Role1 = require("../config.json").Role1;
const Emoji = require("../config.json").Emoji;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sends reaction role message'),
    async execute(interaction, client) {
        
        const logMsg = `Command Used: \`REACTIONROLE\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        if (interaction.user.id != owner_ID) {
            return await interaction.reply({ content:"This command is not for you : )",ephemeral: true });
        }

        function sendMsg() {
            const reactionRole = client.channels.cache.get(client.config.ChannelID);
            const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription('```REDM ROLE```')

            const button = new MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId('role1')
                .setLabel(Role1)
                .setEmoji(Emoji)
                .setStyle('SECONDARY'),
            );
        reactionRole.send({ embeds: [embed], components: [button] });

        }
        sendMsg();
        interaction.reply("`Reaction Sent Sucessfully!`");   
        
    },
};
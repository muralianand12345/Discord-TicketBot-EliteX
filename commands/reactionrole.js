const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed, MessageActionRow } = require('discord.js');

const config = require('../config.json');
const Role = config.REDM_CHAN.ROLE;
const Emoji = config.REDM_CHAN.EMOJI;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Sends reaction role message'),
    async execute(interaction, client) {
        const commandName = "REACTIONROLE";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        if (interaction.user.id != owner_ID) {
            return await interaction.reply({ content:"This command is not for you : )",ephemeral: true });
        }

        function sendMsg() {
            const reactionRole = client.channels.cache.get(client.config.REDM_CHAN.CHAN_ID);
            const embed = new MessageEmbed()
            .setColor("RED")
            .setDescription('```REDM ROLE```')

            const button = new MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId('role1')
                .setLabel(Role)
                .setEmoji(Emoji)
                .setStyle('SECONDARY'),
            );
            reactionRole.send({ embeds: [embed], components: [button] });

        }

        try{
            sendMsg();
            interaction.reply("`Reaction Sent Sucessfully!`");   
        } catch(err){
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
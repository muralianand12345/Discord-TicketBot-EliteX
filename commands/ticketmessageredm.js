const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const owner_ID = require("../config.json").ownerID;
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmessageredm')
        .setDescription("Sends Ticket To Ticket Channel!"),
    async execute(interaction, client) {
        const commandName = "TicketMessageREDM";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )

        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});
        
        if (interaction.user.id != owner_ID) {
            await interaction.reply({content: "SENDING...",ephemeral: true});
            await wait(1000);
            await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
            await wait(2000);
            return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
        }
        
        try{
            const Ticket = client.channels.cache.get(client.config.REDM_TICKET.TICKET_MSG.CHAN_ID);

            function sendTicketMSG() {

                const embed = new MessageEmbed()
                    .setColor('6d6ee8')
                    .setAuthor({ name: "EliteX Roleplay" })
                    .setDescription('```REDM TICKET HERE```')
                    .setFooter({ text: client.config.footerText, iconURL : client.user.avatarURL()})
                const button = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('open-ticket-redm')
                            .setLabel('REDM Ticket')
                            .setEmoji('🎟️')
                            .setStyle('SUCCESS'),
                    );

                    Ticket.send({
                        embeds: [embed],
                        components: [button]
                    })
            }
            sendTicketMSG();
            interaction.reply("Ticket Message Has Been Sent!")

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
        
    }
};

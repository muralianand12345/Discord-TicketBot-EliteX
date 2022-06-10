const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const owner_ID = require("../config.json").ownerID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmessagefivem')
        .setDescription("Sends FiveM Ticket To Ticket Channel!"),
    async execute(interaction, client) {

        const logMsg = `Command Used: \`TICKETMESSAGE\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        if (interaction.user.id != owner_ID) {
            await interaction.reply({content: "SENDING...",ephemeral: true});
            await wait(1000);
            await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
            await wait(2000);
            return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
        }
        try{
            const Ticket = client.channels.cache.get(client.config.ticketChannelFivem);
            Ticket.send('\`Note: ⛔ Blank Tickets Will Be Deleted\`\n\n __**OOC Format:**__ \n\n **Name:** \n **OOC Against:** \n **Type: ** \n **Date and Time:** \n **Evidence (Yes/No):** \n\`Raise OOC In This Format\`\n\n __**In Game Details Need To be Mentioned**__\n\n**In Game Name:**\n**In Game Citizen ID:**\n**In Game Mobile Number:**\n');
            
            function sendTicketMSG() {
                const embed = new client.discord.MessageEmbed()
                    .setColor('6d6ee8')
                    .setAuthor('FIVEM TICKET HERE!')
                    .setDescription('**React With 🎫 to Create a Ticket.**')
                    .setFooter(client.config.footerText, client.user.avatarURL())
                const button = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('open-ticket-fivem')
                            .setLabel('Open ticket')
                            .setEmoji('🎫')
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
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand \`Ticket Message\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
    }
};
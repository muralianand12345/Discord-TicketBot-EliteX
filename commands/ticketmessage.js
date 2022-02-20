const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const owner_ID = require("../config.json").ownerID;
const ID = "678402714765361182";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticketmessage')
        .setDescription("Sends Ticket To Ticket Channel!"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`TICKETMESSAGE\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        if (interaction.user.id != owner_ID) {
            await interaction.reply({content: "SHUTDOWW...",ephemeral: true});
            await wait(1000);
            await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
            await wait(2000);
            return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
        }
        try{
            const Ticket = client.channels.cache.get(client.config.ticketChannel);
            Ticket.send('**If any OOC  Or Other Issue Kindly open Ticket & wait for our Staff to respond....!** \n\n\n **⛔   Blank Tickets Will Be Deleted** \n __**OOC Format:**__ \n\n **Name:** \n **OOC Against:** \n **Type: ** \n **Date:** \n **Evidence (yes/no):** \n **Pls raise ooc in this format** \n\n\n __**In Game Details Need To be Mentioned in Ticket.**__ \n\n **In Game Name:** \n **In Game Mob No:** ');

            function sendTicketMSG() {

                const embed = new client.discord.MessageEmbed()
                    .setColor('6d6ee8')
                    .setAuthor('TICKET HERE!')
                    .setDescription('**React With 🎟️ to Create a Ticket.**')
                    .setFooter(client.config.footerText, client.user.avatarURL())
                const button = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('open-ticket')
                            .setLabel('Open ticket')
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

        } catch(e) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand \`Ticket Message\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    }
};
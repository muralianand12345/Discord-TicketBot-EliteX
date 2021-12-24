module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`${client.user.tag} Bot ready!`);
        console.log('Developed For EliteX Rp <3');
        client.user.setActivity(`24/7 For Your Queries!`, { type: "LISTENING" });
        const Ticket = client.channels.cache.get(client.config.ticketChannel)
        const channelId = require('../config.json').ticketChannel;
        client.channels.cache.get(channelId).send('**If any OOC  Or Other Issue Kindly open Ticket & wait for our Staff to respond....!** \n\n\n **⛔   Blank Tickets Will Be Deleted** \n __**OOC Format:**__ \n\n **Name:** \n **OOC Against:** \n **Type: ** \n **Date:** \n **Evidence (yes/no):** \n **Pls raise ooc in this format** \n\n\n __**In Game Details Need To be Mentioned in Ticket.**__ \n\n **In Game Name:** \n **In Game Mob No:** ');

        console.log('Message Sent!')

        function sendTicketMSG() {
            const embed = new client.discord.MessageEmbed()
                .setColor('6d6ee8')
                .setAuthor('TICKET HERE!', client.user.avatarURL())
                .setDescription('**Click The Button Below To Open A Ticket**')
                .setFooter(client.config.footerText, client.user.avatarURL())
            const button = new client.discord.MessageActionRow()
                .addComponents(
                    new client.discord.MessageButton()
                    .setCustomId('open-ticket')
                    .setLabel('Open ticket')
                    .setEmoji('✉️')
                    .setStyle('PRIMARY'),
                );

            Ticket.send({
                embeds: [embed],
                components: [button]
            })
        }

        Ticket.bulkDelete(100).then(() => {
            sendTicketMSG()
        })
    },
};
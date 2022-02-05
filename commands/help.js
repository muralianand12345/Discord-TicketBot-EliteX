const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help Command'),
    async execute(interaction, client) {
        client.channels.cache.get(client.config.errorLog).send(`Command Used: \`HELP\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``);
        try {
            const helpEmbed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle('Help Command')
            .setURL('https://discord.gg/jPSbpsjb4r')
            .setDescription('Commands')
            .setThumbnail('https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png')
            .addFields({ name: 'help', value: 'Displays this command' }, { name: 'ping', value: "Display's Bot Ping" }, { name: 'botinfos', value: 'Displays about the Bot' }, { name: 'add', value: 'Adds a member to the ticket \n"ONLY TICKET SUPPORTERS"' }, { name: 'ban', value: 'Bans a member from the server \n"ONLY ADMIN"' }, { name: 'kick', value: 'Kicks a member from the server \n"ONLY ADMIN"' }, { name: 'announce', value: 'VP Announcement \n"ONLY IMMIGRATION OFFICERS & ADMINS"' }, { name: 'shutdown', value: 'Shutdowns Bot :( \n"ONLY ADMIN"' })
            .setTimestamp()
            .setFooter(client.config.footerText, client.user.avatarURL());

        interaction.reply({ embeds: [helpEmbed] });

        } catch(err) {
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** <@678402714765361182> \n${err}\nCommand: \`HELP\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        

    }
};
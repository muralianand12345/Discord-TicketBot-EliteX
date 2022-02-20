const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`PING\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        try {
            let embed = new discord.MessageEmbed()
            .setAuthor("PONG!", client.user.avatarURL())
            .addField("Ping:", Math.round(client.ws.ping) + "ms")
            .setColor("RANDOM")
            .setFooter(client.config.footerText, client.user.avatarURL());
        interaction.reply({ embeds: [embed] });
        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`PING\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    }
};
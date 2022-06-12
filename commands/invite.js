const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const {MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`INVITE\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        try {
            const row = new MessageActionRow()
			.addComponents(
                new MessageButton()
                .setLabel("EliteX RP")
                .setStyle("LINK")
                .setURL("https://discord.gg/jPSbpsjb4r")
			);
            const mainPage = new MessageEmbed()
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setColor('#303236')
            .addField('**Join ELiteX RP**', `[Here](https://discord.gg/jPSbpsjb4r)`, true)
            interaction.reply({embeds: [mainPage], components: [row]})
        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`INVITE\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    }
};
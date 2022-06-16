const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const {MessageActionRow, MessageButton } = require("discord.js");

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`INVITE\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        
        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {
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

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);

            }
            
        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\n${logMsg}`);
        }
        
    }
};
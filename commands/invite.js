const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription("Sends EliteX RP Server Invite Link"),
    async execute(interaction, client) {
        const commandName = "INVITE";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});
        
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
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.errorLog).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
        
    }
};
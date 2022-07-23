const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription("Send's The Server's Info"),
    async execute(interaction, client) {
        const commandName = "SERVERINFO";

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
                const guild = interaction.guild;
                const owner = await guild.fetchOwner();
                const channels = await guild.channels.fetch();
                const roles = await guild.roles.fetch();

                console.log(guild)

                const embed = new MessageEmbed()
                .setColor('BLURPLE')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                })
                .setThumbnail(guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
                .addFields(
                    { name: 'Server Creation', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:f>`},
                    { name: 'Owner', value: `${owner}`, inline: true },
                    { name: 'Server', value: `${guild.name}`, inline: true },
                    { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                    { name: 'Server Id', value: `${guild.id}`, inline: true },
                    { name: 'Total Channels', value: `${channels.size}`, inline: true },
                    { name: 'Role Count', value: `${roles.size}`, inline: true },
                )
                .setFooter({
                    text: `Guild ID: ${guild.id}`
                })
            
                await interaction.reply({
                    embeds: [ embed ]
                });

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
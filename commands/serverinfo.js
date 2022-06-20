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

                const embed = new MessageEmbed()
                .setColor('BLURPLE')
                .setAuthor({
                    name: guild.name,
                    iconURL: guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                })
                .setThumbnail(guild.iconURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg')
                .addField('Server Creation', `<t:${Math.round(guild.createdTimestamp / 1000)}:f>`, false)
                .addField('Owner', `${owner}`, false)
                .addField('Total Members', `${guild.memberCount}`, false)
                .addField('Total Channels', `${channels.size}`, false)
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
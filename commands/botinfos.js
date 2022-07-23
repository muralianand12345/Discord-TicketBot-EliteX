const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const os = require('os')
const si = require('systeminformation');

const cooldown = new Set();
const cooldownTime = 30000;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('About the Bot <3'),
    async execute(interaction, client) {
        const commandName = "BOTINFO";

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

                let days = Math.floor(client.uptime / 86400000);
                let hours = Math.floor(client.uptime / 3600000) % 24;   
                let minutes = Math.floor(client.uptime / 60000) % 60;  
                let seconds = Math.floor(client.uptime / 1000) % 60;

                let ram = ((process.memoryUsage().heapUsed / 1024 / 1024) + (process.memoryUsage().heapTotal / 1024 / 1024)).toFixed(2);
    
                const embed = new MessageEmbed()     
                    .setAuthor({name: client.user.username, iconURL: client.user.displayAvatarURL()})
                    .setColor("BLUE")
                    .addFields(
                        {
                            name: 'Ping',
                            value: `\`\`\`${client.ws.ping} ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'Users',
                            value: `\`\`\`${client.users.cache.size}\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'Servers',
                            value: `\`\`\`${client.guilds.cache.size}\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'RAM Usage',
                            value: `\`\`\`${ram}MB\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'Server OS',
                            value: `\`\`\`Kali Linux\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'API latency',
                            value: `\`\`\`${client.ws.ping} ms\`\`\``,
                            inline: true,
                        },
                        {
                            name: 'Uptime',
                            value: `\`\`\`${days}d ${hours}h ${minutes}m ${seconds}s\`\`\``,
                            inline: true,
                        },
                      
                    )

                interaction.reply({embeds: [embed], components: [row]});

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
        
    },
};
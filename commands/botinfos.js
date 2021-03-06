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

                let ram = ((process.memoryUsage().heapUsed / 1024 / 1024) + (process.memoryUsage().heapTotal / 1024 / 1024)).toFixed(2);
                const duration1 = moment.duration(interaction.client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
                const embed = new MessageEmbed();
                embed.setColor('RANDOM');
                embed.setAuthor(
                    {
                        name: client.user.username,
                        icon_url: client.user.displayAvatarURL()
                    }
                )
                embed.addFields(
                    {
                        name: 'Channels',
                        value: `\`\`\`${client.channels.cache.size}\`\`\``,
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
                        //value: `\`\`\`1\`\`\``,
                        inline: true,
                    },
                    {
                        name: 'RAM usage',
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
                        value: `\`\`\`${duration1}\`\`\``,
                        inline: true,
                    },
                  
                );

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
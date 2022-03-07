const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports={
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription("Displays bot uptime"),

    async execute(interaction,client)
    {
        
        const ms = client.uptime
        const sec = moment.duration(client.uptime).seconds()
        const min = moment.duration(client.uptime).minutes()
        const hour = moment.duration(client.uptime).hours()
        const day = moment.duration(client.uptime).days()

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`Heartbeat ${day} day ${hour} hour ${min} minute ${sec} seconds`)
            .setFooter({text:client.config.footerText, iconURL:client.user.avatarURL()})
        
            await interaction.reply({embeds:[embed]})
    

        
    }
}
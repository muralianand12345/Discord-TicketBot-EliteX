const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const cooldown = new Set();
const cooldownTime = 60000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boomer')
        .setDescription("Free Advice"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`BOOMER\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {
                const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
                const boomer = data.slip.advice;
        
                const embed = new MessageEmbed()
                .setTitle('Boomer Advice')
                .setDescription(boomer)
                .setColor('BLURPLE')

                await interaction.reply({ embeds: [embed] });

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
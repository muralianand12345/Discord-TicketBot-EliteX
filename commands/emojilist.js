const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojilist')
        .setDescription("Send's All The Emoji In The Server"),
    async execute(interaction, client) {
        const commandName = "EMOJILIST";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {
                const guild = interaction.guild;

                let Emojis = "";
                let EmojisAnimated = "";
                let EmojiCount = 0;
                let Animated = 0;
                let OverallEmojis = 0;

                function Emoji(id) {
                    return client.emojis.cache.get(id).toString();
                }

                guild.emojis.cache.forEach((emoji) => {
                    OverallEmojis++;
                    if (emoji.animated) {
                        Animated++;
                        EmojisAnimated += Emoji(emoji.id);
                    } else {
                        EmojiCount++;
                        Emojis += Emoji(emoji.id);
                    }
                });

                let Embed = new MessageEmbed()
                .setTitle(`${guild.name} | ${OverallEmojis} `)
                .setDescription(`**Animated [${Animated}]**:\n${EmojisAnimated}\n\n**Standard [${EmojiCount}]**:\n${Emojis}`)
                .setColor('BLURPLE');

                if (Embed.length > 2000) {
                    return interaction.reply("`I'm sorry but, my limit is 2000 characters only!`");
                } else {
                    interaction.reply({embeds:[Embed], ephemeral: true});
                }

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);  
            }          

        } catch(err) {
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "Command", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
        
    }
};
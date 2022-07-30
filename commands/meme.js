const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fetch = require('node-fetch');

const cooldown = new Set();
const cooldownTime = 600000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription("Random Meme"),
    async execute(interaction, client) {
        const commandName = "MEME";

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
                let meme = await fetch('https://meme-api.herokuapp.com/gimme').then(r => r.json());

                const embed = new MessageEmbed()
                .setTitle(meme.title)
                .setURL(meme.postLink)
                .setImage(meme.url)
                .setColor('BLURPLE')
                .setFooter({ text: `${meme.ups}👍 || r/${meme.subreddit}` })

                const button = new MessageActionRow()
                .addComponents(
                    [
                        new MessageButton()
                        .setLabel('Refresh')
                        .setStyle('PRIMARY')
                        .setCustomId('refresh-button')
                    ]
                )
                
                let interaction_message = await interaction.reply({
                    embeds: [ embed ],
                    components: [ button ],
                    fetchReply: true
                });

                const collector = await interaction_message.createMessageComponentCollector({
                    filter: fn => fn,
                    componentType: 'BUTTON'
                });

                collector.on('collect', async i => {
                    if (i.user.id !== interaction.user.id) {
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send(`<@!${i.user.id}> Got RickRolled\nChannel: <#${i.channel.id}>`);
                        return i.reply({
                            content: `https://tenor.com/bEWOf.gif`,
                            ephemeral: true
                        });
                    }
                         
                    if (i.customId === 'refresh-button') {
                        await i.deferUpdate();
                        let meme2 = await fetch('https://meme-api.herokuapp.com/gimme').then(r => r.json());

                        const embed2 = new MessageEmbed()
                        .setTitle(meme2.title)
                        .setURL(meme2.postLink)
                        .setImage(meme2.url)
                        .setColor('BLURPLE')
                        .setFooter({ text: `${meme2.ups}👍 〢 r/${meme2.subreddit}` })

                        return interaction_message.edit({
                            embeds: [ embed2]
                        });
                    }
                });

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
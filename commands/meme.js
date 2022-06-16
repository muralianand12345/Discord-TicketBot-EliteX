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
        const logMsg = `Command Used: \`MEME\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

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
                        client.channels.cache.get(client.config.errorLog).send(`<@!${i.user.id}> Got RickRolled\nChannel: <#${i.channel.id}>`);
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
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\n${logMsg}`);
        }
        
    }
};
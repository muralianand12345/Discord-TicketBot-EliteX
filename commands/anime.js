const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Anilist = require('anilist-node');
const anilist = new Anilist();

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('animesearch')
        .setDescription("Displays information about specified anime")
        .addStringOption(option =>
            option.setName('anime')
            .setDescription('Provide the name of anime')
            .setRequired(true)),
    async execute(interaction, client) {
        const commandName = "ANIME";

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
                const anime_name = interaction.options.getString('anime');
                if (anime_name == undefined) return interaction.reply('Invalid Syntax\nProvide Anime Name.');

                const search = await anilist.search('anime', anime_name);

                if (typeof search.media[0] == 'undefined') {
                    return interaction.reply(`Couldn't find an anime with name ${anime}`);
                }

                const anime = await anilist.media.anime(search.media[0].id);

                let animeDescription = anime.description.replace(/<[^>]*>?/gm, '');
                if (animeDescription.length > 1024) {
                    animeDescription = `${anime.description.replace(/<[^>]*>?/gm, '').substring(0, 1020)}...`;
                }
                
                if (!interaction.channel.nsfw && anime.isAdult) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor('RED')
                            .setDescription(
                                'The anime you searched for contains adult content.\nTo view details about the anime, you must use this command in Age-Restricted/NSFW enabled channels.'
                            )
                            .setImage('https://i.imgur.com/oe4iK5i.gif')
                        ],
                        ephemeral: true
                    });
                } else {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor('BLURPLE')
                            .setTitle(anime.title.english || anime.title.native || anime.title.romaji)
                            .setURL(anime.siteUrl)
                            .setImage(`https://img.anili.st/media/${anime.id}`)
                            .setThumbnail(anime.coverImage.large)
                            .addField('Romaji Name', `${anime.title.romaji}`, true)
                            .addField('English Name', `${anime.title.english}`, true)
                            .addField('Native Name', `${anime.title.native}`, true)
                            .addField('Country of Origin', `${anime.countryOfOrigin}`, true)
                            .addField('Total Episodes', `${anime.episodes}`, true)
                            .addField('Episodes Duration', `${anime.duration}`, true)
                            .addField('Contains Adult Content', `${anime.isAdult ? 'Yes' : 'No'}`, true)
                        ]
                    });
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
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Displays weather information')
        .addStringOption(
            option =>
            option.setName('location')
            .setDescription('Provide a city or state name')
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const commandName = "WEATHER";
        const location = interaction.options.getString('location');

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`},
            { name: "Location", value: `${location}`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});
        
        try{
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
            } else {
                weather.find({ search: location, degreeType: 'C' }, function (err, result) {

                    if (err) return;
                    if (result.length === 0) {
                        return interaction.reply({ content: 'Please provide a valid city or state name', ephemeral: true });
                    }

                    var current = result[0].current;
                    var location = result[0].location;

                    const embed = new MessageEmbed()
                    .setAuthor({ name: `Weather: ${current.observationpoint}` })         
                    .setColor('BLURPLE')         
                    .setThumbnail(current.imageUrl)           
                    .addField('Timezone', `UTC ${location.timezone}`, true)
                    .addField('Temperature', `${current.temperature}°`, true)          
                    .addField('Feels Like', `${current.feelslike}°`, true)          
                    .addField('Wind Display', `${current.winddisplay}`, true)          
                    .addField('Humidity', `${current.humidity}%`, true)           
                    .addField('Day and Date', `${current.day} ${current.date}`, true)        
                    .setFooter({ text: `${current.skytext}` })

                    interaction.reply({ embeds: [embed], ephemeral: true }).catch(err => {});                   
                });

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);

            }

        } catch(err){
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
}
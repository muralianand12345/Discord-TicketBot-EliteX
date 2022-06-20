const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdowns Bot(Owner Only!)'),
    async execute(interaction, client) {
        const commandName = "SHUTDOWN";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});
        
        try {
            if (interaction.user.id != owner_ID) {
                await interaction.reply({content: "SHUTDOWW...",ephemeral: true});
                await wait(1000);
                await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
                await wait(2000);
                return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
            }

            interaction.reply("THE BOT HAS BEEN SHUTDOWN!").then((m) => {
                client.destroy();   
            });   
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
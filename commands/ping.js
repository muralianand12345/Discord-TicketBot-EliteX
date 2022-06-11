const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const wait = require('util').promisify(setTimeout);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {

        const logMsg = `Command Used: \`PING\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        await interaction.reply({content: "Pinging EliteX Support Bot ..."});
        await wait(1000);
        await interaction.editReply({content:"Fast As Fuck Boiiiiii 🏃💨 ..."});
        await wait(2000);
        await interaction.editReply({content:"**🏓 Pong!**"});

        try {
            let embed = new discord.MessageEmbed()
            .addField("Ping:", Math.round(client.ws.ping) + "ms")
            .setColor("RANDOM")
            await interaction.editReply({ embeds: [embed] });

        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`PING\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
    }
};
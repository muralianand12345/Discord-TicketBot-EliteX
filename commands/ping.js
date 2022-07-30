const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const cooldown = new Set();
const cooldownTime = 30000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async execute(interaction, client) {
        const commandName = "PING";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        try{ 
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
            
            } else {
                await interaction.reply({content: "Pinging EliteX Support Bot ..."});
                await wait(1000);
                await interaction.editReply({content:"Fast As Fuck Boiiiiii 🏃💨 ..."});
                await wait(2000);
                await interaction.editReply({content:"**🏓 Pong!**"});

                let embed = new MessageEmbed()
                .addFields({ name: "Ping:", value: Math.round(client.ws.ping) + "ms" })
                .setColor("RANDOM")
                .setTimestamp()
                await interaction.editReply({ embeds: [embed] });

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
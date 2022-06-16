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
        const logMsg = `Command Used: \`PING\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

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
                .addField("Ping:", Math.round(client.ws.ping) + "ms")
                .setColor("RANDOM")
                await interaction.editReply({ embeds: [embed] });

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
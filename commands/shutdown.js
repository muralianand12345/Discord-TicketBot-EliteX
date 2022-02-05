const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders');
const owner_ID = require("../config.json").ownerID;
const ID = "678402714765361182";
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdowns Bot(Owner Only!)'),
    async execute(interaction, client) {
        client.channels.cache.get(client.config.errorLog).send(`Command Used: \`SHUTDOWN\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``);

        if (!owner_ID || !ID)
            return interaction.reply("This command is developers only");

        try {
            interaction.reply("THE BOT HAS BEEN SHUTDOWN!").then((m) => {
                client.destroy();   
            });   
        } catch(err) {
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** <@678402714765361182> \n${err}\nCommand: \`SHUTDOWN\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
        
    },
};
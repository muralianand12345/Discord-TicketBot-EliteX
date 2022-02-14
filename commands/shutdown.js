const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shutdowns Bot(Owner Only!)'),
    async execute(interaction, client) {
        client.channels.cache.get(client.config.errorLog).send(`Command Used: \`SHUTDOWN\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``);
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
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** <@678402714765361182> \n${err}\nCommand: \`SHUTDOWN\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    },
};
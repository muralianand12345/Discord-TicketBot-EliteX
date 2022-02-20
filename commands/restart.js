const {
    SlashCommandBuilder,
    time
} = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const owner_ID = require("../config.json").ownerID;
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
var token = process.env.TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts Bot(Owner Only!)'),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`RESTART\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        try {
            if (interaction.user.id != owner_ID || ID) {
                await interaction.reply({content: "RESTARRR...",ephemeral: true});
                await wait(1000);
                await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
                await wait(2000);
                return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
            }

            await interaction.reply("RESTARTING FAST AS F BOIIIIII ...").then((m) => {
                client.destroy(token);
                });
            await wait(2000).then((m) => {
                client.login(token);
            });
            await interaction.editReply("Damn Son! I'm Back 🔥");
              
        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`RESTART\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    },
};
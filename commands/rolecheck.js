const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require("discord.js");
const {MessageActionRow, MessageButton } = require("discord.js");
const owner_ID = require("../config.json").ownerID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolecheck')
        .setDescription("Prints the user with PR role and Community role"),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`ROLECHECK\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);
        try {
            if (interaction.user.id != owner_ID) {
                await interaction.reply({content: "ROLEEE...",ephemeral: true});
                await wait(1000);
                await interaction.editReply({content:"Wait ... What?!",ephemeral: true});
                await wait(2000);
                return await interaction.editReply({content:"Bruh! You are not a developer, this command is not for you : )",ephemeral: true});
            }

            await interaction.guild.members.fetch();
            const role1ID = require("../config.json").role1ID;
            const role2ID = require("../config.json").role2ID;
            const role1 = interaction.guild.roles.cache.find(role => role.id == role1ID);
            const role2 = interaction.guild.roles.cache.find(role => role.id == role2ID);
            const totalrole1 = role1.members.map(m => m.user);
            const totalrole2 = role2.members.map(m => m.user);

            function getCommon(arr1, arr2) {
                var common = [];
                for(var i=0 ; i<arr1.length ; ++i) {
                  for(var j=0 ; j<arr2.length ; ++j) {
                    if(arr1[i] == arr2[j]) {
                      common.push(arr1[i]);
                    }
                  }
                }
                if (common.length == 0) {
                    interaction.reply({ content: `No Members`, ephemeral: true });
                    return;
                } else {
                    return common;
                }     
            }
            var NameID = getCommon(totalrole1, totalrole2);
            interaction.reply({ content: ` Common Role: ${NameID}`, ephemeral: true }).catch(err => console.log("No Member/RoleCheckError!"));

        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`ROLECHECK\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
        
    }
};

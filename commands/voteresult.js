const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const RoleID = require("../config.json").VOTE.ROLE_ID;
const { MessageEmbed } = require('discord.js');
const fs  = require('fs')

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voteresult')
        .setDescription('Gets The Result of the Current Voting (Only Admins)')
        .addBooleanOption(option =>
            option.setName('delete')
            .setDescription("Want to delete previous vote? True = delete || False = do not delete")
            .setRequired(true)),
    async execute(interaction, client) {

        const commandName = "VOTERESULT";
        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        async function ReadFileArray(votefile) {
            const readFileLines = filename => 
            fs.readFileSync(filename).toString('UTF8').split('\n');
            let arr = readFileLines(votefile);

            //Total Votes
            let Total = arr.length - 1;
            
            // 👍 Total Number
            let TotalUP = 0;
            await arr.forEach(async(Vote) => {
                if (Vote.includes('UP')) {
                    TotalUP = TotalUP + 1;
                }
                return TotalUP;
            });

            // 👎 Total Number
            let TotalDOWN = 0;
            await arr.forEach(async(Vote) => {
                if (Vote.includes('DOWN')) {
                    TotalDOWN = TotalDOWN + 1;
                }
                return TotalDOWN;
            });

            //Percentage Mathematics
            const PercentageUP = Math.round(TotalUP * 100/Total);
            const PercentageDOWN = Math.round(TotalDOWN * 100/Total);

            //EMBED
            const ResultEmbed = new MessageEmbed()
            .setDescription("VOTE RESULT")
            .setColor("#E6E6FA")
            .addFields(
                { name: "👍", value: `\`Total: ${TotalUP}\nPercentage: ${PercentageUP}%\``},
                { name: "👎", value: `\`Total: ${TotalDOWN}\nPercentage: ${PercentageDOWN}%\``}
            )
            await interaction.reply({ embeds: [ResultEmbed], ephemeral: true });
        }
        
        try{
            const User = interaction.member;
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try Again Later (Cooldown)`", ephemeral: true });

            } else {
                if (User.roles.cache?.has(`${RoleID}`)) {
                    const FileName = client.config.VOTE.FILE_NAME;
                    ReadFileArray(FileName);   
                    const DeleteOp = interaction.options.getBoolean('delete');
                    const ChannelID = interaction.channel.id;
                    if (DeleteOp == true) {
                        fs.writeFile(FileName, '', function(){
                            client.channels.cache.get(ChannelID).send({ content: "**Vote Deleted**\nStart a new voting!"});
                        });
                    } else if (DeleteOp == false) {
                        
                    } else {
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `File: voteresult.js\nUnable to Delete | **ERROR!**`});
                    }

                } else {
                    return await interaction.reply({ content:"This command is for admins only!",ephemeral: true });
                }
                cooldown.add(interaction.user.id);
                setTimeout(() => {
                   cooldown.delete(interaction.user.id);
                }, cooldownTime);  
            }
            
        } catch(err){
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
        
        
    },
};
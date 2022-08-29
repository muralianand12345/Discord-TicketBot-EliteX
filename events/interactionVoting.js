const cooldown = new Set();
const cooldownTime = 10000; 
const { MessageEmbed } = require('discord.js');
const fs  = require('fs')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try{
            const FileName = client.config.VOTE.FILE_NAME;
            function Vote1Write(User) {
                var votelog = fs.appendFile(FileName, `${User} === UP\n`, (error) => {
                    if (error) {
                        throw err;
                    } else {
                        return interaction.reply({content:"`Your Response Has Been Noted!`", ephemeral: true});
                    }
                });   
            }

            function Vote2Write(User) {
                var votelog = fs.appendFile(FileName, `${User} === DOWN\n`, (error) => {
                    if (error) {
                        throw err;
                    } else {
                        return interaction.reply({content:"`Your Response Has Been Noted!`", ephemeral: true});
                    }
                }); 
            }

            //VOTE1 ...............................................

            if (interaction.customId == "vote1") {
                let UserID = interaction.user.id;
                if (cooldown.has(interaction.user.id)) {
                    return interaction.reply({ content: "`Settle Down Buddy! Try Again Later (Cooldown)`", ephemeral: true });

                } else {
                    fs.readFile(FileName, function (err, data) {
                        if (err) throw err;
                        if(data.includes(UserID)){
                            return interaction.reply({content:"`You Have Already Responded!`",ephemeral: true});
                        } else {
                            Vote1Write(UserID);
                        }
                    });

                    cooldown.add(interaction.user.id);
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id);
                    }, cooldownTime);  
                }       
            }
            
            //VOTE2 ...............................................

            if (interaction.customId == "vote2") {
                let UserID = interaction.user.id;
                if (cooldown.has(interaction.user.id)) {
                    return interaction.reply({ content: "`Settle Down Buddy! Try Again Later (Cooldown)`", ephemeral: true });

                } else {

                    fs.readFile(FileName, function (err, data) {
                        if (err) throw err;
                        if(data.includes(UserID)){
                            return interaction.reply({content:"`You Have Already Responded!`",ephemeral: true});
                        } else {
                            Vote2Write(UserID);
                        }
                    });

                    cooldown.add(interaction.user.id);
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id);
                    }, cooldownTime); 
                }
            }

        } catch(err) {
            const commandName = "interactionVoting.js";
            const errTag = client.config.ERR_LOG.ERR_TAG;
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "File", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    }
}
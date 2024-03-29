const config = require('../config.json');
const Role = config.REDM_CHAN.ROLE;
const RoleID = config.REDM_CHAN.ROLE_ID;
const wait = require('util').promisify(setTimeout);
const cooldown = new Set();
const cooldownTime = 60000; 
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try{
            const errorLog = client.config.ERR_LOG.CHAN_ID;
            const errorSend = client.channels.cache.get(errorLog);

            const User = interaction.member;

            if (interaction.customId == "role1") {

                if (cooldown.has(interaction.user.id)) {
                    return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                    
                } else {
    
                    if ( User.roles.cache?.has(`${RoleID}`)) {
                        let role = interaction.guild.roles.cache.get(`${RoleID}`);
                        
                        await interaction.reply({content: "`Getting Your Discord Name And Tag`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:"`Loading ...`",ephemeral: true});
                        await wait(2000);
                        await interaction.editReply({content:"`Removing Role`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:`${Role} **has been removed!**`, ephemeral: true});
    
                        User.roles.remove(role).catch(err => {
                            const commandName = "interactionRole.js";
                            const errTag = client.config.errTag;
                            const errEmbed = new MessageEmbed()
                            .setTitle("ERROR")
                            .setColor("RED")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Channel", value: `<#${interaction.channel.id}>`},
                                { name: "Line", value: "Unable to Remove Role!"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        });

                        const rmEmbed = new MessageEmbed()
                            .setTitle("REDM ROLE")
                            .setColor("BLACK")
                            .addFields(
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Removed", value: `${Role}`}
                            )
                        errorSend.send({ embeds: [rmEmbed]});
                        
                    } else {
                        let role = interaction.guild.roles.cache.get(`${RoleID}`);
    
                        await interaction.reply({content: "`Getting Your Discord Name And Tag`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:"`Loading ...`",ephemeral: true});
                        await wait(2000);
                        await interaction.editReply({content:"`Giving Role`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:`${Role} **has been added!**`, ephemeral: true});
    
                        User.roles.add(role).catch(err => {
                            const commandName = "interactionRole.js";
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new MessageEmbed()
                            .setTitle("ERROR")
                            .setColor("RED")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Channel", value: `<#${interaction.channel.id}>`},
                                { name: "Line", value: "Unable to Give Role!"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        });
                        const getEmbed = new MessageEmbed()
                            .setTitle("REDM ROLE")
                            .setColor("BLACK")
                            .addFields(
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Received", value: `${Role}`}
                            )
                        errorSend.send({ embeds: [getEmbed]});
                    }

                    cooldown.add(interaction.user.id);
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id);
                    }, cooldownTime);  
                }
            }
                                                                 
        } catch(err) {
            const commandName = "interactionRole.js";
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
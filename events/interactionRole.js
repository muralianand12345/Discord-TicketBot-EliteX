const Role1 = require("../config.json").Role1;
const RoleID1 = require("../config.json").Role1ID;
const wait = require('util').promisify(setTimeout);
const cooldown = new Set();
const cooldownTime = 60000; 

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try{
            const errTag = client.config.errTag;
            const errorLog = client.config.errorLog;
            const errorSend = client.channels.cache.get(errorLog);

            const User = interaction.member;

            if (interaction.customId == "role1") {

                if (cooldown.has(interaction.user.id)) {
                    return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                    
                } else {
    
                    if ( User.roles.cache?.has(`${RoleID1}`)) {
                        let role = interaction.guild.roles.cache.get(`${RoleID1}`);
                        
                        await interaction.reply({content: "`Getting Your Discord Name And Tag`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:"`Loading ...`",ephemeral: true});
                        await wait(2000);
                        await interaction.editReply({content:"`Removing Role`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:`${Role1} **has been removed!**`, ephemeral: true});
    
                        User.roles.remove(role).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Unable to Give Role!\*\*\n<@!${interaction.user.id}>`)});
    
                        errorSend.send(`${User} \`removed ${Role1} Role\``);
                    } else {
                        let role = interaction.guild.roles.cache.get(`${RoleID1}`);
    
                        await interaction.reply({content: "`Getting Your Discord Name And Tag`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:"`Loading ...`",ephemeral: true});
                        await wait(2000);
                        await interaction.editReply({content:"`Giving Role`",ephemeral: true});
                        await wait(1000);
                        await interaction.editReply({content:`${Role1} **has been added!**`, ephemeral: true});
    
                        User.roles.add(role).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Unable to Give Role!\*\*\n<@!${interaction.user.id}>`)});
                        
                        errorSend.send(`${User} \`received ${Role1} Role\``);
                    }

                    cooldown.add(interaction.user.id);
                    setTimeout(() => {
                        cooldown.delete(interaction.user.id);
                    }, cooldownTime);  
                }
            }
                                                                 
        } catch(err) {
            const commandName = "interactionRole.js";
            const errTag = client.config.errTag;
            const errEmbed = new MessageEmbed()
            .setTitle("ERROR")
            .setColor("RED")
            .setDescription(`${err}`)
            .addFields(
                { name: "File", value: `${commandName}`},
                { name: "User", value: `<@!${interaction.user.id}>`},
                { name: "Channel", value: `<#${interaction.channel.id}>`}
            )
            client.channels.cache.get(client.config.errorLog).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
    }
}
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('VP Announcement')
        .addChannelOption(
            option =>
            option.setName('channelid')
            .setDescription('Channel you want to send!')
            .setRequired(true)
        )
        .addStringOption(
            option =>
            option.setName('text')
            .setDescription('Announcements')
            .setRequired(true)
        ),

    async execute(interaction, client) {

        const commandName = "ANNOUNCE";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        const annnouceText = interaction.options.getString('text');
        const annchannel = interaction.options.getChannel('channelid'); 

        if (annchannel.type !== 'GUILD_TEXT') {
            interaction.reply({ content: "`Select Only Text Channels`", ephemeral: true });
            return;
        }

        const User = client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id);

        const Guild_1 = client.config.ANNOUNCE.GUILD_1.ID;
        const Guild_2 = client.config.ANNOUNCE.GUILD_2.ID;

        if (interaction.guild.id == Guild_1) {

            const Method = client.config.ANNOUNCE.GUILD_1.METHOD;
            if ( Method == "ID") {

                const Role_Id = client.config.ANNOUNCE.GUILD_1.ROLE.ID;
                const Role_Name = client.config.ANNOUNCE.GUILD_1.ROLE.NAME;

                if (User.roles.cache?.has(Role_Id)) {

                    try {
                        client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                        interaction.reply({ content: "Announcement Has Been Sent To The Channel!", ephemeral: true});
                    } catch(err) {
                        const errTag = client.config.errTag;
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
                } else {
                    return interaction.reply({content: `You do not have ${Role_Name} Role`, ephemeral: true});
                }

            } else if ( Method == "PERMS") {

                const Perms = client.config.ANNOUNCE.GUILD_1.PERMS;

                if (User.permissions.has(Perms)) {

                    client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                    interaction.reply({ content: "Announcement Has Been Sent To The Channel!", ephemeral: true});      
                } else {
                    
                    return interaction.reply({content: `You do not have the required permission \`${Perms}\`.`, ephemeral: true});
                }
            } else {
                console.log("Announce Command Error! REASON: Invalid Method");
            }

        } else if (interaction.guild.id == Guild_2) {

            const Method = client.config.ANNOUNCE.GUILD_2.METHOD;
            if ( Method == "ID") {

                const Role_Id = client.config.ANNOUNCE.GUILD_2.ROLE.ID;
                const Role_Name = client.config.ANNOUNCE.GUILD_2.ROLE.NAME;

                if (User.roles.cache?.has(Role_Id)) {

                    try {
                        client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                        interaction.reply({ content: "Announcement Has Been Sent To The Channel!", ephemeral: true});
                    } catch(err) {
                        const errTag = client.config.errTag;
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
                } else {
                    return interaction.reply({content: `You do not have ${Role_Name} Role`, ephemeral: true});
                }

            } else if ( Method == "PERMS") {

                const Perms = client.config.ANNOUNCE.GUILD_2.PERMS;

                if (User.permissions.has(Perms)) {

                    client.channels.cache.get(annchannel.id).send({ content: annnouceText })
                    interaction.reply({ content: "Announcement Has Been Sent To The Channel!", ephemeral: true});      
                } else {

                    return interaction.reply({content: `You do not have the required permission \`${Perms}\`.`, ephemeral: true});
                }

            } else {
                console.log("Announce Command Error! REASON: Invalid Method");
            }

        } else {
            return interaction.reply({content: "This command is only valid to few discord servers!", ephemeral: true});
        }
    },
};


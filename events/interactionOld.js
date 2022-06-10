//This File is for old users, if you are new i.e just now starting to use this ticket bot ... just delete this file.

let hastebin = require('hastebin');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        const errTag = client.config.errTag;
        const errorLog = client.config.errorLog;
        const errorSend = client.channels.cache.get(errorLog);

        if (!interaction.isButton()) return;
        if (interaction.customId == "open-ticket") {
            
            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id)) {
                interaction.reply({
                    content: '**You Have Already Created a Ticket!**',
                    ephemeral: true
                }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Ticket Already Opened Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});
                errorSend.send(`The User \`${interaction.user.id}\` has already opened a Ticket \n Unable to open a new Ticket (OLD)`);
                return;
            };

        };

        try{
            if (interaction.customId == "close-ticket") {
                const guild = client.guilds.cache.get(interaction.guildId);
                const chan = guild.channels.cache.get(interaction.channelId);
                const row = new client.discord.MessageActionRow()
                .addComponents(

                    new client.discord.MessageButton()
                    .setCustomId('confirm-close')
                    .setLabel('Close ticket')
                    .setStyle('DANGER'),

                    new client.discord.MessageButton()
                    .setCustomId('no')
                    .setLabel('Cancel closure')
                    .setStyle('SECONDARY'),
                );

                const verif = await interaction.reply({
                    content: '**Are You Sure You Want To Close The Ticket?**',
                    components: [row]
                });

                const collector = interaction.channel.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    time: 10000
                });

                const userID = interaction.user.id; 

                collector.on('collect', i => {
                    if (i.customId == 'confirm-close') {

                        interaction.editReply({
                            content: `**Ticket closed by** <@!${i.user.id}>`,
                            components: []
                        });

                        chan.edit({
                                name: `closed-${chan.name}`,
                                parent: client.config.parentClose,
                                permissionOverwrites: [
                                    {
                                        id: client.users.cache.get(chan.topic), //error
                                        deny: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                    },
                                    {
                                        id: client.config.roleSupport,
                                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                                    },
                                    {
                                        id: interaction.guild.roles.everyone,
                                        deny: ['VIEW_CHANNEL'],
                                    },
                                ],
                            }).catch(err => {})
                            .then(async() => {

                                const embed = new client.discord.MessageEmbed()
                                    .setColor('6d6ee8')
                                    .setAuthor({name:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                    .setDescription('```Ticket Supporters, Delete After Verifying```')
                                    .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                   .setTimestamp();

                                const row = new client.discord.MessageActionRow()

                                .addComponents(
                                    new client.discord.MessageButton()
                                    .setCustomId('delete-ticket')
                                    .setLabel('Delete ticket')
                                    .setEmoji('🗑️')
                                    .setStyle('DANGER'),
                                );

                                chan.send({
                                    embeds: [embed],
                                    components: [row]
                                });
                            });

                        collector.stop();
                    };

                    if (i.customId == 'no') {
                        interaction.editReply({
                            content: `Ticket Closure Has Been Cancelled by <@!${i.user.id}>!`,
                            components: []
                        });

                        collector.stop();
                    };
                });



            collector.on('end', (i) => {
                if (i.size < 1) {

                    interaction.editReply({
                        content: `**Closing of the canceled ticket! Requested By: <@${userID}>!**`, 
                        components: []
                    });
                };
            });
        };

    } catch(err){
        errorSend.send(`**ERROR!** ${errTag} \n${err}\nCommand: \`Ticket Delete by User\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`);
    }

    try{

        if (interaction.customId == "delete-ticket") {
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);

            interaction.reply({
                content: 'Saving messages ...'
            }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Ticket Save Messages Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});

            chan.messages.fetch().then(async(messages) => {

                let a = messages.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');

                if (a.length < 1) a = "Nothing"

                hastebin.createPaste(a, {
                        contentType: 'text/plain',
                        server: 'https://www.toptal.com/developers/hastebin/'
                    }, {}).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Skipped The Ticket Log Warning!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)})

                    .then(function(urlToPaste) {
                        const embed = new client.discord.MessageEmbed()
                            .setAuthor({name:'Logs Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                            .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${chan.topic - 1}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`)
                            .setColor('2f3136')
                            .setTimestamp();

                        client.channels.cache.get(client.config.logsTicket).send({
                            embeds: [embed]
                        }).catch(err => {console.log(err)});

                        chan.send("Deleting the channel...");
                        
                        setTimeout( () => chan.delete().catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Spamming\*\*`)}),5000);

                    }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*HastBin Log Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});
            });
        };

    } catch(err){
        console.log(err);
        errorSend.send(`**ERROR!** ${errTag} \n${err}\nCommand: \`Ticket Delete by Ticket Supporters\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`);
    }

    },

};


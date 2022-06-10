let hastebin = require('hastebin');

module.exports = {

    name: 'interactionCreate',

    async execute(interaction, client) {

        const errTag = client.config.errTag;
        const errorLog = client.config.errorLog;
        const errorSend = client.channels.cache.get(errorLog);

        if (!interaction.isButton()) return;
        if (interaction.customId == "open-ticket-fivem") {
            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == interaction.user.id + 1)) {
                interaction.reply({
                    content: '**You Have Already Created a Ticket!**',
                    ephemeral: true
                }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Ticket Already Opened Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});
                errorSend.send(`The User \`${interaction.user.id}\` has already opened a Ticket \n Unable to open a new Ticket(FIVEM)`);
                return;
            };

            interaction.guild.channels.create(`fivem-ticket-${interaction.user.username}`, {
                parent: client.config.parentOpened,
                topic: interaction.user.id + 1,
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
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
                type: 'text',
                
            }).then(async c => {
                interaction.reply({
                    content: `FiveM Ticket created! <#${c.id}>`,
                    ephemeral: true
                }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Ticket Not Opened Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});

                const embed = new client.discord.MessageEmbed()
                    .setColor('6d6ee8')
                    .setAuthor({name:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                    .setDescription('Select the category of your ticket')
                    .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                    .setTimestamp();

                const row = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageSelectMenu()
                        .setCustomId('category')
                        .setPlaceholder('Select the ticket category')
                        .addOptions([{
                                label: 'OOC',
                                value: 'Ooc',
                                emoji: '📝',
                            },
                            {
                                label: 'COMBAT LOGGING',
                                value: 'CombatLogging',
                                emoji: '🗡️',
                            },
                            {
                                label: 'BUGS',
                                value: 'Bugs',
                                emoji: '🐛',
                            },
                            {
                                label: 'SUPPORTERS PACK',
                                value: 'Supporters',
                                emoji: '💎',
                            },
                            {
                                label: 'PLANNED RP',
                                value: 'Planned',
                                emoji: '📓',
                            },
                            {
                                label: 'CHARACTER ISSUE',
                                value: 'Character',
                                emoji: '🪲',
                            },
                            {
                                label: 'OTHERS',
                                value: 'Others',
                                emoji: '📙',
                            },
                        ]),
                    );

                msg = await c.send({
                    content: `<@!${interaction.user.id}>`,
                    embeds: [embed],
                    components: [row]
                }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Ticket Options Error!\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});

                errorSend.send(`The User \`${interaction.user.id}\` has opened a Ticket \n Category Menu!(FIVEM)`);

                const collector = msg.createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 100000
                });

                collector.on('collect', i => {
                    if (i.user.id === interaction.user.id) {
                        if (msg.deletable) {
                            msg.delete().then(async() => {

                                const embed = new client.discord.MessageEmbed()
                                    .setColor('6d6ee8')
                                    .setAuthor({name:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                    .setDescription(`<@!${interaction.user.id}> Created a ticket ${i.values[0]}`)
                                    .setFooter({text:'Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                                    .setTimestamp();

                                const row = new client.discord.MessageActionRow()
                                    .addComponents(
                                        new client.discord.MessageButton()
                                        .setCustomId('close-ticket-fivem')
                                        .setLabel('Close Ticket')
                                        .setEmoji('899745362137477181')
                                        .setStyle('DANGER'),
                                    );



                                const opened = await c.send({
                                    content: `**Your FIVEM Ticket Has Been Created!**`,
                                    embeds: [embed],
                                    components: [row]
                                });

                                opened.pin().then(() => {
                                    opened.channel.bulkDelete(1);
                                });
                            }).catch(err => {errorSend.send(`**ERROR!** ${errTag} \n${err}\n\*\*Option After Ticket Creation Error\*\* \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\`\n`)});
                        };

                        if (i.values[0] == 'Ooc') {
                            c.edit({
                                parent: client.config.parentOOCFivem
                            });
                        };

                        if (i.values[0] == 'CombatLogging') {
                            c.edit({
                                parent: client.config.parentCLFivem
                            });
                        };

                        if (i.values[0] == 'Bugs') {
                            c.edit({
                                parent: client.config.parentBugsFivem
                            });
                        };

                        if (i.values[0] == 'Supporters') {
                            c.edit({
                                parent: client.config.parentSupportersFivem
                            });
                        };

                        if (i.values[0] == 'Planned') {
                            c.edit({
                                parent: client.config.parentPlannedFivem
                            });
                        };

                        if (i.values[0] == 'Character') {
                            c.edit({
                                parent: client.config.parentCharacterFivem
                            });
                        };

                        if (i.values[0] == 'Others') {
                            c.edit({
                                parent: client.config.parentOthers
                            });
                        };
                    };
                });



                collector.on('end', collected => {
                    if (collected.size < 1) {
                        c.send(`\`Category Not Selected, Closing The Ticket in 5 Seconds ...\``).then(() => {

                            setTimeout(() => {
                                if (c.deletable) {
                                    c.delete();
                                };
                            }, 5000);

                        });

                    errorSend.send(`The User \`${interaction.user.id}\` opened a Ticket is closed \n No Category is Selected!`);

                    };
                });
            });
        };

        try{

        if (interaction.customId == "close-ticket-fivem") {
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);
            const row = new client.discord.MessageActionRow()

                .addComponents(

                    new client.discord.MessageButton()
                    .setCustomId('confirm-close-fivem')
                    .setLabel('Close ticket')
                    .setStyle('DANGER'),

                    new client.discord.MessageButton()
                    .setCustomId('no-fivem')
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
                if (i.customId == 'confirm-close-fivem') {

                    interaction.editReply({
                        content: `**Ticket closed by** <@!${i.user.id}>`,
                        components: []
                    });

                    chan.edit({
                            name: `fivem-closed-${chan.name}`,
                            parent: client.config.parentClose,
                            permissionOverwrites: [
                                {
                                    id: client.users.cache.get(chan.topic - 1), //error
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
                                    .setCustomId('delete-ticket-fivem')
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

                if (i.customId == 'no-fivem') {
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

        if (interaction.customId == "delete-ticket-fivem") {
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


let hastebin = require('hastebin');
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const errChan = client.config.ERR_LOG.CHAN_ID;
        const errorSend = client.channels.cache.get(errChan);

        if (!interaction.isButton()) return;
        if (interaction.customId == "open-ticket-fivem") {

            const InteID = BigInt(interaction.user.id) + BigInt(1);

            if (client.guilds.cache.get(interaction.guildId).channels.cache.find(c => c.topic == InteID.toString())) {
                interaction.reply({
                    content: '**You have already created a ticket! Kindly Contact any \`Ticket Supporters\` if not!**',
                    ephemeral: true
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("RED")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${interaction.channel.id}>`},
                        { name: "Line", value: "Already Opened a Ticket!"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });

                const ticEmbed = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor({ name: "FiveM"})
                .setDescription("Unable to open a new Ticket")
                .addFields(
                    { name: 'User', value: `<@!${interaction.user.id}>`},
                    { name: 'Reason', value: "has already opened a Ticket"}
                )
                errorSend.send({ embeds:[ticEmbed] });
                return;
            };

            interaction.guild.channels.create(`fivem-ticket-${interaction.user.username}`, {
                parent: client.config.FIVEM_TICKET.MAIN,
                topic: InteID.toString(),
                permissionOverwrites: [{
                        id: interaction.user.id,
                        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                    },
                    {
                        id: client.config.FIVEM_TICKET.ROLE_SUPPORT.ID,
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
                    content: `Ticket created! <#${c.id}>`,
                    ephemeral: true
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("RED")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${c.id}>`},
                        { name: "Line", value: "Ticket Not Created"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });

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
                }).catch(err => {
                    const commandName = "interactionCreateFiveM.js";
                    const errTag = client.config.ERR_LOG.ERR_TAG;
                    const errEmbed = new MessageEmbed()
                    .setTitle("ERROR")
                    .setColor("RED")
                    .setDescription(`${err}`)
                    .addFields(
                        { name: "File", value: `${commandName}`},
                        { name: "User", value: `<@!${interaction.user.id}>`},
                        { name: "Channel", value: `<#${interaction.channel.id}>`},
                        { name: "Line", value: "Ticket Options Error"}
                    )
                    client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                });

                const collector = msg.createMessageComponentCollector({
                    componentType: 'SELECT_MENU',
                    time: 20000
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
                                    content: `**Your Ticket Has Been Created!** *Use \`/id\` and fill the following!*`,
                                    embeds: [embed],
                                    components: [row]
                                });

                                opened.pin().then(() => {
                                    opened.channel.bulkDelete(1);
                                });
                            }).catch(err => {
                                const commandName = "interactionCreateFiveM.js";
                                const errTag = client.config.ERR_LOG.ERR_TAG;
                                const errEmbed = new MessageEmbed()
                                .setTitle("ERROR")
                                .setColor("RED")
                                .setDescription(`${err}`)
                                .addFields(
                                    { name: "File", value: `${commandName}`},
                                    { name: "User", value: `<@!${interaction.user.id}>`},
                                    { name: "Channel", value: `<#${interaction.channel.id}>`},
                                    { name: "Line", value: "Option After Ticket"}
                                )
                                client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                            });
                        };
                        if (i.values[0] == 'Ooc') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.OOC
                            });
                        };
                        if (i.values[0] == 'CombatLogging') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.CL
                            });
                        };
                        if (i.values[0] == 'Bugs') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.BUG
                            });
                        };
                        if (i.values[0] == 'Supporters') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.SUPPORT
                            });
                        };
                        if (i.values[0] == 'Planned') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.PLANNED
                            });
                        };
                        if (i.values[0] == 'Character') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.CHAR
                            });
                        };
                        if (i.values[0] == 'Others') {
                            c.edit({
                                parent: client.config.FIVEM_TICKET.OTHER
                            });
                        };
                    };
                });

                collector.on('end', collected => {
                    if (collected.size < 1) {
                        c.send(`No category selected. Closing the ticket ...`).then(() => {
                            setTimeout(() => {
                                if (c.deletable) {
                                    c.delete();
                                };
                            }, 5000);
                        });

                        const ticEmbed2 = new MessageEmbed()
                        .setColor("BLUE")
                        .setAuthor({ name: "FIVEM"})
                        .setDescription("Menu Closed")
                        .addFields(
                            { name: 'User', value: `<@!${interaction.user.id}>`},
                            { name: 'Reason', value: "No Category Selected"}
                        )
                        errorSend.send({ embeds:[ticEmbed2] });
                    };
                });
            });
        };
        try{

        if (interaction.customId == "close-ticket-fivem") {

            const userButton = interaction.user.id;

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
                content: 'Are you sure you want to close the ticket?',
                components: [row]
            });

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: 'BUTTON',
                time: 10000
            });

            collector.on('collect', i => {
                if (i.customId == 'confirm-close-fivem') {
                    interaction.editReply({
                        content: `Ticket closed by <@!${i.user.id}>`,
                        components: []
                    });

                    const chanID = i.channel.id;
                    const ChanTopic = BigInt(chan.topic) - BigInt(1);

                    chan.edit({
                            name: `closed-${chan.name}`,
                            parent: client.config.FIVEM_TICKET.CLOSED,
                            permissionOverwrites: [
                                {
                                    id: client.users.cache.get(ChanTopic.toString()), //error
                                    deny: ['SEND_MESSAGES','VIEW_CHANNEL'],
                                },
                                {
                                    id: client.config.FIVEM_TICKET.ROLE_SUPPORT.ID,
                                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                                },
                                {
                                    id: interaction.guild.roles.everyone,
                                    deny: ['VIEW_CHANNEL'],
                                },
                            ],
                        }).catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new MessageEmbed()
                            .setTitle("ERROR")
                            .setColor("RED")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Channel", value: `<#${chanID}>`},
                                { name: "Line", value: "Ticket Close Error"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        })
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
                        content: `**Ticket closure cancelled!** (<@${i.user.id}>)`,
                        components: []
                    });
                    collector.stop();
                };
            });

            collector.on('end', (i) => {
                if (i.size < 1) {
                    interaction.editReply({
                        content: `**Closing of the canceled ticket!** (<@!${userButton}>)`,
                        components: []
                    });
                };
            });
        };
    } catch(err){
        const commandName = "interactionCreateFiveM.js";
        const errTag = client.config.ERR_LOG.ERR_TAG;
        const errEmbed = new MessageEmbed()
        .setTitle("ERROR")
        .setColor("RED")
        .setDescription(`${err}`)
        .addFields(
            { name: "File", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`},
            { name: "Line", value: "Ticket Delete Error"}
        )
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
    }

    try{

        if (interaction.customId == "delete-ticket-fivem") {
            const guild = client.guilds.cache.get(interaction.guildId);
            const chan = guild.channels.cache.get(interaction.channelId);

            interaction.reply({
                content: 'Saving messages ...'
            }).catch(err => {
                const commandName = "interactionCreateFiveM.js";
                const errTag = client.config.ERR_LOG.ERR_TAG;
                const errEmbed = new MessageEmbed()
                .setTitle("ERROR")
                .setColor("RED")
                .setDescription(`${err}`)
                .addFields(
                    { name: "File", value: `${commandName}`},
                    { name: "User", value: `<@!${interaction.user.id}>`},
                    { name: "Channel", value: `<#${interaction.channel.id}>`},
                    { name: "Line", value: "Saving Message Interaction"}
                )
                client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
            });

            const chanTopic = BigInt(chan.topic) - BigInt(1);

            chan.messages.fetch().then(async(messages) => {
                let a = messages.filter(m => m.author.bot !== true).map(m =>
                    `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
                ).reverse().join('\n');
                if (a.length < 1) a = "Nothing"
                hastebin.createPaste(a, {
                        contentType: 'text/plain',
                        server: 'https://www.toptal.com/developers/hastebin/'
                    }, {}).catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new MessageEmbed()
                        .setTitle("ERROR")
                        .setColor("RED")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "Ticket Log Error (Unable to Save)"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    })
                    .then(function(urlToPaste) {
                        const embed = new client.discord.MessageEmbed()
                            .setAuthor({name:'Logs Ticket', iconURL:'https://cdn.discordapp.com/attachments/782584284321939468/784745798789234698/2-Transparent.png'})
                            .setDescription(`📰 Logs of the ticket \`${chan.id}\` created by <@!${chanTopic.toString()}> and deleted by <@!${interaction.user.id}>\n\nLogs: [**Click here to see the logs**](${urlToPaste})`)
                            .setColor('2f3136')
                            .setTimestamp();

                        client.channels.cache.get(client.config.FIVEM_TICKET.LOG.CHAN_ID).send({
                            embeds: [embed]
                        }).catch(err => {console.log(err)});
                        chan.send("Deleting the channel...");

                        setTimeout( () => chan.delete().catch(err => {
                            const commandName = "interactionCreateFiveM.js";
                            const errTag = client.config.ERR_LOG.ERR_TAG;
                            const errEmbed = new MessageEmbed()
                            .setTitle("ERROR")
                            .setColor("RED")
                            .setDescription(`${err}`)
                            .addFields(
                                { name: "File", value: `${commandName}`},
                                { name: "User", value: `<@!${interaction.user.id}>`},
                                { name: "Channel", value: `<#${interaction.channel.id}>`},
                                { name: "Line", value: "Spamming"}
                            )
                            client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                        }),5000);

                        
                    }).catch(err => {
                        const commandName = "interactionCreateFiveM.js";
                        const errTag = client.config.ERR_LOG.ERR_TAG;
                        const errEmbed = new MessageEmbed()
                        .setTitle("ERROR")
                        .setColor("RED")
                        .setDescription(`${err}`)
                        .addFields(
                            { name: "File", value: `${commandName}`},
                            { name: "User", value: `<@!${interaction.user.id}>`},
                            { name: "Channel", value: `<#${interaction.channel.id}>`},
                            { name: "Line", value: "HasteBin Error"}
                        )
                        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ content: `${errTag}`, embeds: [errEmbed] });
                    });
            });
        };
    } catch(err){
        const commandName = "interactionCreateFiveM.js";
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
    },
};

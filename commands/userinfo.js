const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription("Send's The User's Info")
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User Name')
            .setRequired(false)),
    async execute(interaction, client) {
        const commandName = "USERINFO";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        
        client.channels.cache.get(client.config.errorLog).send({ embeds: [logEmbed]});

        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {

                const user = interaction.options.getMember('user') || interaction.member;
                const guild = interaction.guild;
                await user.user.fetch(true);
                const filter = { owner: guild.ownerId === user.id };

                var flags = {
                    '': 'None',
                    DISCORD_EMPLOYEE: 'Discord Employee',
                    DISCORD_PARTNER: 'Discord Partner',
                    BUGHUNTER_LEVEL_1: 'Bug Hunter ( Level 1 )',
                    BUGHUNTER_LEVEL_2: 'Bug Hunter ( Level 2 )',
                    HYPESQUAD_EVENTS: 'Hypesquad Events',
                    HOUSE_BRILLIANCE: `HypeSquad Brilliance`,
                    HOUSE_BRAVERY: `HypeSquad Bravery`,
                    HOUSE_BALANCE: `HypeSquad Balance`,
                    EARLY_SUPPORTER: 'Early Supporter',
                    TEAM_USER: 'Team User',
                    VERIFIED_BOT: 'Verified Bot',
                    VERIFIED_DEVELOPER: 'Verified Bot Developer',
                    DISCORD_NITRO: 'Discord Nitro'
                };

                const Flags = flags[user.user.flags.toArray().join(', ')];

                if (user.avatar && user.avatar.startsWith('a_')) Flags.push(Badges['DISCORD_NITRO']);
                let acknowledgement;
                if (filter.owner) acknowledgement = 'Guild Owner';
                if (user.permissions.has('ADMINISTRATOR') && !filter.owner) acknowledgement = 'Administrator';
                if (
                    user.permissions.has(['MANAGE_ROLES', 'MANAGE_MESSAGES']) &&
                    !user.permissions.has('ADMINISTRATOR') &&
                    !filter.owner
                ) {
                    acknowledgement = 'Moderator';
                }
                
                if (
                    user.permissions.has(['SEND_MESSAGES']) &&
                    !user.permissions.has(['MANAGE_ROLES', 'MANAGE_MESSAGES']) &&
                    !filter.owner
                ) {
                    acknowledgement = 'Member';
                }
    

                const embed = new MessageEmbed()
                .setColor('BLURPLE')
                .setAuthor({
                    name: user.user.tag,
                    iconURL: user.displayAvatarURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                })
                .setThumbnail(
                    user.displayAvatarURL() || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                )
                .addField('Account Creation', `<t:${Math.round(user.user.createdTimestamp / 1000)}:f>`, false)
                .addField('Badges', `${Flags}`, false)
                .setFooter({
                    text: `User ID: ${user.id}`
                });

                await interaction.reply({
                    embeds: [embed]
                });
                
                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime); 
            }          

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
            client.channels.cache.get(client.config.errorLog).send({ content: `${errTag}`, embeds: [errEmbed] });
        }
        
    }
};
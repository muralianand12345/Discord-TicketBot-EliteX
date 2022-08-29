const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const RoleID = require("../config.json").VOTE.ROLE_ID;
const { MessageEmbed, MessageActionRow } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Custom voting (Only Admins)')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Your vote poll message here')
            .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString('text');

        const commandName = "VOTE";
        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`}
        )
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        function sendMsg() {
            const votechan = client.channels.cache.get(client.config.VOTE.CHAN_ID);
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setDescription(`\`\`\`${text}\`\`\``)

            const button = new MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setCustomId('vote1')
                .setEmoji("👍")
                .setStyle('SUCCESS'),

                new client.discord.MessageButton()
                .setCustomId('vote2')
                .setEmoji("👎")
                .setStyle('DANGER'),
            );
            votechan.send({ embeds: [embed], components: [button] }).then( async(message) => {
                await message.pin();
                await interaction.channel.bulkDelete(1);
            }).catch(err => console.log(err));
            
        }

        try{
            const User = interaction.member;
            if (User.roles.cache?.has(`${RoleID}`)) {
                sendMsg();
                interaction.reply({ content:"`Vote Sent Successfully!`",ephemeral: true });   
            } else {
                return await interaction.reply({ content:"This command is for admins only!",ephemeral: true });
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
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('darkchat')
        .setDescription("Send's anonymous chat")
        .addStringOption(option =>
            option.setName('text')
            .setDescription('Your message here! (Use `\\n` for new line)')
            .setRequired(true)),
    async execute(interaction, client) {

        const text = interaction.options.getString('text') || "No Text";

        const commandName = "DARK_CHAT";

        const logEmbed = new MessageEmbed()
        .setColor("GREEN")
        .addFields(
            { name: "Command", value: `${commandName}`},
            { name: "User", value: `<@!${interaction.user.id}>`},
            { name: "Channel", value: `<#${interaction.channel.id}>`},
            { name: "Text Message", value: `${text}`}
        )
        
        client.channels.cache.get(client.config.ERR_LOG.CHAN_ID).send({ embeds: [logEmbed]});

        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {

                const chan_id = client.config.DARK_CHAT.CHAN_ID;
                const channel = client.channels.cache.get(chan_id);

                /*const embed = new MessageEmbed()     
                .setTitle('Anonymous')    
                .setColor('#0099ff');*/
    
                const webhooks = await channel.fetchWebhooks();    
                const webhook = webhooks.find(wh => wh.token);

                //searchs if there is any active webhook in the channel (Must create a webhook in the channel)
                if (!webhook) {     
                    return interaction.reply({ content: 'No webhook was found that I can use!', ephemeral: true});    
                }

                await webhook.send({     
                    content: text,      
                    username: 'Anonymous User',     
                    avatarURL: 'https://thumbs.dreamstime.com/b/illegal-stamp-illegal-round-grunge-stamp-illegal-sign-illegal-136960672.jpg',      
                    //embeds: [embed],    
                });

                interaction.reply({ content: "`Anonymous Message Has Been Sent`", ephemeral: true});
                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);  
            }          

        } catch(err) {
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
        
    }
};

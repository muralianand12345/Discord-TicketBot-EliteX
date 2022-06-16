const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const cooldown = new Set();
const cooldownTime = 10000; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("Send's The User's Avatar")
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User Name')
            .setRequired(false)),
    async execute(interaction, client) {
        const logMsg = `Command Used: \`AVATAR\` \nUser: <@!${interaction.user.id}> \nChannel: <#${interaction.channel.id}>`;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        try {
            if (cooldown.has(interaction.user.id)) {
                return interaction.reply({ content: "`Settle Down Buddy! Try After Few Minutes! (Cooldown)`", ephemeral: true });
                
            } else {
                const user = interaction.options.getMember('user') || interaction.member;
                await user.user.fetch(true);

                const embed = new MessageEmbed()
                .setColor('BLURPLE')
                .setImage(
                    user.displayAvatarURL({ dynamic: true }) || 'https://i.pinimg.com/736x/35/79/3b/35793b67607923a68d813a72185284fe.jpg'
                )
                
                await interaction.reply({   
                    content: `Here is <@!${user.id}> avatar.`,
                    embeds: [ embed ]
                });

                cooldown.add(interaction.user.id);
                setTimeout(() => {
                    cooldown.delete(interaction.user.id);
                }, cooldownTime);  
            }          

        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\n${logMsg}`);
        }
        
    }
};
const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const memes = require("random-memes");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription("Sends Random Meme LMAFOO"),

    async execute(interaction, client) {
        const logMsg = `Command Used: \`MEME\` \nUser: \`${interaction.user.id}\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\``;
        client.channels.cache.get(client.config.errorLog).send(logMsg);

        try {
            memes.random().then(meme => {
                interaction.reply({content: meme.image, ephemeral: true});
            });

        } catch(err) {
            const errTag = client.config.errTag;
            client.channels.cache.get(client.config.errorLog).send(`**ERROR!** ${errTag} \n${err}\nCommand: \`INVITE\` \nChannel: \`${interaction.channel.id} (${interaction.channel.name})\` \n User: \`${interaction.user.id}\`\n`);
        }
    }
};
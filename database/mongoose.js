const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');

module.exports = {
    name: 'ready',
    async execute(client) {
        mongoose.connect(process.env.MONGO_SRV, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() =>{
            const err_log=client.channels.cache.get(client.config.errorLog)
        
            const embed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle(`Connected to the Database ❤️`)
                .setTimestamp();
            err_log.send({embeds:[embed]});
        }).catch((err) => {
            const errTag = client.config.errTag;
            const errEmbed = new MessageEmbed()
                .setTitle("ERROR")
                .setColor("RED")
                .setDescription(`MongoDB is not connected!\n${err}`)
            client.channels.cache.get(client.config.errorLog).send({ content: `${errTag}`, embeds: [errEmbed] });
        });

    }
}

module.exports = {
    name: 'ready',
    execute(client) {
        console.log(`${client.user.tag} Bot is ready to rock n roll!`);
        console.log('Developed For EliteX Rp <3');
        //activity
        client.user.setActivity(`Your Queries 24/7!`, { type: "LISTENING" });     
        
    },
};
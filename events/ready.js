module.exports = {
    name: 'ready',
    execute(client) {
        const activities = [
            "Your Queries 24/7!",
            "Your Queries 24/7!",
            "Your Queries 24/7!",
            "Your Ticket",
            "Music and Vibing",
            "OwnerPlayz's Command"
          ];
        console.log(`${client.user.tag} Bot is ready to rock n roll!`);
        console.log('Developed For EliteX Rp <3');

        setInterval(() => {
            const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
            const newActivity = activities[randomIndex];
            client.user.setActivity(newActivity,{ type : "LISTENING"});
        }, 5000);
    },
};

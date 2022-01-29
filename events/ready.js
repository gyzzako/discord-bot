const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = {
    name: "ready",
    once: true,
    async execute(client, commands){
        console.log("Bot on");
        client.user.setActivity("Type \'/help\' for help");
        
        const clientId = process.env.BOT_ID;
        const guildId = process.env.GUILD_ID;
    
        const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    
        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');
        
                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: commands },
                );
        
                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}
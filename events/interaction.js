const { client } = require("../index");

module.exports = {
    name: "interactionCreate",
    async execute(interaction){
        if (!interaction.isCommand()) return;

        if(interaction.channelId != "607713780654407681"){
            const channel = await client.channels.fetch("607713780654407681");
            return await interaction.reply({content: `❌ | Commands must be done in ${channel.name} channel !`, ephemeral: true})
        } 

        const command = interaction.client.commands.get(interaction.commandName);
    
        if(!command) return;

        if(command.permissions && command.permissions.length > 0){
            if(!interaction.member.permissions.has(command.permissions)) return await interaction.reply({content: "❌ | You are not authorized to perform this command !", ephemeral: true})
        }
    
        try{
            await command.execute(interaction);
        }catch(e){
            if(e) console.error(e);
    
            await interaction.reply({
                content: "An error occurred while executing that command !",
                ephemeral: true
            });
        }
    }
}
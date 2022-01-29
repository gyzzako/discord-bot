module.exports.loadMusicPlayerEvents = async (player) => {
    player.on("trackStart", (queue, track) => {
        if(track.playlist){
            queue.metadata.channel.send(`🎶 | Now playing **${track.title}** from **${track.author}** !`);
        }else{
            queue.metadata.channel.send(`🎶 | Now playing **${track.title}** !`);
        }
    });
    
    player.on("error", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
    });
    player.on("connectionError", (queue, error) => {
        console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
    });
    
    player.on("trackAdd", (queue, track) => {
        queue.metadata.channel.send(`🎶 | Track **${track.title}** queued !`);
    });
    
    player.on("botDisconnect", (queue) => { //TODO: check discord-player if bug is resolved (event never emitted)
        queue.metadata.channel.send("❌ | I was manually disconnected from the voice channel, clearing queue !");
    });
    
    player.on("channelEmpty", (queue) => { //TODO: check discord-player if bug is resolved (event never emitted)
        queue.metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
    });
    
    player.on("queueEnd", (queue) => {
        queue.metadata.channel.send("✅ | Queue finished !");
    });
}
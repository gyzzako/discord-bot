const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");
const { player } = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song")
    .addStringOption(option => 
		option.setName("query")
			.setDescription("The song you want to play")
			.setRequired(true)),

	async execute(interaction){
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel !", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel !", ephemeral: true });

        await interaction.deferReply();
        
        const query = interaction.options.get("query").value;
        const searchResult = await player
            .search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});
        if (!searchResult || !searchResult.tracks.length) return await interaction.followUp({ content: "❌ | No results were found !" });

        const queue = await player.createQueue(interaction.guild, {
            ytdlOptions: {
                filter: 'audioonly',
                highWaterMark: 1 << 30
            },
            metadata: {
                channel: interaction.channel
            }
        });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel); //TODO: check if discord-player lib is fixed (connection still alive when kicking bot from channel)
        } catch {
            player.deleteQueue(interaction.guildId);
            return await interaction.followUp({ content: "Could not join your voice channel !" });
        }

        await interaction.followUp({ content: `⏱ | Loading your ${searchResult.playlist ? 'playlist' : 'track'}...` });
        if(searchResult.playlist){
            queue.addTracks(searchResult.tracks)
            await interaction.followUp({ content: `👉 Playlist | https://open.spotify.com/embed/playlist/${searchResult.playlist.id}` });
        }else{
            queue.addTrack(searchResult.tracks[0]);
        }
        if (!queue.playing) await queue.play();
	}
}
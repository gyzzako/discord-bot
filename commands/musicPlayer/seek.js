const { SlashCommandBuilder } = require("@discordjs/builders");
const { player } = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek the current song to the given time (seconds)")
    .addIntegerOption(option => 
		option.setName("time")
			.setDescription("Time to seek in second")
			.setRequired(true)),

	async execute(interaction){
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel !", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel !", ephemeral: true });

        await interaction.deferReply();

        const timeInSecond = interaction.options.get("time").value;
        
        const queue = player.getQueue(interaction.guildId);
        if (!queue || !queue.playing) return await interaction.followUp({ content: '❌ | No music is being played!' });
        
        const timeInMillis = timeInSecond * 1000;
        await queue.seek(timeInMillis);
        
        await interaction.followUp({ content: `✅ | Seeked to ${timeInMillis / 1000} seconds` });
	}
}
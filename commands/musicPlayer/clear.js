const { SlashCommandBuilder } = require("@discordjs/builders");
const { player } = require("../../index");

module.exports = {
	data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear the queue"),

	async execute(interaction){
		if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel !", ephemeral: true });
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel !", ephemeral: true });

        await interaction.deferReply();

        const queue = await player.getQueue(interaction.guildId);
        if (!queue) return await interaction.followUp({ content: '❌ | No music in the queue!' });
    
        queue.clear();
        await interaction.followUp({ content: '❌ | Queue cleared.' });
	}
}
const { SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName("delete")
	.setDescription("Delete messages")
	.addIntegerOption(option => 
		option.setName("amount")
			.setDescription("Amount of message you want to delete")
			.setRequired(true)),

	async execute(interaction){
		const amount = !isNaN(interaction.options.getInteger("amount")) ? interaction.options.getInteger("amount") : undefined ;
		if(!amount) return interaction.reply({
			content: "Enter a number !",
			ephemeral: true
		});

		if(amount < 1 || amount > 31) return interaction.reply({
			content: "Enter a number between 1 and 30 !",
			ephemeral: true
		});

		if(interaction.member.roles.cache.has('402133041474043905') || message.member.roles.cache.has('703988666657276026')){ //TODO: adapt for multi guild
			const response = new MessageEmbed().setColor("BLUE");
			try{
				const {size} = await interaction.channel.bulkDelete(amount, true)
				response.setDescription(`🧹 Cleared ${size} messages from this channel.`)
				interaction.reply({embeds: [response], ephemeral: true});
			}catch(e){
				if(e){
					console.error(e);
					interaction.reply({
						content: e.message,
						ephemeral: true
					});
				}
			}
		
		}else{
			return message.reply("You don't have permission");
		}
	},
	permissions: [Permissions.FLAGS.ADMINISTRATOR]
}

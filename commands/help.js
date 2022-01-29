const { SlashCommandBuilder} = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName("help")
	.setDescription("Display all authorized commands"),

	async execute(interaction){
		const commands = Array.from(interaction.client.commands);
    
        if(!commands) return await interaction.reply({content: "No command found !", ephemeral: true });

		const commandEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Commands list')
		.setFooter({ text: 'Developped by Gyzzako'});

		const memberPermissions = interaction.member.permissions;

		let currentCategory;
		let embedField = {};
		let i = 0;
		commands.forEach(command => {
			if(!command[1].permissions || command[1].permissions.length > 0 && memberPermissions.has(command[1].permissions)){
				if(currentCategory !== command[1].category){
					currentCategory = command[1].category;
					embedField.value = "";
					embedField.name = `${currentCategory}`;
					embedField.value += `${command[0]} | `;
				}else{
					embedField.value += `${command[0]} | `;
				}

				const nextCommand = commands[i+1];
				if(nextCommand === undefined || (command[1].category !== nextCommand[1].category)){ //if no next command or if current category is different of the one of the next command
					let formattedValue = embedField.value.slice(0, embedField.value.length-3);
					formattedValue = "`" + formattedValue + "`";
					commandEmbed.addField(embedField.name, formattedValue);
				}
			}
			i++;
		})
		await interaction.reply({embeds: [commandEmbed], ephemeral: true });
    }
}

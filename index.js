require('dotenv').config()
const fs = require("fs");
const { Client, Intents, Collection } = require('discord.js');
const { Player } = require("discord-player");
require("discord-player/smoothVolume");
const { loadMusicPlayerEvents } = require("./events/musicPlayer");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.commands = new Collection;
const commands = [];

const player = new Player(client);
loadMusicPlayerEvents(player);

fs.readdir('./commands/', async (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const command = require(`./commands/${file}`);
		const cmdName = command.data.name;
		command.category = "base";
		console.info(`<- ${cmdName} command loaded ->`);
		client.commands.set(cmdName, command);
		commands.push(command.data.toJSON())
	});
});

fs.readdir('./commands/musicPlayer/', async (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const command = require(`./commands/musicPlayer/${file}`);
		const cmdName = command.data.name;
		command.category = "music";
		console.info(`<- ${cmdName} command loaded ->`);
		client.commands.set(cmdName, command);
		commands.push(command.data.toJSON())
	});
});

fs.readdir('./commands/moderation/', async (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const command = require(`./commands/moderation/${file}`);
		const cmdName = command.data.name;
		command.category = "moderation";
		console.info(`<- ${cmdName} command loaded ->`);
		client.commands.set(cmdName, command);
		commands.push(command.data.toJSON())
	});
});

fs.readdir('./events/', async (err, files) => {
	if (err) return console.error;
	files.forEach(file => {
		if (!file.endsWith('.js')) return;
		const event = require(`./events/${file}`);
		if(event.name){
			if(event.once){
				client.once(event.name, (...args) => event.execute(...args, commands))
			}else{
				client.on(event.name, (...args) => event.execute(...args))
			}
		}
	});
});

client.on("error", console.error);
client.on("warn", console.warn);

client.login(process.env.BOT_TOKEN);

module.exports = {
	player: player,
	client: client
}
const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const dynamicChannels = require('./commands/new-channel-generator').dynamicChannels;

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	const fileBuffer = fs.readFileSync('./db/dynamicChannels.json');
	if (fileBuffer.length) {
		Object.assign(dynamicChannels, JSON.parse(fileBuffer));
	}

	client.user.setActivity('bb!help', { type: 'LISTENING' });

	console.log('Ready!');
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command =
		client.commands.get(commandName) ||
		client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// check if is a server only command
	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply("I can't execute that command inside DMs!");
	}

	// check if args validity
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(
				`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`,
			);
		}
	} else {
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('voiceStateUpdate', (oldState, newState) => {
	const newStateChannel = newState.channel;
	const oldStateChannel = oldState.channel;

	// user joins
	if (newStateChannel != undefined && dynamicChannels[newStateChannel.id]) {
		newStateChannel.guild.channels
			.create(`${newState.member.displayName}'s channel`, {
				type: 'voice',
				parent: dynamicChannels[newStateChannel.id],
			})
			.then((createdChannel) => {
				newState.setChannel(createdChannel.id);
			});
	}
	// user leaves
	if (
		// veio de um canal
		oldStateChannel != undefined &&
		// parent é uma categoria geradora
		Object.values(dynamicChannels).find((value) => value === oldStateChannel.parentID) &&
		// nao é um canal gerador
		!dynamicChannels[oldStateChannel.id] &&
		// está vazio
		!oldStateChannel.members.size
	) {
		oldStateChannel
			.delete('bot deleted: empty channel from generator')
			.catch((error) => console.log('unable to delete empty channel: ', error));
	}
});

client.on('channelDelete', (channel) => {
	const parentId = dynamicChannels[channel.id];
	if (parentId) {
		const parentChannel = channel.client.channels.cache.get(parentId);
		if (parentChannel) {
			parentChannel.delete('bot: child deleted');
			delete dynamicChannels[channel.id];
			saveToCache();
		}
	}

	const findResult = Object.entries(dynamicChannels).find(([key, value]) => value === channel.id);
	const childId = findResult && findResult.length && findResult[0];

	if (childId) {
		const childChannel = channel.client.channels.cache.get(childId);
		if (childChannel) {
			childChannel.delete('bot: parent deleted');
			delete dynamicChannels[childId];
			saveToCache();
		}
	}
});

function saveToCache() {
	fs.writeFile('./db/dynamicChannels.json', JSON.stringify(dynamicChannels), (err) => {
		if (err) {
			console.log(err);
		}
	});
}

client.login(process.env.BOT_TOKEN); // BOT_TOKEN is the Client Secret
// client.login(token);

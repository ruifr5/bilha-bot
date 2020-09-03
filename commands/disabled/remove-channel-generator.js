// const Discord = require('discord.js');
// const client = new Discord.Client();
// const dynamicChannels = require('./new-channel-generator');

// NAO IMPLEMENTADO E PROVAVELMENTE NAO VAI SER <-----------------------------------------------
module.exports = {
	name: 'remove-channel-generator',
	description: 'Removes an active channel generator',
	cooldown: 5,
	aliases: ['rcg'],
	execute(message, args) {
		if (!args.length) {
			return message.channel.send(`You need to type a name, ${message.author}!`);
		}
		// console.log(message.guild.channels.find((channel) => channel.name === 'teste').id);
	},
};

// client.on('message', (message) => {
// 	console.log(message.client.channels.find((channel) => channel.name === 'teste').id);
// });

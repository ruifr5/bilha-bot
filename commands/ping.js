module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	aliases: ['p'],
	execute(message) {
		message.channel.send('Pong.');
	},
};

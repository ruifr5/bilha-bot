const viados = ['Kenji', 'Averse', 'wckD', 'UTU'];

module.exports = {
	name: 'viado',
	skipHelp: true,
	execute(message) {
		const random = Math.floor(Math.random() * Math.floor(viados.length));

		message.channel.send(`O maior é o Sunfong, com o ${viados[random]} em segundo lugar.`);
	},
};

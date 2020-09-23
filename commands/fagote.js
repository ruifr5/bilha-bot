const fagotes = ['Kenji', 'Averse', 'wckD', 'UTU'];

module.exports = {
	name: 'fagote',
	skipHelp: true,
	execute(message) {
		const random = Math.floor(Math.random() * Math.floor(fagotes.length));

		message.channel.send(`O maior fagote é o ${fagotes[random]}, sempre foi.`);
	},
};

const fagotes = ['Kenji', 'Averse', 'wckD'];

module.exports = {
	name: 'fagote',
	skipHelp: true,
	execute(message) {
		const random = Math.floor(Math.random() * Math.floor(3));

		message.channel.send(`O maior fagote é o ${fagotes[random]}, sempre foi.`);
	},
};

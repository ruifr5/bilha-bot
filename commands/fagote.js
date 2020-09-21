const fagotes = ['Kenji', 'Averse', 'wckD'];

module.exports = {
	name: 'fagote',
	skipHelp: true,
	execute(message) {
		const random = Math.floor(Math.random() * Math.floor(3));

		message.reply(`O maior fagote é o ${fagotes[random]}, sempre foi.`, { disableMentions: 'all' });
	},
};

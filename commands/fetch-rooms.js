const firebase = require('../db/firebaseService');
const dynamicChannels = require('../commands/new-channel-generator').dynamicChannels;

module.exports = {
	name: 'fetch-rooms',
	description: 'Fetches rooms list from the DB. (Possibly fixes bot malfunction)',
	cooldown: 5,
	aliases: ['fr'],
	execute(message) {
		firebase.getAllChannels((data) => {
			Object.assign(dynamicChannels, data);
			message.channel.send('Data fetched.');
		});
	},
};

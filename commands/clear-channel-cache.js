const { dynamicChannels } = require('./new-channel-generator');
const firebase = require('../db/firebaseService');

module.exports = {
	name: 'clear-channel-cache',
	description: 'Remove old channel info from cache.',
	aliases: ['ccc'],
	skipHelp: true,
	execute(message) {
		// filter old info
		const updatedList = Object.entries(dynamicChannels)
			.filter(([key]) => message.client.channels.cache.get(key))
			.map(([key, value]) => {
				return { [key]: value };
			})
			.reduce((prev, curr) => Object.assign(prev, curr), {});

		// update runtime cache
		deleteAllProperties(dynamicChannels);
		Object.assign(dynamicChannels, updatedList);

		// update offline cache
		firebase.overwriteAllChannels(updatedList);
	},
};

function deleteAllProperties(o) {
	Object.keys(o).forEach((key) => delete o[key]);
}

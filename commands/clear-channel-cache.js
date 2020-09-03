const { dynamicChannels } = require('./new-channel-generator');
const fs = require('fs');

module.exports = {
	name: 'clear-channel-cache',
	description: 'Remove old channel info from cache.',
	aliases: ['ccc'],
	execute(message) {
		const updatedList = Object.entries(dynamicChannels)
			.filter(([key]) => message.client.channels.cache.get(key))
			.map(([key, value]) => {
				return { [key]: value };
			})
			.reduce((prev, curr) => Object.assign(prev, curr), {});
		fs.writeFile('./db/dynamicChannels.json', JSON.stringify(updatedList), (err) => {
			if (err) {
				message.channel.send('Failed to clear cache.');
				console.log(err);
			}
		});
	},
};

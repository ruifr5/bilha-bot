const dynamicChannels = {};
const firebase = require('../db/firebaseService');

module.exports = {
	name: 'new-channel-generator',
	description: 'Creates a dynamic channel generator.',
	aliases: ['ncg'],
	dynamicChannels,
	execute(message, args) {
		if (!message.member.hasPermission(['MANAGE_CHANNELS'], { checkAdmin: true, checkOwner: true })) {
			return message.channel.send('You do not have permission to execute that command.');
		}
		const generatorName = (args[0] && args.join(' ')) || 'Channel Generator';
		const guildChannelManager = message.guild.channels;

		guildChannelManager
			.create(generatorName, {
				type: 'category',
			})
			.then(({ id: createdCategoryId }) =>
				guildChannelManager
					.create('Create new channel', {
						type: 'voice',
						parent: createdCategoryId,
					})
					.then((createdChannel) => {
						dynamicChannels[createdChannel.id] = createdCategoryId;
						if (Object.keys(dynamicChannels).length > 500) {
							message.client.commands.get('clear-channel-cache').execute(message);
						} else {
							firebase.addChannelPair(createdChannel.id, createdCategoryId);
						}
					})
					.catch((error) => {
						console.log('erro a criar canal: ', error);
					}),
			)
			.catch((error) => {
				message.channel.send('Error creating generator.');
				console.log('erro a criar canal: ', error);
			});
	},
};

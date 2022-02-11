const admin = require('firebase-admin');

// todo: implementar failsafe para caso de falha de fetch on init da app

admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
	databaseURL: 'https://billha-bot.firebaseio.com',
	authDomain: 'billha-bot.firebaseapp.com',
});

const db = admin.database();
const channelsRef = db.ref('channels');

function getAllChannels(callback) {
	channelsRef.once('value', (snapshot) => callback && callback(snapshot.val()));
}

function getChannelPair(child, callback) {
	const oneChannel = channelsRef.child(child);
	oneChannel.once('value', (snapshot) => callback && callback(snapshot.val()));
}

function overwriteAllChannels(list) {
	channelsRef.set(list);
}

function addChannelPair(child, parent) {
	const oneChannel = channelsRef.child(child);
	oneChannel.set(parent);
}

function removeChannelPair(child, callback) {
	const oneChannel = channelsRef.child(child);
	oneChannel.remove().then(() => callback && callback());
}

function getJaAbriuMessages(callback) {
	const oneChannel = db.ref('jaabriu');
	oneChannel.once('value', (snapshot) => callback && callback(snapshot.val()));
}

module.exports = { getChannelPair, getAllChannels, overwriteAllChannels, addChannelPair, removeChannelPair, getJaAbriuMessages };

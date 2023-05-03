const { client } = require(`../index.js`);
const { ActivityType } = require(`discord.js`);

module.exports = {
	name: 'ready',
	once: true,
	async execute() {
		console.log(`${client.user.username} is now online.`);
		client.user.setPresence({
			activities: [{ name: `Echoustics`, type: ActivityType.Listening }]
		});
	},
};
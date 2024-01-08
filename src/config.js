module.exports = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
		token: process.env.CLIENT_TOKEN,
	},
	database: {
		uri: process.env.MONGO_URI,
	},
	devLogs: {
		guildJoin: '1194007487557419078',
		guildLeave: '1194007550002212934',
		commands: '1194007592863801444'
	}
};
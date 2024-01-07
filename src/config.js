module.exports = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
		token: process.env.CLIENT_TOKEN,
	},
	database: {
		uri: process.env.MONG_URI,
	},
};
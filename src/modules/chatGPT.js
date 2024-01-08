const axios = require('axios');

module.exports = async (msg) => {
	const apiUrl = `https://api.gglvxd.eu.org/v3/chatgpt?q=${encodeURIComponent(msg)}`;
	const req = await axios.get(apiUrl);
	const response = req.body.chat;
	if (!response) return;
	return response;
};
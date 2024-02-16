const getRandomNumber = (length) => Math.floor(Math.random() * length);

const text = (words) => {
	const response = [];

	for (let i = 0; i <= words.length; i++) {
		response.push(words[getRandomNumber(words.length)]);
	}

	return response;
};

module.exports = text;

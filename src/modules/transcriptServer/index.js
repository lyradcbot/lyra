const cheerio = require('cheerio');
const express = require('express');
const axios = require('axios');

const app = express();
const port = 80;

function isBotGenerated (html) {
	const $ = cheerio.load(html);

	const profiles = $('script').filter((i, el) => {
		const scriptContent = $(el).html();
		return scriptContent.includes('$discordMessage={profiles:');
	});

	if (profiles.length === 0) {
		return false;
	}

	const scriptContent = profiles.html();
	const botProfileIndex = scriptContent.indexOf('"bot":true');

	if (botProfileIndex === -1) {
		return false;
	}

	const discordScript = $('script[src*="discord-components-core"]').length > 0;

	return discordScript;
}

app.get('/transcript', async (req, res) => {
	try {
		const link = req.query.link;

		if (!link) {
			return res.status(400).send('Parâmetro "link" ausente na URL.');
		}

		const response = await axios.get(link);

		const isGeneratedByBot = isBotGenerated(response.data);

		if (!isGeneratedByBot) {
			return res.status(400).send('A mensagem não foi gerada por um bot.');
		}

		res.send(response.data);
	}
	catch (error) {
		console.error(error);
		res.status(500).send('Erro interno do servidor.');
	}
});

app.get('*', async (req, res) => {
	res.redirect('https://lyrabot.online');
});

app.listen(port, () => {
	console.log(`[TRANSCRIPT] Servidor rodando em http://localhost:${port}`.green);
});

const cheerio = require('cheerio');
const fastify = require('fastify')();
const axios = require('axios');
const cors = require('@fastify/cors');

const port = 3000;

// Implementação de cache simples (pode precisar de ajustes)
const cache = new Map();

const isBotGenerated = (html) => {
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

	return botProfileIndex !== -1 && $('script[src*="discord-components-core"]').length > 0;
};

fastify.register(cors, {
	origin: '*',
});

fastify.get('/transcript', async (request, reply) => {
	try {
		const link = request.query.link;

		if (!link) {
			return reply.status(400).send('Parâmetro "link" ausente na URL.');
		}

		// Verificar cache
		const cachedData = cache.get(link);
		if (cachedData) {
			return reply.header('Content-Type', 'text/html').send(cachedData);
		}

		const response = await axios.get(link);

		const isGeneratedByBot = isBotGenerated(response.data);

		if (!isGeneratedByBot) {
			return reply.status(400).send('A mensagem não foi gerada por um bot.');
		}

		// Armazenar no cache e enviar resposta com Content-Type definido
		cache.set(link, response.data);
		reply.header('Content-Type', 'text/html').send(response.data);
	}
	catch (error) {
		console.error(error);
		reply.status(500).send('Erro interno do servidor.');
	}
});

fastify.get('*', async (request, reply) => {
	reply.code(404).send('Rota não encontrada');
});

// Inicie o servidor Fastify
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`[NAPPA] (transcript) Servidor rodando em ${address}`.green);
});

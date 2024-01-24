const fastify = require('fastify')({ logger: true });
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const port = 3000;

const cache = new Map();

fastify.get('/dieplague', async (request, reply) => {
	try {
		const avatarURL = request.query.avatar;

		if (!avatarURL) {
			return reply.status(400).send('Parâmetro "avatar" ausente na URL.');
		}

		// Verificar cache
		if (cache.has(avatarURL)) {
			return reply.header('Content-Type', 'image/png').send(cache.get(avatarURL));
		}

		// Caminho relativo para o arquivo dieplague.jpg
		const backgroundPath = path.join(__dirname, 'assets', 'images', 'dieplague.jpg');

		// Lê o arquivo diretamente em um buffer
		const backgroundBuffer = await sharp(backgroundPath).toBuffer();

		const avatarBuffer = await axios.get(avatarURL, { responseType: 'arraybuffer' });

		const background = await sharp(backgroundBuffer).toBuffer();
		const avatar = await sharp(avatarBuffer.data)
			.resize(150, 150)
			.toBuffer();

		const composite = await sharp(background)
			.composite([{ input: avatar, left: 50, top: 100 }])
			.toBuffer();

		// Armazenar no cache e enviar resposta com Content-Type definido
		cache.set(avatarURL, composite);
		return reply.header('Content-Type', 'image/png').send(composite);
	}
	catch (error) {
		console.error(error);
		return reply.status(500).send('Erro interno do servidor.');
	}
});

fastify.get('/laranjo', async (request, reply) => {
	try {
		const texto = request.query.text;

		if (!texto) {
		  return reply.status(400).send('Parâmetro "text" ausente na URL.');
		}

		// Verificar cache
		if (cache.has(texto)) {
		  const cachedImage = cache.get(texto);
		  return reply.header('Content-Type', 'image/png').send(cachedImage);
		}

		const canvas = createCanvas(685, 494);
		const ctx = canvas.getContext('2d');

		const background = await loadImage('./assets/laranjo.jpg');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.font = '30px sans-serif';
		ctx.fillStyle = '#000';
		ctx.fillText(texto.match(/.{1,50}/g).join('\n'), canvas.width / 50.9, canvas.height / 15.9, 655);

		// Convertendo a imagem para buffer
		const imageBuffer = canvas.toBuffer();

		// Armazenar no cache e enviar resposta com Content-Type definido
		cache.set(texto, imageBuffer);
		reply.header('Content-Type', 'image/png').send(imageBuffer);
	  }
	catch (error) {
		console.error(error);
		reply.status(500).send('Erro interno no servidor.');
	  }
});

// Inicie o servidor Fastify
fastify.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
	console.log(`[RADITZ] Servidor rodando em ${address}`.green);
});
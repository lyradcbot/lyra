const fastify = require('fastify')();
const axios = require('axios');
const sharp = require('sharp');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

const port = 3000;

const cache = new Map();

function greyscale (ctx, x, y, width, height) {
	const imageData = ctx.getImageData(x, y, width, height);
	const data = imageData.data;

	for (let i = 0; i < data.length; i += 4) {
	  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
	  data[i] = avg;
	  data[i + 1] = avg;
	  data[i + 2] = avg;
	}

	ctx.putImageData(imageData, x, y);
}

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


fastify.get('/perfeito', async (request, reply) => {
	try {
	  const userId = request.query.avatar;

	  if (!userId) {
			return reply.status(400).send('Parâmetro "avatar" ausente na URL.');
	  }

	  const cacheKey = `perfeito-${userId}`;

	  // Verificar cache
	  if (cache.has(cacheKey)) {
			return reply.header('Content-Type', 'image/png').send(cache.get(cacheKey));
	  }

	  // Caminho relativo para o arquivo perfeito.png
	  const backgroundPath = path.join(__dirname, 'assets', 'images', 'perfeito.png');

	  // Lê o arquivo diretamente em um buffer
	  const backgroundBuffer = await sharp(backgroundPath).toBuffer();

	  // Obtém a imagem do avatar do usuário
	  const userAvatarResponse = await axios.get(request.query.avatar, { responseType: 'arraybuffer' });
	  const avatarBuffer = Buffer.from(userAvatarResponse.data, 'binary');

	  // Redimensiona a imagem do avatar
	  const resizedAvatarBuffer = await sharp(avatarBuffer).resize(200, 200).toBuffer();

	  // Obtém a imagem da máscara redonda e redimensiona para as mesmas dimensões do avatar
	  const redondoBuffer = await sharp('./src/modules/imageServer/assets/images/mask.png').resize(200, 200).toBuffer();

	  // Compondo as imagens usando a máscara redonda
	  const compositeBuffer = await sharp(backgroundBuffer)
			.composite([{ input: resizedAvatarBuffer, left: 250, top: 60 }, { input: redondoBuffer, left: 250, top: 60 }])
			.toBuffer();

	  // Armazenar no cache e enviar resposta com Content-Type definido
	  cache.set(cacheKey, compositeBuffer);
	  return reply.header('Content-Type', 'image/png').send(compositeBuffer);
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

		const background = await loadImage('./src/modules/imageServer/assets/images/laranjo.jpg');
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

fastify.get('/undertalebox', async (request, reply) => {
	try {
		await registerFont('./src/modules/imageServer/assets/fonts/Minecraftia.ttf', { family: 'Minecraftia' });

		const texto = request.query.text;

		if (!texto) {
			return reply.status(400).send('Parâmetro "text" ausente na URL.');
		}

		if (!request.query.avatar) {
			return reply.status(400).send('Parâmetro "avatar" ausente na URL.');
		}

		// Verificar cache
		if (cache.has(texto)) {
			const cachedImage = cache.get(texto);
			return reply.header('Content-Type', 'image/png').send(cachedImage);
		}

		const base = await loadImage('./src/modules/imageServer/assets/images/undertalebox.png');
		const avatar = await loadImage(request.query.avatar);
		const canvas = createCanvas(base.width, base.height);
		const foto = canvas.getContext('2d');
		foto.drawImage(base, 0, 0);
		foto.font = '17px Minecraftia';
		foto.drawImage(avatar, 15, 15, 120, 120);
		foto.fillStyle = '#ffffff';
		foto.fillText(`${texto}`.match(/.{1,35}/g).join('\n'), canvas.width / 3.4, canvas.height / 2.7, 655);
		greyscale(foto, 0, 0, base.width, base.height);

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
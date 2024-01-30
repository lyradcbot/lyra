const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const os = require('os');
const pid = require('pidusage');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Developer related commands')
		.addSubcommand(subcommand =>
			subcommand
				.setName('info')
				.setDescription('Veja as informações do bot')),
	async execute  (interaction) {

		const andre = await client.users.fetch('742798447253651506');
		const adg = await client.users.fetch('717766639260532826');
		let cpu = await pid(process.pid).then(s =>{return s.cpu.toFixed(2) + ' %';});

		let idioma = {
			'botinfo': {
				'description': 'Olá {user}, eu sou a **{eu}**, uma bot Brasileira para o seu servidor. Estou alegrando **{total_servers} servidores** com mais de **{cmds} comandos** para você se divertir!\n\n - Eu fui criada em <:way_js:904741047668723722> [JavaScript](https://nodejs.org/en/) utilizando <:way_djs:904740985895018537> [Discord.js](https://discord.js.org/)',
				'title': 'Minhas informações!',
				'maquina': 'Informações da Máquina',
				'processador': 'Processador',
				'meadd': 'Me Adicione',
				'toadd': 'para me adicionar',
				'cliqueaqui': 'Clique [aqui]',
				'vote': 'Vote em mim',
				'tovote': 'para votar',
				'servidor': 'Meu servidor de Suporte',
				'log': 'para entrar no meu servidor de suporte',
				'agradecimento': 'Agradeço ao **`{andre}`**, **`{adg}`** por terem me desenvolvido.\n- Agradeço a todas as pessoas** que utilizaram minhas funções\n- Agradeço a todos os **Administradores e donos** dos meus **{total_servers} servidores** por me adicionarem\n- E agradeço a você **{user}**, por estar usando meus comandos :heart:',
				'agradeco': 'Agradecimentos:'
			},
		};

		const embed = new EmbedBuilder()
			.setTitle(idioma.botinfo.title)
			.setColor('#6c92e4')
			.setDescription(`> ${idioma.botinfo.description.replace(/{user}/g, interaction.user).replace(/{eu}/g, client.user.username).replace(/{total_servers}/g, client.guilds.cache.size).replace(/{cmds}/g, client.commands.size)}`)
			.addFields({
				name: `<:server:925053236862406696> ${idioma.botinfo.maquina}`,
				value: `> RAM: **${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB / ${Math.round((os.totalmem() / 1024 / 1024).toFixed(2) / 1024)} GB**\n> CPU: **${cpu}**\n> ${idioma.botinfo.processador}: **${os.cpus()[0].model}**`,
				inline: false
			},
			{
				name: `<:add:925040703229268030> ${idioma.botinfo.meadd}`,
				value: `${idioma.botinfo.cliqueaqui}(https://discord.com/api/oauth2/authorize?client_id=850403894374694913&permissions=429966879974&scope=bot%20applications.commands) ${idioma.botinfo.toadd}`,
				inline: true
			},
			{
				name: `<:upvote:925040657356161136> ${idioma.botinfo.vote}`,
				value: `${idioma.botinfo.cliqueaqui}(https://top.gg/bot/850403894374694913/vote) ${idioma.botinfo.tovote}`,
				inline: true
			},
			{
				name: `<:way_correto:900128012517924914> ${idioma.botinfo.servidor}`,
				value: `${idioma.botinfo.cliqueaqui}(https://discord.com/invite) ${idioma.botinfo.log}`,
				inline: true
			},
			{
				name: `🏆 ${idioma.botinfo.agradeco}`,
				value: `- ${idioma.botinfo.agradecimento.replace(/{user}/g, interaction.user).replace(/{andre}/g, andre.tag).replace(/{adg}/g, adg.tag).replace(/{total_servers}/g, client.guilds.cache.size)}`,
				inline: false
			});


		interaction.reply({ embeds: [embed] });
	}
};

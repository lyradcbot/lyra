const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const array = require('../../modules/type-words');
const text = require('../../modules/type-random');
const type = require('../../database/schemas/type');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('type')
		.setDescription('teste').addSubcommand(subcommand =>
			subcommand
				.setName('play')
				.setDescription('Quer testar a sua velocidade ao digitar ?')).addSubcommand(subcommand =>
			subcommand
				.setName('leaderboard')
				.setDescription('Veja o rank de jogadores de type.')).addSubcommand(subcommand =>
			subcommand
				.setName('estatisticas')
				.setDescription('Veja as estatísticas de jogadores de type.')),
	async execute (interaction) {


		let user = interaction.options.getUser('user') || interaction.user;

		if (interaction.options.getSubcommand() == 'play') {

			let sm = text(array);

			let t = sm.replace(/a/g, '𝗮')
				.replace(/b/g, '𝗯')
				.replace(/c/g, '𝗰')
				.replace(/d/g, '𝗱')
				.replace(/e/g, '𝗲')
				.replace(/f/g, '𝗳')
				.replace(/g/g, '𝗴')
				.replace(/h/g, '𝗵')
				.replace(/i/g, '𝗶')
				.replace(/j/g, '𝗷')
				.replace(/k/g, '𝗸')
				.replace(/l/g, '𝗹')
				.replace(/m/g, '𝗺')
				.replace(/n/g, '𝗻')
				.replace(/o/g, '𝗼')
				.replace(/p/g, '𝗽')
				.replace(/q/g, '𝗾')
				.replace(/r/g, '𝗿')
				.replace(/s/g, '𝘀')
				.replace(/t/g, '𝘁')
				.replace(/u/g, '𝘂')
				.replace(/v/g, '𝘃')
				.replace(/w/g, '𝘄')
				.replace(/x/g, '𝘅')
				.replace(/y/g, '𝘆')
				.replace(/z/g, '𝘇');
			/*
    .replace(/á/g, '𝗮́')
    .replace(/é/g, '𝗲́')
    .replace(/í/g, '𝗶́')
    .replace(/ó/g, '𝗼́')
    .replace(/ú/g, '𝘂́')

    .replace(/à/g, '𝗮̀')
    .replace(/è/g, '𝗲̀')
    .replace(/ì/g, '𝗶̀')
    .replace(/ò/g, '𝗼̀')
    .replace(/ù/g, '𝘂̀')

    .replace(/ã/g, '𝗮̃')
    .replace(/õ/g, '𝗼̃')

    .replace(/â/g, '𝗮̂')
    .replace(/ê/g, '𝗲̂')
    .replace(/î/g, '𝗶̂')
    .replace(/ô/g, '𝗼̂')
    .replace(/û/g, '𝘂̂');
*/


			if(user.id == interaction.user.id) {

				const desafio = new EmbedBuilder()
					.setColor('#cd949d')
					.setDescription(`> Você quer testar sua velocidade ??? Escreva exatamente **toda a frase abaixo** o mais rapido que conseguir <:tempo:932311408949993502>\n\n \`${t}\``)
					.setTitle(`<:teclado2:932311688559091803>  Desafio Type de \`${user.tag.replace(/`/g, '')}\``)
					.setFooter({ text: `${Math.floor(Math.random() * 2) == 0 ? 'Você sabia que você pode jogar contra um amigo ? Insira o ID dele nas opções do comando' : 'Está com curiosidade de saber quais são os melhores jogadores de type ? Veja em /type-leaderboard'}`, iconURL: user.displayAvatarURL() });

				interaction.reply({ embeds: [desafio] });
				sm = sm.replace(/ㅤㅤ/g, '');
				const filter = m => m.author.id == interaction.user.id;

				const collector = interaction.channel.createMessageCollector({ filter, time: 300000, max: 1 });
				let start = new Date().getTime();
				collector.on('collect', (m) => {
					let record;
					if(m.content.toLowerCase() !== sm) {
						const um = m.content;
						const dois = sm;

						const d = [];

						const ss1 = um.split(' ');
						const ss2 = dois.split(' ');

						const check = (s1, s2) => {
							let words = Math.abs(ss2.length - ss1.length);

							if(words > 1) {
								words = words + ' palavras';
							}
							else {
								words = words + ' palavra';
							}

							if(ss1.length < ss2.length) return d.push(`Detectamos que você não digitou ${words}`);
							if(ss1.length > ss2.length) return d.push(`Detectamos que você ${words} a mais no seu texto`);
							for (const p1 in s1) {
								if (!s2[p1]) {
								// eslint-disable-next-line
                        d.push('Ficou faltando a palavra ' + '"' + s1[p1] + '"' + ' no seu texto');
								}
								else if (s1[p1] !== s2[p1]) {

									d.push(s1[p1] + ' é diferente de ' + s2[p1]);
								}
							}
						};


						check(ss1, ss2);

						let end = new Date().getTime();
						let e = end - start;
						let time = Math.round(e / 1000);

						record = 0;
						if(record > 100) record = 100;

						type.findOne({ user: user.id }).then(async (data10) => {
							if(!data10) {
								new type({
									user: user.id,
									vezessolo: 1,
									vezesmult: 0,
									recordsolo: 0,
									recordmult: 0,
									score: record,
								}).save();
							}
							else {
								data10.vezessolo = data10.vezessolo + 1;
								data10.score = data10.score + record;
								data10.save();
							}

						});


						const desafio2 = new EmbedBuilder()
							.setColor('#cd949d')
							.setDescription(`> Infelizmente você não digitou as palavras de forma correta, sinto muito.\n\n- **Seu tempo:** \`${time}s\`\n- **Pontuação:** \`${record}\`\n\nDiferenças em sua mensagem:\n\`\`\`${d.join('\n').replace(/`/g, '')} \`\`\``)
							.setTitle(`<:teclado2:932311688559091803>  Desafio Type de \`${user.tag.replace(/`/g, '')}\``)
							.setFooter({ text: `${Math.floor(Math.random() * 2) == 0 ? 'Você sabia que você pode jogar contra um amigo ? Insira o ID dele nas opções do comando' : 'Está com curiosidade de saber quais são os melhores jogadores de type ? Veja em /type-leaderboard'}`, iconURL: user.displayAvatarURL() });

						return interaction.followUp({ embeds: [desafio2] });
					}

					type.findOne({ user: user.id }).then(async (data) => {

						let end = new Date().getTime();
						let e = end - start;
						let time = Math.round(e / 1000);
						record = Math.round(m.content.length * 100 / time * 2);


						if(!data) {
							new type({
								user: user.id,
								vezessolo: 1,
								vezesmult: 0,
								recordsolo: time,
								recordmult: 0,
								score: record
							}).save();
						}
						else {
							data.vezessolo = data.vezessolo + 1;
							if(data.recordsolo == 0) {
								data.recordsolo = time;
							}
							else if(time < data.recordsolo) {
								interaction.channel.send(`<:confete:932369805451862056> Parabéns ${interaction.user}, você superou o seu record de \`${data.recordsolo}s\``);
								data.recordsolo = time;
							}
							data.score = data.score + record;
							data.save();
						}
						const desafio3 = new EmbedBuilder()
							.setColor('#cd949d')
							.setDescription(`> <:confete:932369805451862056> Parabéns! Você digitou todas essas palavras em \`${time}s\`\n<:vencedor:932369765975081092> Sua pontuação nessa rodada: \`${record}\``)
							.setTitle(`<:teclado2:932311688559091803>  Desafio Type de \`${user.tag.replace(/`/g, '')}\``)
							.setFooter({ text: `${Math.floor(Math.random() * 2) == 0 ? 'Você sabia que você pode jogar contra um amigo ? Insira o ID dele nas opções do comando' : 'Está com curiosidade de saber quais são os melhores jogadores de type ? Veja em /type-leaderboard'}`, iconURL: user.displayAvatarURL() });


						interaction.followUp({ embeds: [desafio3] });

					});

				});
			}
		}
		if (interaction.options.getSubcommand() == 'leaderboard') {

			const pontos = new ButtonBuilder()
				.setCustomId(`pontos-${interaction.user.id}`)
				.setLabel('Pontuação')
				.setStyle(ButtonStyle.Secondary);

			const tempo = new ButtonBuilder()
				.setCustomId(`tempo-${interaction.user.id}`)
				.setLabel('Tempo')
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder()
				.addComponents(tempo, pontos);

			interaction.reply({
				content: 'Qual rank você gostaria de ver?',
				components: [row],
			});

		}
		if (interaction.options.getSubcommand() == 'estatisticas') {
			type.findOne({ user: user.id }).then(async (data) => {

				if(!data) return interaction.reply(`** <:way_errado:900128700908060755> » ${interaction.user} Esse usuário nunca jogou type.**`);

				const embed = new EmbedBuilder()
					.setTitle(`<:way_invite:900127448715382794> » Estatísticas de \`${user.tag}\` » Type Game`)
					.setColor('#cd949d')
					.setThumbnail(interaction.client.user.displayAvatarURL());

				if(data.vezessolo) {
					embed.addFields({ name:'Partidas Solo Jogadas', value:`\`${data.vezessolo}\``, inline: true });
				}
				if(data.vezesmult) {
					embed.addFields({ name:'Partidas Multiplayer (que você ganhou)', value: `\`${data.vezesmult}\``, inline: true });
				}

				if(data.recordsolo) {
					embed.addFields({ name: 'Record Solo', value: `\`${data.recordsolo}s\``, inline: true });
				}

				if(data.recordmult) {
					embed.addFields({ name: 'Record Multiplayer', value: `\`${data.recordmult}s\``, inline: true });
				}

				if(data.score) {
					embed.addFields({ name: 'Sua pontuação', value: `\`${data.score}\``, inline: true });
				}
				interaction.reply({ embeds: [embed] });
			});

		}
	}
};
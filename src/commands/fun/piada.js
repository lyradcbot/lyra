const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const emoji = require('../../modules/emojis.json');
const piadas = require('../../modules/jokes.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('piada')
		.setDescription('Conta piadas.'),
	async execute (interaction) {
		await interaction.deferReply();
		const rand = Math.floor(Math.random() * piadas.features.length);
		const piada = piadas.features[rand];
		/*
        Retorna algo tipo:
        {
            "type": "Feature",
            "properties": {
                "pergunta": "Qual a diferença do gato para a Coca-Cola?",
                "resposta": "O gato mia e a Coca Light.",
                "createdAt": "2017\/09\/02 06:07:15.682",
                "updatedAt": "2017\/09\/02 06:07:15.682"
            },
            "geometry": null
        },
        */
		const embed = new EmbedBuilder()
			.setTitle(`${emoji.piada} Piada`)
			.setDescription(piada.properties.pergunta)
			.addFields(
				{
					name: 'Resposta',
					value: `||${piada.properties.resposta}||`,
					inline: false
				}
			)
			.setFooter({
				text: `ID do usuário: ${interaction.user.id}`,
				iconURL: interaction.user.avatarURL({ dynamic: true, size: 4096 })
			})
			.setColor('Blue');
		await interaction.editReply({ embeds: [embed] });
	},
};
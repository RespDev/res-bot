const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'general',
	data: new SlashCommandBuilder()
		.setName('partner')
		.setDescription('Sends you a link to the partner applications forum.'),
	async execute(interaction) {
		await interaction.reply({ content: 'Apply for a partnership at: Comming Soon!', ephemeral: true });
	},
};
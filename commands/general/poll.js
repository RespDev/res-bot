const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option1')
                .setDescription('First poll option.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option2')
                .setDescription('Second poll option.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option3')
                .setDescription('Third poll option.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option4')
                .setDescription('Fourth poll option.')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('option5')
                .setDescription('Fifth poll option.')
                .setRequired(false)),
    
    async execute(interaction) {
        // Checks that the user is a Streamer
        if (!interaction.member.roles.cache.has('1219333877009748059')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const question = interaction.options.getString('question');
        const options = [
            interaction.options.getString('option1'),
            interaction.options.getString('option2'),
            interaction.options.getString('option3'),
            interaction.options.getString('option4'),
            interaction.options.getString('option5'),
        ].filter(Boolean); // Filter out undefined poll options
    
        let pollMessage = `**${question}**\n\n`;
    
        const emojiOptions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    
        options.forEach((option, index) => {
            pollMessage += `${emojiOptions[index]} ${option}\n`;
        });
    
        const message = await interaction.reply({ content: pollMessage, fetchReply: true });

            // React with the required emojis
            for (let i = 0; i < options.length; i++) {
            await message.react(emojiOptions[i]);
        }
    },
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Displays the community rules.'),
    async execute(interaction) {
        // Create an embed for the rules
        const rulesEmbed = new EmbedBuilder()
            .setTitle('Community Rules')
            .setColor(0x00FF00)  // Green color
            .setDescription(`
**1.** Do not swear.
**2.** Inappropriate content of any kind is not allowed.
**3.** No links are allowed. (Gifs allowed in <#1219470917583769650>)
**4.** All slash commands must be used in bot-commands.
**5.** Do not spam.
**6.** Do not advertise unless you are doing it in a channel where it is allowed or you have permission.
**7.** You must be 13 or older to be in this server otherwise you will be banned.
**8.** Follow Discord TOS.
            `)
            .setFooter({ text: 'These rules could be updated at any time in the future.' })
            .setTimestamp();

        await interaction.reply({ embeds: [rulesEmbed], ephemeral: true });
    },
};

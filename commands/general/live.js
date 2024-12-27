const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'general',
    data: new SlashCommandBuilder()
        .setName('live')
        .setDescription('Announce that you are live with a stream URL.')
        .addStringOption(option =>
            option.setName('streamurl')
                .setDescription('The URL of your live stream.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const streamUrl = interaction.options.getString('streamurl');

        // Checks that the user is a Streamer
        if (!interaction.member.roles.cache.has('1219333877009748059')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Define the channel ID where the live announcements should be posted
        const liveChannelId = '1219470296893886504'; // Notifications channel
        const channel = interaction.guild.channels.cache.get(liveChannelId);

        if (!channel) {
            return interaction.reply({ content: 'Live announcement channel not found.', ephemeral: true });
        }

        // Create the embed for the live announcement
        const liveEmbed = new EmbedBuilder()
            .setTitle('I\'m now live on twitch!')
            .setDescription(`[Click Here](${streamUrl}) to come and join the stream.`)
            .setColor(0x9146FF) // Purple color similar to Twitch
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Send the embed to the specified channel
        // Live Ping Role
        const liveId = '1219470400342331412';
        const liveMention = `<@&${liveId}>`;
        await channel.send({ content: `${liveMention}`, embeds: [liveEmbed] });

        // Reply to the user to confirm the message was sent
        await interaction.reply({ content: 'Your live stream announcement has been posted!', ephemeral: true });
    },
};
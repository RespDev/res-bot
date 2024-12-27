const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(member) {
        const channelId = '1273415554215972938';
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) return console.error(`Channel not found: ${channelId}`);

        // Create an embed for the welcome message
        const welcomeEmbed = new EmbedBuilder()
            .setTitle('Welcome!')
            .setColor(0x00AE86)
            .setDescription(`Hello ${member}, welcome to ResPlaysIt's Official Discord. We hope you enjoy your time here!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `We now have ${member.guild.memberCount} members!` })
            .setTimestamp();

        // Send the welcome message to the welcome channel
        channel.send({ embeds: [welcomeEmbed] });
    },
};

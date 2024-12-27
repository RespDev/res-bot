const { Events } = require('discord.js');

// TODO: Make this support other buttons too?
// Currently this only supports buttons for reaction roles!
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isButton()) return; // Ensure the interaction is a button click

        // Define role IDs for buttons
        const roles = {
            'live': '1219470400342331412', // Replace with your role ID for 'live'
            'video': '1220124702140530820', // Replace with your role ID for 'video'
            'giveaway': '1219470542546141254' // Replace with your role ID for 'giveaway'
        };

        // Get the role ID based on the button ID
        const roleId = roles[interaction.customId];

        if (!roleId) {
            // Exit if the button ID is not recognized
            return interaction.reply({ content: 'This button does not correspond to a valid role.', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
            await interaction.reply({ content: 'Role not found!', ephemeral: true });
            return;
        }

        // Check if the user has the role
        if (interaction.member.roles.cache.has(roleId)) {
            // Remove the role
            await interaction.member.roles.remove(role);
            await interaction.reply({ content: `The role ${role.name} has been removed from you.`, ephemeral: true });
        } else {
            // Add the role
            await interaction.member.roles.add(role);
            await interaction.reply({ content: `The role ${role.name} has been added to you.`, ephemeral: true });
        }
    },
};

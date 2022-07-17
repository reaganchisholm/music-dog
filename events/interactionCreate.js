export const event = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Find command in commands collection
        const command = interaction.client.commands.get(interaction.commandName);

        // No command found, return
        if (!command) return;

        // Try to execute our command
        try {
            await command.execute(interaction);
        } catch (error) {
            // Failed to execute command, log error, respond to user
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
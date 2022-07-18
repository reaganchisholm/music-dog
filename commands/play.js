import { SlashCommandBuilder } from '@discordjs/builders';
import { connectToChannel } from "../helpers/connectToChannel";
import { player, setupPlayerEvents } from '../globals';
import { playSong } from "../helpers/playSong";

export const command = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Plays a song')
		.addStringOption(option => 
			option
				.setName('song')
				.setDescription('The song to play')
				.setRequired(true)
		),
	async execute(interaction) {
		const guild = interaction.client.guilds.cache.get(interaction.guildId)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		// Check if user is in a voice channel
		if(voiceChannel) {
			try {
				let connection = await connectToChannel(voiceChannel);

				if(connection){
					setupPlayerEvents(connection);
				}

				/**
				 We have successfully connected! Now we can subscribe our connection to the player. This means that the player will play audio in the user's voice channel.
				*/
				connection.subscribe(player);

				/**
				 Try to get our song ready to play for when the bot joins a voice channel
				 */
				try {
					await playSong();
				} catch (error) {
					/**
					 The song isn't ready to play for some reason :(
					 */
					console.error(error);
				}

				await interaction.reply('Playing now!');
			} catch (error) {
				console.error(error);
			}
			// await interaction.reply('Pong!');
		} else {
			await interaction.reply('You must be in a voice channel to play a song!');
		}
	},
}
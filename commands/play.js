import { SlashCommandBuilder } from '@discordjs/builders';
import { connectToChannel } from "../helpers/connectToChannel";
import { player } from '../globals';
import { playSong } from "../helpers/playSong";
import { queue } from "../queue";

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

				/**
				 We have successfully connected! Now we can subscribe our connection to the player. This means that the player will play audio in the user's voice channel.
				*/
				connection.subscribe(player);

				queue.add({
					title: 'Test',
					song: interaction.options.song
				});

				queue.add({
					title: 'Test 2',
					song: interaction.options.song
				});
				
				queue.add({
					title: 'Test 3',
					song: interaction.options.song
				});

				if(player.state.status === 'idle'){
					queue.play();
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
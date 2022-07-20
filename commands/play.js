import { SlashCommandBuilder } from '@discordjs/builders';
import { connectToChannel } from "../helpers/connectToChannel";
import { player, setupEvents } from '../globals';
import { queue } from "../queue";
import { handlers } from "../handlers";

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
		let songRequest = interaction.options.get('song').value;

		if(songRequest.includes('lyric') === false){
			songRequest = `${songRequest} lyrics`;
		}

		// Check if user is in a voice channel
		if(voiceChannel) {
			try {
				let connection = await connectToChannel(voiceChannel);

				/**
				 We have successfully connected! Now we can subscribe our connection to the player. This means that the player will play audio in the user's voice channel.
				*/
				connection.subscribe(player);

				setupEvents(interaction.guildId);

				const searchResult = await handlers.youtube.search(songRequest);

				if(searchResult?.length > 0){
					try {
						await handlers.youtube.download(searchResult[0]);
						queue.add(searchResult[0].title, `.cache/${searchResult[0].id}.mp4`);
					} catch(e){ 
						console.log(e);
					}
				}

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
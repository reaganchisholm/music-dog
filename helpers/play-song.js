import {
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
} from '@discordjs/voice';
import { player } from '../globals';

export function playSong() {
	const resource = createAudioResource('./bark.mp3', {
		inputType: StreamType.Arbitrary,
	});

	/**
	 * We will now play this to the audio player. By default, the audio player will not play until
	 * at least one voice connection is subscribed to it, so it is fine to attach our resource to the
	 * audio player this early.
	 */
	player.play(resource);

	/**
	 * Here we are using a helper function. It will resolve if the player enters the Playing
	 * state within 5 seconds, otherwise it will reject with an error.
	 */
	return entersState(player, AudioPlayerStatus.Playing, 5e3);
}
import { createAudioPlayer, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';

/**
 * Create the audio player. We will use this for all of our connections.
 */
export const player = createAudioPlayer();

let disconnectTimeout;
let disconnectTimeoutInSeconds = 50;

player.on(AudioPlayerStatus.Playing, () => {
    // if(disconnectTimeout){
    //     console.log("Cleaning timeout");
    //     clearTimeout(disconnectTimeout)
    // }
});

player.on(AudioPlayerStatus.Idle, () => {
    // const connection = getVoiceConnection(guildId);

    // disconnectTimeout = setTimeout(() => {
        // console.log('Disconnecting');
        // connection.disconnect();
    // }, disconnectTimeoutInSeconds * 1000);
});
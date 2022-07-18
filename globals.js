import { createAudioPlayer, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';

/**
 * Create the audio player. We will use this for all of our connections.
 */
export const player = createAudioPlayer();

export function setupPlayerEvents(connection){
    let disconnectTimeout;
    let disconnectTimeoutInSeconds = 60;

    player.on(AudioPlayerStatus.Playing, () => {
        if(disconnectTimeout){
            console.log("Cleaning timeout");
            clearTimeout(disconnectTimeout)
        }
    });

    player.on(AudioPlayerStatus.Idle, () => {
        console.log("Idle disconnecting in " + disconnectTimeoutInSeconds * 1000 + " seconds");
        disconnectTimeout = setTimeout(() => {
            console.log("Disconnecting");
            console.log(connection);
            connection.disconnect();
        }, disconnectTimeoutInSeconds * 1000);
    });
};
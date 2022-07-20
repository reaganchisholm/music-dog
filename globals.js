import { createAudioPlayer, AudioPlayerStatus, getVoiceConnection } from '@discordjs/voice';
import { queue } from "./queue";

/**
 * Create the audio player. We will use this for all of our connections.
 */
export const player = createAudioPlayer();

let disconnectTimeout;
let disconnectTimeoutInSeconds = 50;

export function setupEvents(guildId){
    player.on(AudioPlayerStatus.Playing, () => {
        if(disconnectTimeout){
            console.log("Cleaning timeout");
            clearTimeout(disconnectTimeout)
        }
    });

    player.on('error', error => {
        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
        const connection = getVoiceConnection(guildId);
        
        let playNextSong = queue.play();

        // if(playNextSong === false){
        //     disconnectTimeout = setTimeout(() => {
        //         console.log('Disconnecting');
        //         connection.disconnect();
        //     }, disconnectTimeoutInSeconds * 1000);
        // }
    });
}
import { player } from './globals';
import { playSong } from "./helpers/playSong";

export const queue = setupQueue(player);

function setupQueue(player){
    let songs = [];

    function get(index){
        return songs[index - 1];
    }

    function add(title, song){
        let item = {
            title,
            song,
        }

        // console.log('Adding: ' + title);
        songs.push(item);
    }

    function remove(index){
        console.log(songs);
        songs = songs.filter((item, i) => i !== index - 1);
        console.log(songs);
    }

    async function play(){
        console.log('Playing queue!');
        while(songs.length > 0){
            if(songs.length === 0){
                console.log('Queue is empty!');
                // No songs in queue
                break;
            } else if(player.state.status === 'playing'){
                console.log(player.state.status);
                // Currently playing a song, wait until it's done
            } else {
                let song = get(1); 
                console.log("Playing: " + song.title);
                await playSong();
                if(song){
                    console.log("Removing: ", song.title);
                    remove(1);
                }
            }
        }

        console.log('Queue is empty!, waiting for more music');
    }

    return {
        songs,
        add,
        remove,
        play,
    }
}
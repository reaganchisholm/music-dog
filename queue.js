import { playSong } from "./helpers/playSong";

// Pretty sure this won't work if the bot was being used in multiple servers, would need to make a new queue for each server

export const queue = setupQueue();

function setupQueue(){
    let songs = [];

    function get(index){
        return songs[index - 1];
    }

    function add(title, song){
        let item = {
            title,
            song,
        }

        songs.push(item);
    }

    function remove(index){
        songs = songs.filter((item, i) => i !== index - 1);
    }

    async function play(){
        if(songs.length === 0){
            // No songs in queue
            console.log('Queue is empty!');
        } else {
            let song = get(1); 
            await playSong(song);

            if(song){
                setTimeout(() => {
                    remove(1);
                }, 5000);
            }
        }
    }

    return {
        songs,
        add,
        remove,
        play,
    }
}
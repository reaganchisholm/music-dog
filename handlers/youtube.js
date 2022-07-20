import fs from 'node:fs';
import YouTube from "youtube-sr";
import ytdl from 'ytdl-core';

export const youtubeHandler = {
    name: 'youtube',
    search: async (query) => {
        try {
            const results = await YouTube.search(query, { limit: 1 })
            return results;
        } catch(e){
            console.log(e);
        }
    },
    download: async (song) => {
        const download = ytdl(`http://www.youtube.com/watch?v=${song.id}`, {
            filter: 'audioonly'
        }).pipe(fs.createWriteStream(`.cache/${song.id}.mp4`));
        return download;
    }
}
import { youtubeHandler } from '../handlers/youtube';

export const handlers = setupHandlers();

function setupHandlers(){
    return {
        youtube: youtubeHandler
    }
}
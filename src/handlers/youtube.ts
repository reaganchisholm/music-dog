// TODO: HANDLE GETTING YOUTUBE AUDIO
import { handlers } from './mod.ts';
import { YouTube } from './deps.ts';

handlers.youtube = () => {
    search: async (query: string) => {
        const results = await YouTube
            .search(query, { maxResults: 1 })
            .then(async (results) => { console.log(results); })
            .catch(error => { console.log(error); })
        return results;
    }
}
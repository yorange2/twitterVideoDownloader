import { TwitterIOApiClient,TwitterIOApiClientExtension,Users } from './twitterIOApiClient/index.js';
const cltExt = new TwitterIOApiClientExtension(process.env.TWITTERIO_API_KEY);
await cltExt.dumpVideo(Users.viramimoza.Id, './videos')

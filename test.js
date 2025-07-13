import { TwitterApi } from 'twitter-api-v2';

// Instantiate with desired auth type (here's Bearer v2 auth)
const twitterClient = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAG7crgEAAAAARZiejESMl5zNjWpEP%2B4aerHQqxc%3D4ngoyh6Suu1xBwQgTWhyH0ttWcOQJk6chWq8BliFPWOT9XpQ79');

// Tell typescript it's a readonly app
const readOnlyClient = twitterClient.readOnly;

// Play with the built in methods
const user = await readOnlyClient.v2.userByUsername('plhery');
await twitterClient.v2.tweet('Hello, this is a test.');
// You can upload media easily!
await twitterClient.v1.uploadMedia('./big-buck-bunny.mp4');
import { TwitterApi } from 'twitter-api-v2';
import readline from 'readline';
import { Agent } from 'https';
import { HttpsProxyAgent } from 'https-proxy-agent';
const CALLBACK_URL = 'https://localhost'
const proxyUrl = 'http://127.0.0.1:10809'; // Replace with your proxy URL
const agent = new HttpsProxyAgent(proxyUrl);
const client = new TwitterApi({ 
    clientId: '', 
    clientSecret: ''
},{ httpAgent : agent });

const authRequest = client.generateOAuth2AuthLink(CALLBACK_URL, { scope: ['tweet.read', 'users.read', 'users.email', 'offline.access'] });
console.log(authRequest)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getInput = (query) => new Promise(resolve => rl.question(query, resolve));

const inputUrl = await getInput('Paste your callback URL here:(include code) ');
rl.close();
const params = new URLSearchParams(inputUrl.split('?')[1]);
const code = params.get('code');
const codeVerifier = authRequest.codeVerifier;
const authResponse= await client.loginWithOAuth2({ code, codeVerifier, redirectUri: CALLBACK_URL })
console.log('authResponse',authResponse)
const loggedClient = authResponse.client;
const { data: userObject } = await loggedClient.v2.me();
console.log('userObject',userObject)
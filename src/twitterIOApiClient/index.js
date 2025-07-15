import fs from 'fs'
class TwitterIOApiClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.defaultHeader = {
      'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
      'Cookie':'MicrosoftApplicationsTelemetryDeviceId=8b61e521-b554-49f7-a44c-4047325a658c; MicrosoftApplicationsTelemetryFirstLaunchTime=2025-07-14T13:09:55.487Z',
      'Accept-Language':'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
      'Accept':'application/json, text/plain, */*',
      'Accept-Encoding':'gzip, deflate, br',
      'Priority':'u=0, i',
      'Range': 'bytes=0-1048575',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'

    }
  }

  async getUserLastTweets({userId,userName,cursor,includeReplies}) {
    const url = new URL('https://api.twitterapi.io/twitter/user/last_tweets')
    const paramsObject = {userId,userName,cursor,includeReplies}
    const filteredParams = Object.fromEntries(
        Object.entries(paramsObject).filter(([key, value]) => value !== undefined && value !== null)
    );
    url.search= new URLSearchParams(filteredParams).toString()
    const response = await fetch(url, 
    {
      headers: {
        'X-API-Key': this.apiKey
      },
    });
    return response.json();
  }
}

class TwitterIOApiClientExtension extends TwitterIOApiClient {
  constructor(apiKey) {
    super(apiKey);
  }
  async dumpVideo(userId,outputDir){
    let cursor = null
    do{
      const data = await super.getUserLastTweets({userId,cursor});
      cursor = data?.next_cursor;
      const tweets = data?.data?.tweets
      if(!tweets || tweets.length === 0) {
        console.log(`No tweets found for userId: ${userId}`);
        return;
      }
      for(const tweet of tweets) {
        const medias = tweet?.extendedEntities?.media
        if(!medias || medias.length === 0) {
          console.log(`No media found for tweet id: ${tweet.id}`);
          continue;
        }
        for(const media of medias) {
          const variants =media?.video_info?.variants
          if(variants?.length > 0) {
            const lastVariant = variants[variants.length - 1];
            if(lastVariant.content_type !== 'video/mp4') { continue }
            const videoUrl = lastVariant.url;
            const fileName = `${outputDir}/urls.csv`;
            await fs.appendFileSync(fileName, `${userId},${tweet.id},${media.id_str},${videoUrl},${tweet.url}\n`,'utf-8');
          }
          
        }
      }
    }while(cursor !=null)
  }
}
const Users={
    'AreUOk20': {
        Id: '1022876205878407168',
        Name: 'AreUOk20',
    },
    'viramimoza': {
        Id: '1566128830162632705',
        Name: 'viramimoza',
    },
}
export  {TwitterIOApiClient,TwitterIOApiClientExtension, Users };
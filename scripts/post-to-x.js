#!/usr/bin/env node
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const tweet = process.argv.slice(2).join(' ');

if (!tweet) {
  console.error('Usage: post-to-x.js <tweet text>');
  process.exit(1);
}

async function postTweet() {
  try {
    const result = await client.v2.tweet(tweet);
    console.log('Tweet posted successfully!');
    console.log('Tweet ID:', result.data.id);
    console.log('URL: https://x.com/i/status/' + result.data.id);
  } catch (error) {
    console.error('Error posting tweet:', error.message);
    if (error.data) console.error('Details:', JSON.stringify(error.data, null, 2));
    process.exit(1);
  }
}

postTweet();

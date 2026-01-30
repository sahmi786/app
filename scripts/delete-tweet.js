#!/usr/bin/env node
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const tweetId = process.argv[2];

if (!tweetId) {
  console.error('Usage: delete-tweet.js <tweet_id>');
  process.exit(1);
}

async function deleteTweet() {
  try {
    await client.v2.deleteTweet(tweetId);
    console.log('Tweet deleted successfully!');
  } catch (error) {
    console.error('Error deleting tweet:', error.message);
    process.exit(1);
  }
}

deleteTweet();

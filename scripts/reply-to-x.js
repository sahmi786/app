#!/usr/bin/env node
const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

const replyToId = process.argv[2];
const tweet = process.argv.slice(3).join(' ');

if (!replyToId || !tweet) {
  console.error('Usage: reply-to-x.js <reply_to_tweet_id> <tweet text>');
  process.exit(1);
}

async function postReply() {
  try {
    const result = await client.v2.tweet(tweet, { reply: { in_reply_to_tweet_id: replyToId } });
    console.log('Reply posted successfully!');
    console.log('Tweet ID:', result.data.id);
  } catch (error) {
    console.error('Error posting reply:', error.message);
    if (error.data) console.error('Details:', JSON.stringify(error.data, null, 2));
    process.exit(1);
  }
}

postReply();

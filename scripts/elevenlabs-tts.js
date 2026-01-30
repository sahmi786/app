#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.argv[2] || '21m00Tcm4TlvDq8ikWAM'; // Default: Rachel
const text = process.argv.slice(3).join(' ');
const outputFile = `/tmp/elevenlabs-${Date.now()}.mp3`;

if (!text) {
  console.error('Usage: elevenlabs-tts.js [voice_id] "text to speak"');
  console.error('Voices: Rachel (21m00Tcm4TlvDq8ikWAM), Adam (pNInz6obpgDQGcFmaJgB), Josh (TxGEqnHWrfWFTfGW9XjX)');
  process.exit(1);
}

const data = JSON.stringify({
  text: text,
  model_id: 'eleven_multilingual_v2'
});

const options = {
  hostname: 'api.elevenlabs.io',
  path: `/v1/text-to-speech/${voiceId}`,
  method: 'POST',
  headers: {
    'xi-api-key': apiKey,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Error: ${res.statusCode}`);
    res.on('data', d => console.error(d.toString()));
    process.exit(1);
  }
  
  const file = fs.createWriteStream(outputFile);
  res.pipe(file);
  file.on('finish', () => {
    console.log(outputFile);
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();

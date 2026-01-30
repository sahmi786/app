const https = require('https');

const API_KEY = process.env.APOLLO_API_KEY;

async function getPerson(id) {
  const postData = JSON.stringify({ id: id });

  const options = {
    hostname: 'api.apollo.io',
    port: 443,
    path: '/api/v1/people/match',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

getPerson(process.argv[2])
  .then(result => console.log(JSON.stringify(result, null, 2)))
  .catch(err => console.error('Error:', err.message));

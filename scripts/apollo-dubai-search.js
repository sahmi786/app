const https = require('https');

const API_KEY = 'Q7m_zKWU88Pr3jmz35V0mg';

// Search for IT Infrastructure leads in Dubai/UAE
async function searchPeople() {
  const postData = JSON.stringify({
    person_titles: [
      "Head of IT Infrastructure",
      "IT Director",
      "Head of IT",
      "CTO",
      "Chief Technology Officer",
      "Director of IT",
      "VP Infrastructure",
      "Head of Infrastructure",
      "CIO",
      "Chief Information Officer"
    ],
    person_locations: [
      "Dubai, United Arab Emirates",
      "Abu Dhabi, United Arab Emirates",
      "United Arab Emirates"
    ],
    organization_num_employees_ranges: ["51,200", "201,500", "501,1000", "1001,5000", "5001,10000"],
    per_page: 30,
    page: 1
  });

  const options = {
    hostname: 'api.apollo.io',
    port: 443,
    path: '/api/v1/mixed_people/api_search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
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
          resolve({ error: e.message, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

searchPeople().then(result => {
  console.log(JSON.stringify(result, null, 2));
});

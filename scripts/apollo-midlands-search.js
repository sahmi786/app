const https = require('https');

const API_KEY = process.env.APOLLO_API_KEY || 'Q7m_zKWU88Pr3jmz35V0mg';

// Search for IT Infrastructure leads in UK Midlands using new API endpoint
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
      "Head of Infrastructure"
    ],
    person_locations: [
      "Birmingham, United Kingdom",
      "Nottingham, United Kingdom",
      "Leicester, United Kingdom",
      "Coventry, United Kingdom",
      "Derby, United Kingdom",
      "Wolverhampton, United Kingdom",
      "Stoke-on-Trent, United Kingdom",
      "West Midlands, United Kingdom",
      "East Midlands, United Kingdom"
    ],
    organization_num_employees_ranges: ["51,200", "201,500", "501,1000", "1001,5000", "5001,10000"],
    per_page: 25,
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

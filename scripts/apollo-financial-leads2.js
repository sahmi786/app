const https = require('https');

const API_KEY = process.env.APOLLO_API_KEY;

async function searchLeads() {
  const searchParams = {
    person_titles: ["IT Director", "Head of IT", "Head of Infrastructure", "Director of Technology", "VP Technology"],
    person_locations: ["United Kingdom"],
    organization_num_employees_ranges: ["201,500", "501,1000", "1001,5000"],
    organization_industries: ["financial services", "banking", "insurance", "investment management"],
    page: 1,
    per_page: 20
  };

  const postData = JSON.stringify(searchParams);

  const options = {
    hostname: 'api.apollo.io',
    port: 443,
    path: '/api/v1/mixed_people/api_search',
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

searchLeads()
  .then(result => {
    if (result.people) {
      const withEmail = result.people.filter(p => p.has_email === true).slice(0, 10);
      console.log(JSON.stringify(withEmail.map(p => p.id)));
    }
  })
  .catch(err => console.error('Error:', err.message));

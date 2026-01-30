const https = require('https');

const API_KEY = process.env.APOLLO_API_KEY;

const ids = [
  "67953f02f2b2c60001cd2f81",
  "66f1ae57c0190d0001f31cb3",
  "66fb616b59b0010001dbad30",
  "60ed9f7a24cdbc0001f1338e",
  "60dbf44fdb3ad8000196a6b4",
  "63ecd1ddd17ff8000185099c",
  "60814a12bc7951000174e711",
  "66f0eb1985dd330001883da6"
];

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
          resolve(null);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function getAllLeads() {
  const leads = [];
  for (const id of ids) {
    try {
      const result = await getPerson(id);
      if (result && result.person) {
        const p = result.person;
        const o = p.organization || {};
        if (p.email) {
          leads.push({
            name: p.name,
            email: p.email,
            email_status: p.email_status,
            title: p.title,
            company: o.name,
            industry: o.industry,
            employees: o.estimated_num_employees,
            revenue: o.annual_revenue_printed,
            linkedin: p.linkedin_url,
            city: p.city
          });
        }
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error('Error for', id, e.message);
    }
  }
  return leads;
}

getAllLeads().then(leads => {
  console.log(JSON.stringify(leads, null, 2));
});

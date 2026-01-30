const https = require('https');

const API_KEY = process.env.APOLLO_API_KEY;

const ids = [
  "6528c7805be6dc0001c71da9",  // Andy - Everywhen
  "60104a58df07c00001634e07",  // Matej - Monzo
  "61167a878475f100011198c6",  // Dougie - Aegon UK
  "66ed11b5f522c9000136590b",  // Klaus
  "66ecccec67220000014b5b7c",  // Joao - Santander
  "66f69c029c737700010d3d8e"   // Ben - Lloyd's
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

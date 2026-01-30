const https = require('https');
const fs = require('fs');

const API_KEY = process.env.APOLLO_API_KEY;

const ids = [
  "60d1a9909c0d580001459dcc",
  "610ae4b300e2a40001973c15",
  "6701822e0f15ea0001cdad1b",
  "603dfdd3ba194700017d41f1",
  "66f91a24de27170001f93bd2",
  "61014777212c4600010a8aa7",
  "66f5f11ac5abd30001678e68",
  "66ebe16a6a051400013016bd",
  "60e599a6f1a0970001718ae5",
  "611a4f689e85120001ffa01a"
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
          city: p.city,
          technologies: (o.technology_names || []).slice(0, 10)
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

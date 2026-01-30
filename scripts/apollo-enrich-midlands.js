const https = require('https');

const API_KEY = 'Q7m_zKWU88Pr3jmz35V0mg';

// Top 5 Midlands IT Infrastructure leads to enrich
const ids = [
  "6705166f0af0e80001accb8c",  // Kam - Secure Trust Bank - Head of IT Infrastructure
  "66f412f55ad6c20001b53291",  // Patrick - Wavenet - Head of IT Infrastructure & Cybersecurity
  "66f5e483522b77000167429b",  // Neil - Fisher German LLP - Head of IT Infrastructure
  "66fb61ca59b0010001dbcc39",  // Steve - Gateley Legal - Head of IT Service & Infrastructure
  "66f2977bc84c030001308fbe",  // Daryl - Samworth Brothers - Head of IT Operations and Infrastructure
];

async function enrichPerson(id) {
  const postData = JSON.stringify({ id: id });
  const options = {
    hostname: 'api.apollo.io',
    port: 443,
    path: '/api/v1/people/match',
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
          resolve({ error: e.message });
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
      const result = await enrichPerson(id);
      if (result && result.person) {
        const p = result.person;
        const o = p.organization || {};
        leads.push({
          name: p.name,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.email,
          email_status: p.email_status,
          title: p.title,
          company: o.name,
          industry: o.industry,
          employees: o.estimated_num_employees,
          revenue: o.annual_revenue_printed,
          linkedin: p.linkedin_url,
          city: p.city,
          state: p.state
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

const https = require('https');

const API_KEY = 'Q7m_zKWU88Pr3jmz35V0mg';

// Top 5 Dubai/UAE IT Infrastructure leads to enrich
const ids = [
  "60ec02e4fd1f060001b74260",  // Dan - Mashreq Bank - EVP Head of IT Infrastructure
  "54a6154e7468693b8caf36c1",  // Moses - Al Naboodah Group - Head of IT Infrastructure
  "6116847e1e925e00011b93b5",  // Cedric - Easa Saleh Al Gurg Group - Group Head IT Infrastructure
  "66ebc39cb6d648000134c32c",  // Tariq - Al Khayyat Investments - Head of IT Infrastructure
  "66ec0a3fcdb76c00017cfe35",  // Sandeep - Dragon Oil - Head of IT Infrastructure
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
          country: p.country
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

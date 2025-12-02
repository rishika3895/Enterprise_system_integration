const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const client = axios.create({
  baseURL: process.env.CRM_BASE_URL,
  timeout: 2000,
});

async function getCrmCustomer(externalCrmId) {
  try {
    const response = await client.get(`/crm/customers/${externalCrmId}`);
    return response.data;
  } catch (error) {
    console.error('CRM request failed:', error.message);
    return null;
  }
}

module.exports = { getCrmCustomer };

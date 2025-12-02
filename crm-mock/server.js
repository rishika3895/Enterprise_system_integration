const express = require('express');

const app = express();
const PORT = 4000;

const mockCustomers = {
  'crm-123': { id: 'crm-123', fullName: 'Alice Johnson', email: 'alice@example.com', segment: 'GOLD' },
  'crm-456': { id: 'crm-456', fullName: 'Bob Smith', email: 'bob@example.com', segment: 'SILVER' },
};

app.get('/crm/customers/:externalCrmId', (req, res) => {
  const profile = mockCustomers[req.params.externalCrmId];
  if (!profile) {
    return res.status(404).json({ message: 'Not found' });
  }
  res.json(profile);
});

app.listen(PORT, () => {
  console.log(`CRM mock server listening on port ${PORT}`);
});

const { Customer } = require('../config/db');

async function listCustomers() {
  return Customer.findAll();
}

async function getCustomer(id) {
  return Customer.findByPk(id);
}

async function createCustomer(data) {
  if (!data.name || !data.email || !data.segment) {
    const error = new Error('Name, email, and segment are required');
    error.status = 400;
    throw error;
  }
  return Customer.create({
    name: data.name,
    email: data.email,
    segment: data.segment,
    external_crm_id: data.external_crm_id || null,
  });
}

async function updateCustomer(id, data) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  if (!data.name || !data.email || !data.segment) {
    const error = new Error('Name, email, and segment are required');
    error.status = 400;
    throw error;
  }
  await customer.update({
    name: data.name,
    email: data.email,
    segment: data.segment,
    external_crm_id: data.external_crm_id || null,
  });
  return customer;
}

async function deleteCustomer(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }
  await customer.destroy();
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};

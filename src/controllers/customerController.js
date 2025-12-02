const customerService = require('../services/customerService');
const { getCrmCustomer } = require('../services/crmService');

async function listCustomers(req, res, next) {
  try {
    const customers = await customerService.listCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

async function getCustomer(req, res, next) {
  try {
    const customer = await customerService.getCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getCustomerWithCrm(req, res, next) {
  try {
    const customer = await customerService.getCustomer(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.external_crm_id) {
      return res.json({ customer, crmProfile: null });
    }

    const crmProfile = await getCrmCustomer(customer.external_crm_id);
    res.json({ customer, crmProfile });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerWithCrm,
};

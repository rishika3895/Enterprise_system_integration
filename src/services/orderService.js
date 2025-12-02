const { Order, OrderItem, Customer, Product, sequelize } = require('../config/db');

async function listOrders() {
  return Order.findAll({
    include: [
      { model: Customer, attributes: ['id', 'name', 'email', 'segment', 'external_crm_id'] },
      { model: OrderItem, include: [{ model: Product }] },
    ],
  });
}

async function getOrder(id) {
  return Order.findByPk(id, {
    include: [
      { model: Customer, attributes: ['id', 'name', 'email', 'segment', 'external_crm_id'] },
      { model: OrderItem, include: [{ model: Product }] },
    ],
  });
}

async function createOrder(data) {
  if (!data.customerId || !Array.isArray(data.items) || data.items.length === 0) {
    const error = new Error('customerId and at least one item are required');
    error.status = 400;
    throw error;
  }

  const customer = await Customer.findByPk(data.customerId);
  if (!customer) {
    const error = new Error('Customer not found');
    error.status = 404;
    throw error;
  }

  const productIds = data.items.map((item) => item.productId);
  const products = await Product.findAll({ where: { id: productIds } });
  if (products.length !== productIds.length) {
    const error = new Error('One or more products not found');
    error.status = 400;
    throw error;
  }

  return sequelize.transaction(async (t) => {
    const order = await Order.create({ customer_id: data.customerId, status: 'PENDING', created_at: new Date() }, { transaction: t });

    const itemsToCreate = data.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!item.quantity || item.quantity <= 0) {
        const error = new Error('Quantity must be greater than 0');
        error.status = 400;
        throw error;
      }
      return {
        order_id: order.id,
        product_id: product.id,
        quantity: item.quantity,
        unit_price: product.price,
      };
    });

    await OrderItem.bulkCreate(itemsToCreate, { transaction: t });

    return getOrder(order.id);
  });
}

async function updateOrderStatus(id, status) {
  const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    const error = new Error('Invalid status');
    error.status = 400;
    throw error;
  }
  const order = await Order.findByPk(id);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }
  await order.update({ status });
  return getOrder(id);
}

async function deleteOrder(id) {
  const order = await Order.findByPk(id);
  if (!order) {
    const error = new Error('Order not found');
    error.status = 404;
    throw error;
  }
  return sequelize.transaction(async (t) => {
    await OrderItem.destroy({ where: { order_id: id }, transaction: t });
    await order.destroy({ transaction: t });
  });
}

module.exports = {
  listOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};

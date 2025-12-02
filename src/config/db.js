const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

const Customer = require('../models/customer')(sequelize);
const Product = require('../models/product')(sequelize);
const Order = require('../models/order')(sequelize);
const OrderItem = require('../models/orderItem')(sequelize);

// Associations
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: true });
    console.log('Models synchronized.');

    await seedData();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

async function seedData() {
  const customerCount = await Customer.count();
  const productCount = await Product.count();

  if (customerCount === 0) {
    await Customer.bulkCreate([
      { name: 'Alice Johnson', email: 'alice@example.com', segment: 'GOLD', external_crm_id: 'crm-123' },
      { name: 'Bob Smith', email: 'bob@example.com', segment: 'SILVER', external_crm_id: 'crm-456' },
    ]);
  }

  if (productCount === 0) {
    await Product.bulkCreate([
      { name: 'Laptop', price: 1200.0 },
      { name: 'Headphones', price: 150.0 },
      { name: 'Keyboard', price: 80.0 },
    ]);
  }

  const orders = await Order.count();
  if (orders === 0) {
    const [alice, bob] = await Customer.findAll({ limit: 2 });
    const [laptop, headphones] = await Product.findAll({ limit: 2 });

    const order1 = await Order.create({ customer_id: alice.id, status: 'PENDING', created_at: new Date() });
    await OrderItem.bulkCreate([
      { order_id: order1.id, product_id: laptop.id, quantity: 1, unit_price: laptop.price },
      { order_id: order1.id, product_id: headphones.id, quantity: 2, unit_price: headphones.price },
    ]);

    const order2 = await Order.create({ customer_id: bob.id, status: 'CONFIRMED', created_at: new Date() });
    await OrderItem.create({ order_id: order2.id, product_id: headphones.id, quantity: 1, unit_price: headphones.price });
  }
}

module.exports = {
  sequelize,
  Customer,
  Product,
  Order,
  OrderItem,
  syncDatabase,
};

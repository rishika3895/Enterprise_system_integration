const { Product } = require('../config/db');

async function listProducts() {
  return Product.findAll();
}

async function getProduct(id) {
  return Product.findByPk(id);
}

async function createProduct(data) {
  if (!data.name || data.price == null) {
    const error = new Error('Name and price are required');
    error.status = 400;
    throw error;
  }
  return Product.create({ name: data.name, price: data.price });
}

async function updateProduct(id, data) {
  const product = await Product.findByPk(id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  if (!data.name || data.price == null) {
    const error = new Error('Name and price are required');
    error.status = 400;
    throw error;
  }
  await product.update({ name: data.name, price: data.price });
  return product;
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) {
    const error = new Error('Product not found');
    error.status = 404;
    throw error;
  }
  await product.destroy();
}

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

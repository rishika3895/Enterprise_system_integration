const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    segment: { type: DataTypes.STRING, allowNull: false },
    external_crm_id: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'customers',
    timestamps: false,
  });

  return Customer;
};

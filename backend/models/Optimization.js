const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Optimization = sequelize.define('Optimization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asin: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  original_title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  original_bullets: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  original_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  original_price: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  optimized_title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optimized_bullets: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  optimized_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  keywords: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'optimizations',
  timestamps: true
});

module.exports = Optimization;
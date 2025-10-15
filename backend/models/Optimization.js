const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Optimization = sequelize.define('Optimization', {
  asin: { type: DataTypes.STRING(20), allowNull: false },
  original_title: { type: DataTypes.TEXT },
  original_bullets: { type: DataTypes.TEXT },
  original_description: { type: DataTypes.TEXT },

  optimized_title: { type: DataTypes.TEXT },
  optimized_bullets: { type: DataTypes.TEXT },
  optimized_description: { type: DataTypes.TEXT },
  keywords: { type: DataTypes.TEXT }
}, {
  tableName: 'optimizations',
  timestamps: true
});

module.exports = Optimization;

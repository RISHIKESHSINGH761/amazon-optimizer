require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const optimizationRoutes = require('./routes/optimizationRoutes');
const { sequelize } = require('./config/database');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api', optimizationRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!', 
    timestamp: new Date().toISOString(),
    service: 'Amazon Optimizer API - Scraper Only',
    database: 'MySQL Connected'
  });
});

const PORT = process.env.PORT || 8080;
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL database connected successfully');
    
    await sequelize.sync();
    console.log('✅ Database tables synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Amazon Optimizer Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

startServer();
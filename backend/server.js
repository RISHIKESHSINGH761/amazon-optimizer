require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const optimizationRoutes = require('./routes/optimizationRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api', optimizationRoutes);
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Backend is running!', 
    timestamp: new Date().toISOString(),
    service: 'Amazon Optimizer API'
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(` Amazon Optimizer Backend running on port ${PORT}`);
});
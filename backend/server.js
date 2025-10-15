require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/database');
const optimizationRoutes = require('./routes/optimizationRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

app.use('/api', optimizationRoutes);

const PORT = process.env.PORT || 4000;
sequelize.authenticate()
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error', err));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

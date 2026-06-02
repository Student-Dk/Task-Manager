const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const env = require('./config/env');
const v1Routes = require('./routes/v1');
const errorHandler = require('./utils/errorHandler');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const apiPrefix = '/api/v1';

app.use(apiPrefix, v1Routes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

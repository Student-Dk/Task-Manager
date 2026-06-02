const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 5000
};

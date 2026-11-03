const mongoose = require('mongoose');
require('dotenv').config();

async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('A variável MONGODB_URI não foi configurada');
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  return mongoose.connection;
}

module.exports = { conectarBanco, mongoose };

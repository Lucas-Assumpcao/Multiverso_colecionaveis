const mysql = require('mysql2/promise');

const sslAtivo = process.env.DB_SSL === 'true';
const certificadoCa = process.env.DB_SSL_CA?.replace(/\\n/g, '\n');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'multiverso_colecionaveis',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  decimalNumbers: true,
  ssl: sslAtivo
    ? {
        ca: certificadoCa || undefined,
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      }
    : undefined,
});

async function conectarBanco() {
  let conexao;
  try {
    conexao = await pool.getConnection();
    await conexao.ping();
    return pool;
  } catch (erro) {
    console.error('Falha ao conectar ao MySQL:', {
      code: erro.code,
      errno: erro.errno,
      sqlState: erro.sqlState,
      message: erro.message,
    });
    throw erro;
  } finally {
    conexao?.release();
  }
}

module.exports = { pool, conectarBanco };

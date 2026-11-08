if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const bcrypt = require('bcrypt');
const { pool, conectarBanco } = require('./config/db');

const categoriasIniciais = [
  'Animes/Mangás',
  'Super-heróis (Marvel/DC)',
  'Cultura Pop/Nostalgia/Videogames',
];

const produtosIniciais = [
  { categoria: 0, nome: 'Action Figure Luffy Gear 5', descricao: 'One Piece — edição articulada', preco: 249.90, estoque: 12, imagem_url: '/produtos/luffy.webp' },
  { categoria: 0, nome: 'Action Figure Goku Ultra Instinct', descricao: 'Dragon Ball Super — coleção premium', preco: 229.90, estoque: 10, imagem_url: '/produtos/goku.jpg' },
  { categoria: 0, nome: 'Mangá One Piece Vol. 105 - Colecionador', descricao: 'Edição de colecionador com capa dura', preco: 49.90, estoque: 30, imagem_url: '/produtos/manga.webp' },
  { categoria: 0, nome: 'Action Figure Naruto Modo Sábio', descricao: 'Naruto Shippuden — 17cm', preco: 199.90, estoque: 8, imagem_url: '/produtos/naruto.webp' },
  { categoria: 0, nome: 'Camiseta Attack on Titan', descricao: 'Edição limitada, estampa exclusiva', preco: 89.90, estoque: 25, imagem_url: '/produtos/aot.webp' },
  { categoria: 0, nome: 'Estatueta Sailor Moon Crystal', descricao: 'Compact Edition — S.H.Figuarts', preco: 179.90, estoque: 9, imagem_url: '/produtos/sailor.webp' },
  { categoria: 1, nome: 'Action Figure Homem-Aranha', descricao: 'S.H.Figuarts — No Way Home', preco: 299.90, estoque: 7, imagem_url: '/produtos/aranha.jpg' },
  { categoria: 1, nome: 'Action Figure Batman Hush', descricao: 'Edição especial, base inclusa', preco: 259.90, estoque: 6, imagem_url: '/produtos/batman.jpg' },
  { categoria: 1, nome: 'Réplica Escudo Capitão América', descricao: 'Escala 1:1, acabamento metálico', preco: 349.90, estoque: 4, imagem_url: '/produtos/escudo.webp' },
  { categoria: 1, nome: 'Boneco Coringa Arkham', descricao: 'Série Arkham Origins', preco: 219.90, estoque: 11, imagem_url: '/produtos/coringa.webp' },
  { categoria: 1, nome: 'Camiseta Liga da Justiça', descricao: 'Estampa clássica retrô', preco: 79.90, estoque: 20, imagem_url: '/produtos/liga.webp' },
  { categoria: 1, nome: 'Estatueta Mulher-Maravilha', descricao: 'Edição de colecionador, resina', preco: 289.90, estoque: 5, imagem_url: '/produtos/mulher-maravilha.jpeg' },
  { categoria: 2, nome: 'Action Figure Baby Yoda', descricao: 'Star Wars — The Mandalorian', preco: 189.90, estoque: 15, imagem_url: '/produtos/yoda.webp' },
  { categoria: 2, nome: 'Boneco Chewbacca Retrô', descricao: 'Linha vintage, embalagem retrô', preco: 169.90, estoque: 9, imagem_url: '/produtos/chewbacca.jpg' },
  { categoria: 2, nome: 'Estatueta Master Chief', descricao: 'Halo — edição de colecionador', preco: 259.90, estoque: 6, imagem_url: '/produtos/master.webp' },
  { categoria: 2, nome: 'Action Figure Link', descricao: 'The Legend of Zelda — Breath of the Wild', preco: 209.90, estoque: 10, imagem_url: '/produtos/link.webp' },
  { categoria: 2, nome: 'Pôster Retrô De Volta para o Futuro', descricao: 'Impressão em alta qualidade', preco: 59.90, estoque: 40, imagem_url: '/produtos/poster.webp' },
  { categoria: 2, nome: 'Miniatura DeLorean', descricao: 'Réplica em escala, edição retrô', preco: 149.90, estoque: 8, imagem_url: '/produtos/delorean.jpg' },
];

async function garantirDadosIniciais() {
  const categorias = [];
  for (const nome of categoriasIniciais) {
    await pool.query('INSERT IGNORE INTO categoria (nome) VALUES (?)', [nome]);
    const [[categoria]] = await pool.query('SELECT id FROM categoria WHERE nome = ?', [nome]);
    categorias.push(categoria.id);
  }

  for (const produto of produtosIniciais) {
    await pool.query(
      `INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url)
       SELECT ?, ?, ?, ?, ?, ?
       WHERE NOT EXISTS (SELECT 1 FROM produto WHERE nome = ?)`,
      [categorias[produto.categoria], produto.nome, produto.descricao, produto.preco,
        produto.estoque, produto.imagem_url, produto.nome]
    );
  }

  const emailAdmin = (process.env.ADMIN_EMAIL || 'admin@multiversocolecionaveis.com.br')
    .trim()
    .toLowerCase();
  const senhaAdmin = process.env.ADMIN_SENHA || 'admin123';
  const [admins] = await pool.query('SELECT id FROM usuario_admin WHERE email = ?', [emailAdmin]);
  if (!admins.length) {
    await pool.query(
      'INSERT INTO usuario_admin (nome, email, senha_hash) VALUES (?, ?, ?)',
      ['Admin Multiverso', emailAdmin, await bcrypt.hash(senhaAdmin, 10)]
    );
  }
}

async function executar() {
  try {
    await conectarBanco();
    await garantirDadosIniciais();
    console.log('Dados iniciais inseridos ou já existentes.');
  } catch (erro) {
    console.error('Não foi possível carregar os dados iniciais:', erro.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

executar();

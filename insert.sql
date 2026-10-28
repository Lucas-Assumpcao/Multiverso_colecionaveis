-- =========================================================
-- Multiverso Colecionáveis — insert.sql
-- Dados de teste
-- =========================================================

USE multiverso_colecionaveis;

-- ---------------------------------------------------------
-- categorias
-- ---------------------------------------------------------
INSERT INTO categoria (nome) VALUES
('Animes/Mangás'),
('Super-heróis (Marvel/DC)'),
('Cultura Pop/Nostalgia/Videogames');

-- ---------------------------------------------------------
-- produtos — categoria 1: Animes/Mangás
-- ---------------------------------------------------------
INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url) VALUES
(1, 'Action Figure Luffy Gear 5',              'One Piece — edição articulada',        249.90, 12, '/produtos/luffy.webp'),
(1, 'Action Figure Goku Ultra Instinct',       'Dragon Ball Super — coleção premium',  229.90, 10, '/produtos/goku.jpg'),
(1, 'Mangá One Piece Vol. 105 - Colecionador', 'Edição de colecionador com capa dura',  49.90, 30, '/produtos/manga.webp'),
(1, 'Action Figure Naruto Modo Sábio',         'Naruto Shippuden — 17cm',              199.90,  8, '/produtos/naruto.webp'),
(1, 'Camiseta Attack on Titan',                'Edição limitada, estampa exclusiva',     89.90, 25, '/produtos/aot.webp'),
(1, 'Estatueta Sailor Moon Crystal',           'Compact Edition — S.H.Figuarts',        179.90,  9, '/produtos/sailor.webp');

-- ---------------------------------------------------------
-- produtos — categoria 2: Super-heróis (Marvel/DC)
-- ---------------------------------------------------------
INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url) VALUES
(2, 'Action Figure Homem-Aranha',      'S.H.Figuarts — No Way Home',        299.90,  7, '/produtos/aranha.jpg'),
(2, 'Action Figure Batman Hush',       'Edição especial, base inclusa',     259.90,  6, '/produtos/batman.jpg'),
(2, 'Réplica Escudo Capitão América',  'Escala 1:1, acabamento metálico',   349.90,  4, '/produtos/escudo.webp'),
(2, 'Boneco Coringa Arkham',           'Série Arkham Origins',              219.90, 11, '/produtos/coringa.webp'),
(2, 'Camiseta Liga da Justiça',        'Estampa clássica retrô',             79.90, 20, '/produtos/liga.webp'),
(2, 'Estatueta Mulher-Maravilha',      'Edição de colecionador, resina',    289.90,  5, '/produtos/mulher-maravilha.jpeg');

-- ---------------------------------------------------------
-- produtos — categoria 3: Cultura Pop/Nostalgia/Videogames
-- ---------------------------------------------------------
INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url) VALUES
(3, 'Action Figure Baby Yoda',           'Star Wars — The Mandalorian',        189.90, 15, '/produtos/yoda.webp'),
(3, 'Boneco Chewbacca Retrô',            'Linha vintage, embalagem retrô',     169.90,  9, '/produtos/chewbacca.jpg'),
(3, 'Estatueta Master Chief',            'Halo — edição de colecionador',      259.90,  6, '/produtos/master.webp'),
(3, 'Action Figure Link',                'The Legend of Zelda — Breath of the Wild',209.90, 10, '/produtos/link.webp'),
(3, 'Pôster Retrô De Volta para o Futuro','Impressão em alta qualidade',        59.90, 40, '/produtos/poster.webp'),
(3, 'Miniatura DeLorean',                'Réplica em escala, edição retrô',    149.90,  8, '/produtos/delorean.jpg');

-- ---------------------------------------------------------
-- usuário administrador (senha de teste — trocar o hash em produção)
-- ---------------------------------------------------------
INSERT INTO usuario_admin (nome, email, senha_hash) VALUES
('Admin Multiverso', 'admin@multiversocolecionaveis.com.br', '$2b$10$TuXVzxeiwdUD/1gL16PMduRh9LuwdgrBu95YoSQpfcxcouPMDcaqe');

-- ---------------------------------------------------------
-- cliente + endereço de teste (para testar o fluxo de compra)
-- ---------------------------------------------------------
INSERT INTO cliente (nome, email, senha_hash, cpf) VALUES
('Lucas Teste', 'lucas.teste@email.com', '$2b$10$exemplodehashbcryptaqui', NULL);

INSERT INTO endereco (cliente_id, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES
(1, '06400-000', 'Rua das Coleções', '123', 'Apto 45', 'Centro', 'Barueri', 'SP');

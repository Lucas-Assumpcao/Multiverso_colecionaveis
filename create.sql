-- =========================================================
-- Multiverso Colecionáveis — create.sql
-- Modelo físico (MySQL 8+)
-- =========================================================

CREATE DATABASE IF NOT EXISTS multiverso_colecionaveis
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE multiverso_colecionaveis;

-- ---------------------------------------------------------
-- cliente
-- ---------------------------------------------------------
CREATE TABLE cliente (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(120) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  senha_hash     VARCHAR(255) NOT NULL,
  cpf            VARCHAR(14),
  data_cadastro  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------
-- endereco (1 cliente : N enderecos)
-- ---------------------------------------------------------
CREATE TABLE endereco (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id   INT NOT NULL,
  cep          VARCHAR(9) NOT NULL,
  logradouro   VARCHAR(150) NOT NULL,
  numero       VARCHAR(10) NOT NULL,
  complemento  VARCHAR(60),
  bairro       VARCHAR(100) NOT NULL,
  cidade       VARCHAR(100) NOT NULL,
  estado       CHAR(2) NOT NULL,
  CONSTRAINT fk_endereco_cliente
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
);

-- ---------------------------------------------------------
-- categoria
-- ---------------------------------------------------------
CREATE TABLE categoria (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  nome  VARCHAR(60) NOT NULL UNIQUE
);

-- ---------------------------------------------------------
-- produto (1 categoria : N produtos)
-- ---------------------------------------------------------
CREATE TABLE produto (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id  INT NOT NULL,
  nome          VARCHAR(150) NOT NULL,
  descricao     TEXT,
  preco         DECIMAL(10,2) NOT NULL,
  estoque       INT NOT NULL DEFAULT 0,
  imagem_url    VARCHAR(255),
  CONSTRAINT fk_produto_categoria
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- ---------------------------------------------------------
-- usuario_admin (login separado do cliente)
-- ---------------------------------------------------------
CREATE TABLE usuario_admin (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL
);

-- ---------------------------------------------------------
-- pedido (1 cliente : N pedidos · 1 endereco : N pedidos)
-- ---------------------------------------------------------
CREATE TABLE pedido (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id    INT NOT NULL,
  endereco_id   INT NOT NULL,
  data_pedido   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status        ENUM('aguardando_pagamento','pago','enviado','entregue','cancelado')
                NOT NULL DEFAULT 'aguardando_pagamento',
  valor_frete   DECIMAL(10,2) NOT NULL,
  valor_total   DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
  CONSTRAINT fk_pedido_endereco
    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);

-- ---------------------------------------------------------
-- item_pedido (resolve N:N entre pedido e produto)
-- ---------------------------------------------------------
CREATE TABLE item_pedido (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT NOT NULL,
  produto_id      INT NOT NULL,
  quantidade      INT NOT NULL,
  preco_unitario  DECIMAL(10,2) NOT NULL COMMENT 'preço no momento da compra',
  CONSTRAINT fk_item_pedido_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedido(id),
  CONSTRAINT fk_item_pedido_produto
    FOREIGN KEY (produto_id) REFERENCES produto(id)
);

-- ---------------------------------------------------------
-- pagamento (1 pedido : 1 pagamento)
-- ---------------------------------------------------------
CREATE TABLE pagamento (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id       INT NOT NULL,
  metodo          ENUM('pix','cartao','boleto') NOT NULL,
  status          ENUM('aprovado','pendente','recusado') NOT NULL DEFAULT 'pendente',
  transacao_id    VARCHAR(100),
  data_pagamento  DATETIME,
  CONSTRAINT fk_pagamento_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedido(id)
);

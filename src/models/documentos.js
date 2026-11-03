const { mongoose } = require('../config/db');

const opcoes = { versionKey: false, id: false };

function criarModelo(nome, colecao, campos, opcoesExtras = {}) {
  const esquema = new mongoose.Schema(campos, { ...opcoes, ...opcoesExtras });
  return mongoose.models[nome] || mongoose.model(nome, esquema, colecao);
}

const itemPedidoSchema = new mongoose.Schema({
  produto_id: { type: Number, required: true },
  nome: { type: String, required: true },
  quantidade: {
    type: Number,
    required: true,
    min: 1,
    validate: Number.isInteger,
  },
  preco_unitario: { type: Number, required: true, min: 0 },
}, { _id: false });

const Cliente = criarModelo('Cliente', 'clientes', {
  id: { type: Number, required: true, unique: true },
  nome: { type: String, required: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  senha_hash: { type: String, required: true },
  cpf: { type: String, default: null, maxlength: 14 },
  data_cadastro: { type: Date, default: Date.now },
});

const Endereco = criarModelo('Endereco', 'enderecos', {
  id: { type: Number, required: true, unique: true },
  cliente_id: { type: Number, required: true, index: true },
  cep: { type: String, required: true, maxlength: 9 },
  logradouro: { type: String, required: true, maxlength: 150 },
  numero: { type: String, required: true, maxlength: 10 },
  complemento: { type: String, default: null, maxlength: 60 },
  bairro: { type: String, required: true, maxlength: 100 },
  cidade: { type: String, required: true, maxlength: 100 },
  estado: { type: String, required: true, minlength: 2, maxlength: 2 },
});

const Categoria = criarModelo('Categoria', 'categorias', {
  id: { type: Number, required: true, unique: true },
  nome: { type: String, required: true, unique: true, maxlength: 60 },
});

const Produto = criarModelo('Produto', 'produtos', {
  id: { type: Number, required: true, unique: true },
  categoria_id: { type: Number, required: true, index: true },
  nome: { type: String, required: true, maxlength: 150 },
  descricao: { type: String, default: null },
  preco: { type: Number, required: true, min: 0 },
  estoque: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
    validate: Number.isInteger,
  },
  imagem_url: { type: String, default: null, maxlength: 255 },
});

const UsuarioAdmin = criarModelo('UsuarioAdmin', 'usuarios_admin', {
  id: { type: Number, required: true, unique: true },
  nome: { type: String, required: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, maxlength: 150 },
  senha_hash: { type: String, required: true },
});

const Pedido = criarModelo('Pedido', 'pedidos', {
  id: { type: Number, required: true, unique: true },
  cliente_id: { type: Number, required: true, index: true },
  endereco_id: { type: Number, required: true },
  data_pedido: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    enum: ['aguardando_pagamento', 'pago', 'enviado', 'entregue', 'cancelado'],
    required: true,
    default: 'aguardando_pagamento',
  },
  valor_frete: { type: Number, required: true, min: 0 },
  valor_total: { type: Number, required: true, min: 0 },
  itens: { type: [itemPedidoSchema], required: true },
});

const Pagamento = criarModelo('Pagamento', 'pagamentos', {
  id: { type: Number, required: true, unique: true },
  pedido_id: { type: Number, required: true, index: true },
  metodo: { type: String, enum: ['pix', 'cartao', 'boleto', null], default: null },
  status: {
    type: String,
    enum: ['aprovado', 'pendente', 'recusado'],
    required: true,
    default: 'pendente',
  },
  transacao_id: { type: String, default: null, maxlength: 100 },
  data_pagamento: { type: Date, default: null },
});

const Contador = criarModelo('Contador', 'contadores', {
  nome: { type: String, required: true, unique: true },
  sequencia: { type: Number, required: true, default: 0 },
});

module.exports = { Cliente, Endereco, Categoria, Produto, UsuarioAdmin, Pedido, Pagamento, Contador };

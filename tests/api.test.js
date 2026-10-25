const assert = require('node:assert/strict');
const { after, describe, test } = require('node:test');
const { FRETE_FIXO } = require('../src/config/negocio');

const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@multiversocolecionaveis.com.br';
const ADMIN_SENHA = process.env.ADMIN_SENHA || 'admin123';
const timestamp = Date.now();
let sequenciaEmail = 0;

const estado = {
  produtos: [],
  produtoEstoque: null,
  categoriaId: null,
  clienteA: null,
  clienteB: null,
  enderecoA: null,
  enderecoB: null,
  pedidoA: null,
  tokenAdmin: null,
  produtoCrudId: null,
};

async function requisicao(caminho, opcoes = {}) {
  const headers = { ...opcoes.headers };
  const configuracao = { method: opcoes.method || 'GET', headers };

  if (opcoes.token) headers.Authorization = `Bearer ${opcoes.token}`;
  if (opcoes.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    configuracao.body = JSON.stringify(opcoes.body);
  }

  const resposta = await fetch(`${API_URL}${caminho}`, configuracao);
  const texto = await resposta.text();
  let body = texto;
  if (texto) {
    try {
      body = JSON.parse(texto);
    } catch {
      // Mantém o corpo como texto quando a API não responder JSON.
    }
  }
  return { status: resposta.status, body };
}

function novoEmail() {
  sequenciaEmail += 1;
  return `smoke+${timestamp}-${sequenciaEmail}@smoke.test`;
}

function dadosCliente(email) {
  const cpf = `${String(timestamp).slice(-9)}${String(sequenciaEmail).padStart(2, '0')}`;
  return { nome: 'Cliente Smoke', email, senha: 'senhaSmoke123', cpf };
}

function produtoPayload(produto) {
  return {
    categoria_id: produto.categoria_id,
    nome: produto.nome,
    descricao: produto.descricao,
    preco: Number(produto.preco),
    estoque: Number(produto.estoque),
    imagem_url: produto.imagem_url ?? null,
  };
}

async function loginAdmin() {
  return requisicao('/admin/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, senha: ADMIN_SENHA },
  });
}

after(async () => {
  if (!estado.tokenAdmin) {
    try {
      const login = await loginAdmin();
      if (login.status === 200 && typeof login.body?.token === 'string') {
        estado.tokenAdmin = login.body.token;
      }
    } catch {
      return;
    }
  }
  if (!estado.tokenAdmin) return;

  if (estado.produtoEstoque) {
    const restauracao = await requisicao(`/produtos/${estado.produtoEstoque.id}`, {
      method: 'PUT',
      token: estado.tokenAdmin,
      body: produtoPayload(estado.produtoEstoque),
    });
    assert.equal(restauracao.status, 200, 'deve restaurar o estoque do produto usado');
  }

  if (estado.produtoCrudId) {
    const existente = await requisicao(`/produtos/${estado.produtoCrudId}`);
    if (existente.status === 200) {
      const remocao = await requisicao(`/produtos/${estado.produtoCrudId}`, {
        method: 'DELETE',
        token: estado.tokenAdmin,
      });
      assert.equal(remocao.status, 200, 'deve remover o produto de CRUD que ainda existir');
    } else {
      assert.equal(existente.status, 404);
    }
  }
});

describe('CATÁLOGO', () => {
  test('GET /produtos retorna uma lista não vazia', async () => {
    const resposta = await requisicao('/produtos');
    assert.equal(resposta.status, 200);
    assert.ok(Array.isArray(resposta.body));
    assert.ok(resposta.body.length > 0);
    estado.produtos = resposta.body;
    estado.produtoEstoque = resposta.body
      .filter((produto) => Number(produto.estoque) >= 3 && Number(produto.estoque) < 99)
      .sort((a, b) => Number(a.estoque) - Number(b.estoque))[0];
    assert.ok(estado.produtoEstoque, 'o banco deve ter produto com estoque entre 3 e 98');
  });

  test('GET /produtos/:id retorna produto válido e 404 para id inexistente', async () => {
    const produto = estado.produtos[0];
    const existente = await requisicao(`/produtos/${produto.id}`);
    assert.equal(existente.status, 200);
    assert.equal(typeof existente.body, 'object');
    assert.ok(!Array.isArray(existente.body));

    const idInexistente = Math.max(...estado.produtos.map((item) => Number(item.id))) + 10000;
    const inexistente = await requisicao(`/produtos/${idInexistente}`);
    assert.equal(inexistente.status, 404);
  });

  test('GET /produtos?nome=goku filtra nomes sem diferenciar maiúsculas', async () => {
    const resposta = await requisicao('/produtos?nome=goku');
    assert.equal(resposta.status, 200);
    assert.ok(Array.isArray(resposta.body));
    assert.ok(resposta.body.length > 0);
    for (const produto of resposta.body) {
      assert.equal(typeof produto.nome, 'string');
      assert.ok(produto.nome.toLowerCase().includes('goku'));
    }
  });

  test('GET /categorias e GET /produtos/categoria/:id retornam listas', async () => {
    const categorias = await requisicao('/categorias');
    assert.equal(categorias.status, 200);
    assert.ok(Array.isArray(categorias.body));
    assert.ok(categorias.body.length > 0);
    estado.categoriaId = categorias.body[0].id;

    const produtos = await requisicao(`/produtos/categoria/${estado.categoriaId}`);
    assert.equal(produtos.status, 200);
    assert.ok(Array.isArray(produtos.body));
  });
});

describe('CLIENTES E LOGIN', () => {
  test('POST /clientes cadastra clientes A e B', async () => {
    const emailA = novoEmail();
    const cadastroA = await requisicao('/clientes', {
      method: 'POST',
      body: dadosCliente(emailA),
    });
    assert.equal(cadastroA.status, 201);
    assert.equal(typeof cadastroA.body.id, 'number');
    estado.clienteA = { email: emailA, senha: 'senhaSmoke123' };

    const emailB = novoEmail();
    const cadastroB = await requisicao('/clientes', {
      method: 'POST',
      body: dadosCliente(emailB),
    });
    assert.equal(cadastroB.status, 201);
    assert.equal(typeof cadastroB.body.id, 'number');
    estado.clienteB = { email: emailB, senha: 'senhaSmoke123' };
  });

  test('cadastro sem senha retorna 400 e e-mail repetido retorna 409', async () => {
    const semSenha = await requisicao('/clientes', {
      method: 'POST',
      body: { ...dadosCliente(novoEmail()), senha: undefined },
    });
    assert.equal(semSenha.status, 400);

    const repetido = await requisicao('/clientes', {
      method: 'POST',
      body: { ...dadosCliente(estado.clienteA.email), cpf: '00000000000' },
    });
    assert.equal(repetido.status, 409);
  });

  test('POST /login autentica e não devolve senha_hash', async () => {
    const login = await requisicao('/login', {
      method: 'POST',
      body: { email: estado.clienteA.email, senha: estado.clienteA.senha },
    });
    assert.equal(login.status, 200);
    assert.equal(typeof login.body.token, 'string');
    assert.ok(!Object.hasOwn(login.body, 'senha_hash'));
    estado.clienteA.token = login.body.token;

    const loginB = await requisicao('/login', {
      method: 'POST',
      body: { email: estado.clienteB.email, senha: estado.clienteB.senha },
    });
    assert.equal(loginB.status, 200);
    assert.equal(typeof loginB.body.token, 'string');
    estado.clienteB.token = loginB.body.token;
  });

  test('senha errada e e-mail inexistente retornam 401 com a mesma mensagem', async () => {
    const senhaErrada = await requisicao('/login', {
      method: 'POST',
      body: { email: estado.clienteA.email, senha: 'senha-incorreta' },
    });
    const emailInexistente = await requisicao('/login', {
      method: 'POST',
      body: { email: novoEmail(), senha: estado.clienteA.senha },
    });
    assert.equal(senhaErrada.status, 401);
    assert.equal(emailInexistente.status, 401);
    assert.equal(typeof senhaErrada.body.mensagem, 'string');
    assert.equal(emailInexistente.body.mensagem, senhaErrada.body.mensagem);
  });
});

describe('AUTENTICAÇÃO', () => {
  test('POST /pedidos exige token válido', async () => {
    const body = { endereco_id: 1, itens: [{ produto_id: 1, quantidade: 1 }] };
    const semToken = await requisicao('/pedidos', { method: 'POST', body });
    assert.equal(semToken.status, 401);

    const tokenInvalido = await requisicao('/pedidos', {
      method: 'POST',
      body,
      token: 'token-invalido',
    });
    assert.equal(tokenInvalido.status, 401);
  });
});

describe('PEDIDOS', () => {
  test('clientes A e B criam endereços', async () => {
    const enderecoBase = {
      cep: '01001000',
      logradouro: 'Praça da Sé',
      numero: '100',
      complemento: 'Apto smoke',
      bairro: 'Sé',
      cidade: 'São Paulo',
      estado: 'SP',
    };
    const enderecoA = await requisicao('/enderecos', {
      method: 'POST',
      token: estado.clienteA.token,
      body: enderecoBase,
    });
    assert.equal(enderecoA.status, 201);
    assert.equal(typeof enderecoA.body.id, 'number');
    estado.enderecoA = enderecoA.body.id;

    const enderecoB = await requisicao('/enderecos', {
      method: 'POST',
      token: estado.clienteB.token,
      body: { ...enderecoBase, numero: '200' },
    });
    assert.equal(enderecoB.status, 201);
    assert.equal(typeof enderecoB.body.id, 'number');
    estado.enderecoB = enderecoB.body.id;
  });

  test('cria pedido com frete do servidor e baixa duas unidades', async () => {
    const resposta = await requisicao('/pedidos', {
      method: 'POST',
      token: estado.clienteA.token,
      body: {
        endereco_id: estado.enderecoA,
        itens: [{ produto_id: estado.produtoEstoque.id, quantidade: 2 }],
        valor_frete: 0,
      },
    });
    assert.equal(resposta.status, 201);
    assert.equal(typeof resposta.body.id, 'number');
    estado.pedidoA = resposta.body.id;

    const produtoAtualizado = await requisicao(`/produtos/${estado.produtoEstoque.id}`);
    assert.equal(produtoAtualizado.status, 200);
    assert.equal(Number(produtoAtualizado.body.estoque), Number(estado.produtoEstoque.estoque) - 2);

    const pedido = await requisicao(`/pedidos/${estado.pedidoA}`, { token: estado.clienteA.token });
    assert.equal(pedido.status, 200);
    assert.ok(Math.abs(Number(pedido.body.valor_frete) - FRETE_FIXO) < 0.01);
    const totalEsperado = Number(estado.produtoEstoque.preco) * 2 + FRETE_FIXO;
    assert.ok(Math.abs(Number(pedido.body.valor_total) - totalEsperado) <= 0.01);
  });

  test('valida quantidades, lista vazia e produto inexistente', async () => {
    const criarPedido = (itens) => requisicao('/pedidos', {
      method: 'POST',
      token: estado.clienteA.token,
      body: { endereco_id: estado.enderecoA, itens },
    });

    assert.equal((await criarPedido([{ produto_id: estado.produtoEstoque.id, quantidade: -1 }])).status, 400);
    assert.equal((await criarPedido([{ produto_id: estado.produtoEstoque.id, quantidade: 0 }])).status, 400);
    assert.equal((await criarPedido([])).status, 400);
    const idInexistente = Math.max(...estado.produtos.map((produto) => Number(produto.id))) + 10000;
    assert.equal((await criarPedido([{ produto_id: idInexistente, quantidade: 1 }])).status, 404);
  });

  test('estoque insuficiente retorna 409 e não altera o estoque', async () => {
    const estoqueAntes = Number(estado.produtoEstoque.estoque) - 2;
    const quantidade = estoqueAntes + 1;
    const pedido = await requisicao('/pedidos', {
      method: 'POST',
      token: estado.clienteA.token,
      body: {
        endereco_id: estado.enderecoA,
        itens: [{ produto_id: estado.produtoEstoque.id, quantidade }],
      },
    });
    assert.equal(pedido.status, 409);
    assert.ok(JSON.stringify(pedido.body).toLowerCase().includes('stoque'));

    const produto = await requisicao(`/produtos/${estado.produtoEstoque.id}`);
    assert.equal(produto.status, 200);
    assert.equal(Number(produto.body.estoque), estoqueAntes);
  });

  test('impede endereço de outro cliente e consulta cruzada do pedido', async () => {
    const pedidoComEnderecoAlheio = await requisicao('/pedidos', {
      method: 'POST',
      token: estado.clienteB.token,
      body: {
        endereco_id: estado.enderecoA,
        itens: [{ produto_id: estado.produtoEstoque.id, quantidade: 1 }],
      },
    });
    assert.equal(pedidoComEnderecoAlheio.status, 404);

    const pedidoAlheio = await requisicao(`/pedidos/${estado.pedidoA}`, {
      token: estado.clienteB.token,
    });
    assert.equal(pedidoAlheio.status, 404);

    const pedidos = await requisicao('/pedidos', { token: estado.clienteA.token });
    assert.equal(pedidos.status, 200);
    assert.ok(Array.isArray(pedidos.body));
    assert.ok(pedidos.body.some((pedido) => Number(pedido.id) === estado.pedidoA));
  });
});

describe('PAGAMENTO', () => {
  test('cliente B não pode iniciar pagamento do pedido de A', async () => {
    const resposta = await requisicao(`/pagamentos/${estado.pedidoA}`, {
      method: 'POST',
      token: estado.clienteB.token,
    });
    assert.equal(resposta.status, 404);
  });

  test('cria preferência real apenas quando RUN_MP=1', {
    skip: process.env.RUN_MP !== '1',
  }, async () => {
    const resposta = await requisicao(`/pagamentos/${estado.pedidoA}`, {
      method: 'POST',
      token: estado.clienteA.token,
    });
    assert.equal(resposta.status, 200);
    assert.equal(typeof resposta.body.init_point, 'string');
    assert.ok(resposta.body.init_point.toLowerCase().includes('mercadopago'));
  });
});

describe('WEBHOOK', () => {
  test('POST /webhooks/mercadopago aceita corpo vazio', async () => {
    const resposta = await requisicao('/webhooks/mercadopago', { method: 'POST' });
    assert.equal(resposta.status, 200);
  });
});

describe('ADMIN', () => {
  test('login administrativo aceita credencial correta e rejeita senha errada', async () => {
    const login = await loginAdmin();
    assert.equal(login.status, 200);
    assert.equal(typeof login.body.token, 'string');
    estado.tokenAdmin = login.body.token;

    const senhaErrada = await requisicao('/admin/login', {
      method: 'POST',
      body: { email: ADMIN_EMAIL, senha: 'senha-incorreta' },
    });
    assert.equal(senhaErrada.status, 401);
  });

  test('GET /admin/pedidos exige admin e lista pedidos', async () => {
    const cliente = await requisicao('/admin/pedidos', { token: estado.clienteA.token });
    assert.equal(cliente.status, 403);

    const semToken = await requisicao('/admin/pedidos');
    assert.equal(semToken.status, 401);

    const admin = await requisicao('/admin/pedidos', { token: estado.tokenAdmin });
    assert.equal(admin.status, 200);
    assert.ok(Array.isArray(admin.body));
  });

  test('atualiza o status do pedido e confirma o resultado na listagem', async () => {
    const invalido = await requisicao(`/admin/pedidos/${estado.pedidoA}/status`, {
      method: 'PUT',
      token: estado.tokenAdmin,
      body: { status: 'xyz' },
    });
    assert.equal(invalido.status, 400);

    const atualizado = await requisicao(`/admin/pedidos/${estado.pedidoA}/status`, {
      method: 'PUT',
      token: estado.tokenAdmin,
      body: { status: 'pago' },
    });
    assert.equal(atualizado.status, 200);

    const pedidos = await requisicao('/admin/pedidos', { token: estado.tokenAdmin });
    assert.equal(pedidos.status, 200);
    assert.ok(pedidos.body.some((pedido) => Number(pedido.id) === estado.pedidoA && pedido.status === 'pago'));
  });

  test('CRUD administrativo de produto e bloqueio de cliente', async () => {
    const dados = {
      categoria_id: estado.categoriaId,
      nome: `Produto Smoke ${timestamp}`,
      descricao: 'Produto temporário da suíte de smoke test',
      preco: 1.25,
      estoque: 1,
      imagem_url: null,
    };
    const criado = await requisicao('/produtos', {
      method: 'POST',
      token: estado.tokenAdmin,
      body: dados,
    });
    assert.equal(criado.status, 201);
    assert.equal(typeof criado.body.id, 'number');
    estado.produtoCrudId = criado.body.id;

    const clienteSemPermissao = await requisicao('/produtos', {
      method: 'POST',
      token: estado.clienteA.token,
      body: { ...dados, nome: `Produto Smoke Cliente ${timestamp}` },
    });
    assert.equal(clienteSemPermissao.status, 403);

    const atualizado = await requisicao(`/produtos/${estado.produtoCrudId}`, {
      method: 'PUT',
      token: estado.tokenAdmin,
      body: { ...dados, nome: `Produto Smoke Atualizado ${timestamp}` },
    });
    assert.equal(atualizado.status, 200);

    const removido = await requisicao(`/produtos/${estado.produtoCrudId}`, {
      method: 'DELETE',
      token: estado.tokenAdmin,
    });
    assert.equal(removido.status, 200);

    const depois = await requisicao(`/produtos/${estado.produtoCrudId}`);
    assert.equal(depois.status, 404);
  });
});

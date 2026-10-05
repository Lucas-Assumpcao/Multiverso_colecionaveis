# Multiverso Colecionáveis

Loja virtual full-stack para colecionáveis e action figures — construída do zero: modelagem de banco, API REST com autenticação, integração de pagamento real e front-end em React.

> "Todo fandom, um só lugar."

## Por que este projeto

Comecei este projeto pra praticar arquitetura de back-end de ponta a ponta — não só fazer rotas funcionarem, mas tomar as decisões que times de verdade tomam: onde validar, onde confiar (ou não) no dado que chega do cliente, como separar responsabilidades em camadas, e como tratar erro de forma que signifique alguma coisa pra quem consome a API.

## Destaques técnicos

- **Arquitetura em camadas** (routes → controllers → services → models), separando HTTP, regra de negócio e acesso a dado — cada camada pode mudar sem afetar as outras
- **Autenticação JWT** com dois níveis de acesso (cliente e administrador), usando o mesmo mecanismo mas tokens com escopos diferentes, validados por middlewares distintos
- **Senha nunca armazenada em texto puro** — hash com bcrypt, e erro de login propositalmente genérico (não revela se foi o e-mail ou a senha que errou — evita enumeração de usuários)
- **Transação de banco de dados** no fechamento de pedido: grava o pedido, os itens e baixa o estoque como uma unidade atômica — se qualquer passo falhar, tudo é desfeito (testado simulando estoque insuficiente)
- **Preço e identidade do comprador nunca vêm do front** — o back-end busca o preço real do produto no banco e identifica o cliente pelo token, não por dado que o cliente poderia manipular
- **Integração de pagamento real** com Mercado Pago (Checkout Pro, ambiente sandbox) incluindo webhook para atualização assíncrona de status
- **Queries parametrizadas** em todo acesso ao banco, prevenindo SQL Injection
- **42 testes manuais documentados**, cobrindo casos de sucesso, erro e borda (estoque insuficiente, acesso cruzado entre contas, token inválido/expirado)

## Stack

**Back-end:** Node.js, Express, MySQL, mysql2, bcrypt, jsonwebtoken, Mercado Pago SDK, cors, dotenv
**Front-end:** React, Vite, React Router, Tailwind CSS v4, Context API

## Estrutura

```
Multiverso_colecionaveis/
├── src/                      → API
│   ├── config/                 → conexão com o banco, credenciais do Mercado Pago
│   ├── routes/                  → definição das rotas
│   ├── controllers/              → HTTP: recebe requisição, valida entrada, responde
│   ├── services/                  → regra de negócio
│   ├── models/                     → queries no banco
│   └── middlewares/                 → autenticação (cliente e admin)
├── frontend/                 → React
│   └── src/
│       ├── pages/               → telas
│       ├── components/           → componentes reutilizáveis
│       ├── context/               → estado global (carrinho)
│       └── services/               → chamadas à API
├── create.sql                → schema do banco
├── insert.sql                 → dados de exemplo (3 categorias, 18 produtos)
└── planilha_testes.xlsx      → log de testes manuais
```

## Modelo de dados

8 tabelas: `cliente`, `endereco`, `categoria`, `produto`, `pedido`, `item_pedido`, `pagamento`, `usuario_admin`. `item_pedido` resolve a relação N:N entre pedido e produto e guarda o preço no momento da compra — alterar o preço de um produto depois não afeta pedidos já feitos.

## Rotas principais

| Rota | Método | Auth |
|---|---|---|
| `/produtos` `?categoria=` `?nome=` | GET | — |
| `/produtos/:id` | GET | — |
| `/categorias` | GET | — |
| `/clientes` | POST | — |
| `/login` | POST | — |
| `/enderecos` | POST | Cliente |
| `/pedidos` | POST, GET | Cliente |
| `/pedidos/:id` | GET | Cliente (dono) |
| `/pagamentos/:pedidoId` | POST | Cliente |
| `/webhooks/mercadopago` | POST | Mercado Pago |
| `/admin/login` | POST | — |
| `/produtos` | POST, PUT `:id`, DELETE `:id` | Admin |
| `/admin/pedidos` | GET, PUT `:id/status` | Admin |

## Rodando localmente

### Pré-requisitos
Node.js e MySQL instalados.

### Banco de dados
```sql
SOURCE create.sql;
SOURCE insert.sql;
```

### API
```bash
npm install
```
Cria um `.env` na raiz (modelo em `.env.example`):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=multiverso_colecionaveis
PORT=3000
JWT_SECRET=uma_frase_longa_e_aleatoria
MP_ACCESS_TOKEN=seu_access_token_de_teste_do_mercado_pago
```
```bash
npx nodemon src/server.js
```

### Front-end
```bash
cd frontend
npm install
npm run dev
```

Front em `http://localhost:5173`, API em `http://localhost:3000`.

### Conta de administrador (demo)
| | |
|---|---|
| URL | `/admin` |
| E-mail | admin@multiversocolecionaveis.com.br |
| Senha | admin123 |

## O que eu faria diferente numa v2

- Webhook do Mercado Pago testado manualmente (via Thunder Client) em vez de ao vivo — exigiria expor a porta local publicamente (ex: ngrok) pra validar o disparo automático
- Frete calculado no front via ViaCEP; o ideal é essa lógica morar no back-end
- Migrar o back-end para TypeScript, tipando contratos entre camadas

## Autor

Lucas Assumpção — [GitHub](https://github.com/Lucas-Assumpcao)

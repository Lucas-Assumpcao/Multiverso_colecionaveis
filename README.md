# Multiverso Colecionáveis

Loja virtual full-stack para colecionáveis e action figures — construída do zero: modelagem de banco, API REST com autenticação, integração de pagamento real e front-end em React.

> "Todo fandom, um só lugar."

## Por que este projeto

Comecei este projeto pra praticar arquitetura de back-end de ponta a ponta — não só fazer rotas funcionarem, mas tomar as decisões que times de verdade tomam: onde validar, onde confiar (ou não) no dado que chega do cliente, como separar responsabilidades em camadas, e como tratar erro de forma que signifique alguma coisa pra quem consume a API.

## Destaques técnicos

- **Arquitetura em camadas** (routes → controllers → services → models), separando HTTP, regra de negócio e acesso a dado — cada camada pode mudar sem afetar as outras
- **Autenticação JWT** com dois níveis de acesso (cliente e administrador), usando o mesmo mecanismo mas tokens com escopos diferentes, validados por middlewares distintos
- **Senha nunca armazenada em texto puro** — hash com bcrypt, e erro de login propositalmente genérico (não revela se foi o e-mail ou a senha que errou — evita enumeração de usuários)
- **Transação de banco de dados** no fechamento de pedido: grava o pedido, os itens e baixa o estoque como uma unidade atômica — se qualquer passo falhar, tudo é desfeito (testado simulando estoque insuficiente)
- **Preço e identidade do comprador nunca vêm do front** — o back-end busca o preço real do produto no banco e identifica o cliente pelo token, não por dado que o cliente poderia manipular
- **Integração de pagamento real** com Mercado Pago (Checkout Pro, ambiente sandbox) incluindo webhook para atualização assíncrona de status
- **Queries parametrizadas** em todo acesso ao banco, prevenindo SQL Injection
- **61 casos documentados (39 automáticos e 22 manuais)** cobrindo sucesso, erro e borda (estoque insuficiente, acesso cruzado entre contas, token inválido/expirado)

## Stack

**Back-end:** Node.js, Express, MySQL/MariaDB (`mysql2`), bcrypt, jsonwebtoken, Mercado Pago SDK, cors, dotenv

## Front-end

**Stack:** React, Vite, React Router, Tailwind CSS v4, Context API e lucide-react.

Funcionalidades principais:

- Carrinho lateral com controle de quantidade e estoque.
- Busca de produtos com sugestões no campo do cabeçalho.
- Catálogo com filtros e paginação no cliente (12 produtos por página).
- Checkout em etapas com endereço, revisão e pagamento via Mercado Pago.
- Painel administrativo para indicadores, produtos e pedidos.

### Escopo de verificação visual

As telas públicas e os estados sem dados foram verificados em viewport de 360 px. Sem a API ativa e sem login, `/endereco`, `/pagamento`, `/confirmacao`, `/meus-pedidos` e as telas do admin foram observadas somente em estados de redirecionamento ou vazios; as telas autenticadas com dados reais permanecem a validar. As razões de contraste registradas em [requisitos-situacao.md](./docs/requisitos-situacao.md) são cálculos das combinações de cores, não uma auditoria completa de todas as telas. Lighthouse não foi executado.

## Capturas de tela

As capturas serão organizadas em [docs/prints/](./docs/prints/):

- `home-desktop`
- `home-mobile`
- `categoria`
- `detalhe`
- `carrinho-lateral`
- `checkout-endereco`
- `admin-painel`
- `admin-produtos`

## Documentação

- [briefing.md](./briefing.md)
- [banco-de-dados.md](./banco-de-dados.md)
- [api.md](./api.md)
- [manual-do-usuario.md](./manual-do-usuario.md)
- [requisitos-situacao.md](./docs/requisitos-situacao.md)
- [planilha-testes.xlsx](./planilha-testes.xlsx)
- [manual-de-marca-multiverso-colecionaveis.pdf](./manual-de-marca-multiverso-colecionaveis.pdf)
- [documento-requisitos-multiverso-colecionaveis.pdf](./documento-requisitos-multiverso-colecionaveis.pdf)
- [docs/atualizar-imagens.sql](./docs/atualizar-imagens.sql)

## Estrutura

```text
Multiverso_colecionaveis/
├── src/                        → API
│   ├── config/                   → conexão com o banco, credenciais do Mercado Pago
│   ├── routes/                   → definição das rotas
│   ├── controllers/              → HTTP: recebe requisição, valida entrada, responde
│   ├── services/                 → regra de negócio
│   ├── models/                   → queries no banco
│   └── middlewares/              → autenticação (cliente e admin)
├── frontend/                  → React
│   └── src/
│       ├── pages/                → telas
│       ├── components/           → componentes reutilizáveis
│       ├── context/              → estado global (carrinho)
│       └── services/             → chamadas à API
├── docs/                      → materiais auxiliares e migrações
│   ├── migracoes/              → scripts SQL de ajuste do schema e catálogo
│   ├── atualizar-imagens.sql   → atualização de caminhos das imagens
│   ├── requisitos-situacao.md  → situação dos requisitos
│   └── prints/                 → capturas de tela do front-end
├── tests/                     → testes automatizados
│   ├── api.test.js
│   └── limpar-testes.sql      → limpeza manual dos registros de smoke test
├── create.sql                 → schema MySQL/MariaDB
├── insert.sql                 → dados iniciais de demonstração
├── planilha-testes.xlsx       → planilha de testes
├── briefing.md                → visão do projeto
├── api.md                     → documentação da API
├── banco-de-dados.md          → descrição do banco
├── manual-do-usuario.md       → guia do usuário
├── manual-de-marca-multiverso-colecionaveis.pdf
├── documento-requisitos-multiverso-colecionaveis.pdf
├── package.json               → scripts da API
├── .env.example               → exemplo de variáveis de ambiente
├── .gitignore
├── README.md
└── .git/
```

## Modelo de dados

O banco relacional usa as tabelas `cliente`, `endereco`, `categoria`, `produto`, `pedido`, `item_pedido`, `pagamento` e `usuario_admin`. Cada item guarda o preço unitário praticado na compra. Os scripts `create.sql` e `insert.sql` preparam o esquema e os dados de exemplo.

## Rotas principais

| Rota                               | Método                        | Auth           |
| ---------------------------------- | ----------------------------- | -------------- |
| `/produtos` `?categoria=` `?nome=` | GET                           | —              |
| `/produtos/:id`                    | GET                           | —              |
| `/categorias`                      | GET                           | —              |
| `/clientes`                        | POST                          | —              |
| `/login`                           | POST                          | —              |
| `/enderecos`                       | POST                          | Cliente        |
| `/pedidos`                         | POST, GET                     | Cliente        |
| `/pedidos/:id`                     | GET                           | Cliente (dono) |
| `/pagamentos/:pedidoId`            | POST                          | Cliente        |
| `/webhooks/mercadopago`            | POST                          | Mercado Pago   |
| `/admin/login`                     | POST                          | —              |
| `/produtos`                        | POST, PUT `:id`, DELETE `:id` | Admin          |
| `/admin/pedidos`                   | GET, PUT `:id/status`         | Admin          |

## Rodando localmente

### Pré-requisitos

Node.js 20 ou superior, npm e MySQL 8+ ou MariaDB com InnoDB. Para executar pedidos, o usuário do banco precisa de permissão para ler e gravar nas tabelas do projeto.

### Banco de dados

Crie o schema e carregue o catálogo pelo DBeaver: abra e execute `create.sql` primeiro e `insert.sql` em seguida. Depois execute `npm run seed` para criar o administrador configurado no `.env.example` e garantir as categorias e produtos de demonstração. O seed pode ser executado novamente sem duplicar esses registros.

### API

```bash
npm install
```

Copie `.env.example` para `.env` e informe a conexão do MySQL/MariaDB. Nunca envie o `.env` ao Git.

Exemplo para serviço local:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_local
DB_NAME=multiverso_colecionaveis
PORT=3000
JWT_SECRET=uma_frase_longa_e_aleatoria
MP_ACCESS_TOKEN=seu_access_token_de_teste_do_mercado_pago
ADMIN_EMAIL=admin@multiversocolecionaveis.com.br
ADMIN_SENHA=admin123
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

```bash
npm run seed # cria o administrador e garante os dados iniciais
npm run dev  # desenvolvimento
# npm start  # produção
```

### Front-end

```bash
cd frontend
npm install
npm run dev
```

Front em `http://localhost:5173`, API em `http://localhost:3000` e banco MySQL/MariaDB em `localhost:3306` (ou nas portas configuradas no serviço).

### Publicação na Vercel

O front-end e a API podem ser publicados como projetos separados ligados ao mesmo repositório, com `frontend/` como diretório raiz do front e a raiz do repositório para a API Express. Configure as variáveis da API no projeto do back-end (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `JWT_SECRET`, `MP_ACCESS_TOKEN`, `FRONTEND_URL` e `CORS_ORIGINS`) e `VITE_API_URL` no projeto do front-end. O banco precisa estar hospedado em um serviço externo acessível pela Vercel; um MySQL/MariaDB rodando no computador do SENAI não fica acessível à aplicação publicada. Use SSL e um limite de conexões adequado ao provedor. A região da função deve ficar próxima do banco.

## Testes

Com a API em execução e o banco de dados populado, rode na raiz do projeto:

```bash
npm test
```

Pré-requisitos:

- back-end em execução
- schema criado com `create.sql` e dados preparados com `insert.sql` e `npm run seed`
- testes automatizados criam clientes e pedidos de teste; use a base de desenvolvimento, não a base de produção
- teste opcional do Mercado Pago: `RUN_MP=1` em ambiente Unix/macOS ou, no PowerShell:

```powershell
$env:RUN_MP="1"; npm test
```

Documentação de testes: [planilha-testes.xlsx](./planilha-testes.xlsx)

### Conta de administrador (demo)

|        |                                      |
| ------ | ------------------------------------ |
| URL    | `/admin`                             |
| E-mail | admin@multiversocolecionaveis.com.br |
| Senha  | admin123                             |

## O que eu faria diferente numa v2

- webhook implementado, ainda não exercitado com notificação real
- frete fixo definido no servidor; o ViaCEP só preenche o endereço
- migrar o back-end para TypeScript, tipando contratos entre camadas

## Autor

Lucas Assumpção — [GitHub](https://github.com/Lucas-Assumpcao)

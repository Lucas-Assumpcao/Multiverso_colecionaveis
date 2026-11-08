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
- **Integração com o Mercado Pago** (Checkout Pro em sandbox), com webhook para atualização assíncrona do status
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

As telas públicas e os estados sem dados foram verificados em viewport de 360 px. Após a publicação, o responsável pelo projeto executou os testes funcionais e administrativos no site, incluindo o acesso ao banco Aiven. Isso não substitui uma auditoria visual de todos os estados. As razões de contraste registradas em [requisitos-situacao.md](./docs/requisitos-situacao.md) são cálculos das combinações de cores. Lighthouse não foi executado.
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
- [Modelos conceitual e lógico](./docs/modelos-de-dados.md)
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

Node.js 22.12 ou superior (ou Node.js 20.19 ou superior), npm e MySQL 8+ ou MariaDB com InnoDB. Para executar pedidos, o usuário do banco precisa de permissão para ler e gravar nas tabelas do projeto.

### Banco de dados

Crie o schema e carregue o catálogo pelo DBeaver ou MySQL Workbench: execute create.sql primeiro e insert.sql em seguida. Depois execute npm run seed para inserir os dados de demonstração e criar o administrador se o e-mail configurado ainda não existir. O seed não redefine a senha de um administrador existente; para alterá-la, atualize senha_hash com um hash bcrypt. Execute o seed apenas em uma base de desenvolvimento ou demonstração.

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

### Publicação em produção: Vercel + Aiven

O front-end, a API e o banco são serviços separados. O front-end React/Vite e a API Express são publicados como dois projetos Vercel ligados ao mesmo repositório; o MySQL fica no Aiven. O banco local do computador ou do SENAI não é usado pela aplicação publicada.

#### Projeto do front-end na Vercel

- Configure a raiz do projeto como `frontend/`, o comando de build como `npm run build` e o diretório de saída como `dist` (a Vercel pode detectar esses valores automaticamente).
- Defina `VITE_API_URL` no ambiente **Production** com a origem pública do projeto da API, por exemplo `https://sua-api.vercel.app`. Use somente a origem: sem `/api`, sem `/categorias` e sem barra final. Essa variável é incorporada durante o build, então alterá-la exige um novo deploy do front-end.
- O arquivo `frontend/vercel.json` encaminha rotas da SPA, como `/admin` e `/admin/pedidos`, para `index.html`, permitindo que o React Router trate o caminho ao abrir ou atualizar diretamente a página.

#### Projeto da API na Vercel

- Configure a raiz do projeto como a raiz do repositório. O ponto de entrada `index.js` exporta a aplicação Express para a Vercel; localmente, o servidor continua podendo ser iniciado por `npm run dev`.
- Cadastre as variáveis abaixo em **Settings → Environment Variables**, no ambiente **Production**. Use os valores de conexão exibidos no serviço MySQL do Aiven; não coloque segredos no README, no código ou em `VITE_API_URL`.

| Variável | Uso |
| --- | --- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` | Host, porta, usuário e senha do Aiven |
| `DB_NAME` | Schema criado para o projeto: `multiverso_colecionaveis` |
| `DB_SSL` | Use `true`; o serviço Aiven exige SSL |
| `DB_SSL_CA` | Certificado CA do serviço Aiven para validar o certificado SSL quando `DB_SSL_REJECT_UNAUTHORIZED=true` |
| `DB_SSL_REJECT_UNAUTHORIZED` | Mantenha `true` quando o CA estiver configurado |
| `DB_CONNECTION_LIMIT` | Limite do pool MySQL conforme a cota do plano |
| `JWT_SECRET` | Segredo forte para assinar tokens de clientes e administradores |
| `MP_ACCESS_TOKEN` | Token do Mercado Pago para o ambiente sandbox |
| `FRONTEND_URL` | Origem pública do front-end |
| `CORS_ORIGINS` | Origem exata do front-end, sem barra final; se houver mais origens, separe por vírgula |

Salve as variáveis e faça um novo deploy da API. A Vercel não aplica mudanças de variáveis a implantações já existentes. Não use `localhost` nos valores de produção. A origem do front-end precisa coincidir exatamente com `CORS_ORIGINS`.

#### Banco MySQL no Aiven

1. Crie ou selecione o schema `multiverso_colecionaveis` na instância Aiven.
2. Conecte pelo MySQL Workbench ou DBeaver usando os dados do painel Aiven e SSL com o certificado CA do serviço.
3. Execute `create.sql` e depois `insert.sql` na conexão Aiven. Confirme o schema atual com `SELECT DATABASE()` e confira se a tabela `categoria` existe e possui dados.
4. Configure `DB_NAME=multiverso_colecionaveis` na API. O nome padrão informado pelo provedor pode ser diferente do schema criado pelos scripts; use o nome que contém as tabelas da loja.

#### Verificação do deploy

- A raiz do domínio da API (`/`) deve responder `{"status":"API no ar"}`. Essa rota confirma que o Express está ativo, mas não testa o banco.
- `GET /categorias` deve responder com a lista de categorias. Se retornar erro, consulte os Logs do projeto da API na Vercel; não envie senhas ou tokens nos relatórios.
- Abra o domínio do front-end e teste também uma rota direta, como `/admin`. A autenticação do painel e as chamadas protegidas dependem da API e do registro administrativo no schema Aiven.
- Mudanças em `VITE_API_URL` exigem novo build do front-end; mudanças em variáveis `DB_*`, `JWT_SECRET`, `MP_ACCESS_TOKEN`, `FRONTEND_URL` ou `CORS_ORIGINS` exigem novo deploy da API.

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

### Conta local de administrador (demo)

| Campo | Valor |
| --- | --- |
| URL | `/admin` |
| E-mail local padrão | `admin@multiversocolecionaveis.com.br` |
| Senha local padrão | `admin123` |

Esses valores são usados somente pelo seed local quando não há `ADMIN_EMAIL` e `ADMIN_SENHA` configurados. Não são as credenciais de produção. O seed cria o administrador se o e-mail ainda não existir; ele não redefine a senha de um administrador existente. Em produção, mantenha a senha no banco somente como hash bcrypt e não documente a senha real.

## O que eu faria diferente numa v2

- webhook implementado, ainda não exercitado com notificação real
- frete fixo definido no servidor; o ViaCEP só preenche o endereço
- migrar o back-end para TypeScript, tipando contratos entre camadas

## Autor

Lucas Assumpção — [GitHub](https://github.com/Lucas-Assumpcao)

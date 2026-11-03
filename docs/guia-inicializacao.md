# Guia de inicialização rápida

Este documento reúne os passos básicos para rodar o projeto Multiverso Colecionáveis: MongoDB, API (`server.js`), frontend e testes no Postman.

## 1) Pré-requisitos

Antes de iniciar, verifique se você tem instalado:

- Node.js 20.19 ou superior
- npm
- MongoDB configurado como replica set ou MongoDB Atlas
- Git
- Postman

Opcional:

- MongoDB Compass ou `mongosh` para visualizar o banco

## 2) Clonar e instalar dependências

Na raiz do projeto:

```bash
npm install
```

No frontend:

```bash
cd frontend
npm install
```

## 3) Configurar o MongoDB

### 3.1 Iniciar o MongoDB

As transações usadas ao criar pedidos exigem um replica set. Você pode usar MongoDB Atlas ou configurar uma instância MongoDB local como replica set.

O URI local de exemplo em `.env.example` usa `replicaSet=rs0`. Configure e inicialize esse replica set antes de executar a aplicação.

### 3.2 Carregar os dados de demonstração

Depois de configurar o `.env` na seção 4, execute na raiz do projeto:

```bash
npm run seed
```

O comando cria categorias, produtos e um administrador de demonstração sem duplicar os registros existentes. A senha padrão do administrador é `admin123`; defina `ADMIN_EMAIL` e `ADMIN_SENHA` no `.env` antes de executar em ambientes não descartáveis.

## 4) Configurar variáveis de ambiente

Na raiz do projeto, copie o exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/multiverso_colecionaveis?replicaSet=rs0
PORT=3000
JWT_SECRET=uma_frase_longa_e_aleatoria
MP_ACCESS_TOKEN=seu_access_token_de_teste_do_mercado_pago
ADMIN_EMAIL=admin@multiversocolecionaveis.com.br
ADMIN_SENHA=admin123
```

Use a URI fornecida pelo MongoDB Atlas se estiver usando o serviço gerenciado.

## 5) Iniciar a API (`server.js`)

Na raiz do projeto:

```bash
npm run dev
```

Ou em modo produção:

```bash
npm start
```

A API será iniciada em:

```text
http://localhost:3000
```

O `server.js` registra as rotas principais, como:

- `/produtos`
- `/categorias`
- `/clientes`
- `/login`
- `/pedidos`
- `/enderecos`
- `/pagamentos`
- `/admin`

## 6) Iniciar o frontend

Abra outro terminal e rode:

```bash
cd frontend
npm run dev
```

O frontend geralmente será servido em:

```text
http://localhost:5173
```

Se quiser testar o fluxo completo da loja, abra essa URL no navegador e use a API em `http://localhost:3000`.

## 7) Testar no Postman

### 7.1 Verificar se a API está online

Crie uma requisição do tipo `GET` para:

```text
http://localhost:3000/
```

Resposta esperada:

```json
{
  "status": "API no ar"
}
```

### 7.2 Listar produtos

```text
GET http://localhost:3000/produtos
```

### 7.3 Registrar cliente

```text
POST http://localhost:3000/clientes
```

Body em JSON:

```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "cpf": "123.456.789-09"
}
```

### 7.4 Login

```text
POST http://localhost:3000/login
```

Body:

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOi..."
}
```

Copie o valor do token e use em rotas protegidas:

```http
Authorization: Bearer <token>
```

### 7.5 Fluxo de pedidos

Para criar um pedido, normalmente você precisa:

1. Fazer login
2. Buscar produtos
3. Montar o payload do pedido
4. Enviar a requisição autenticada para `/pedidos`

Exemplo:

```text
POST http://localhost:3000/pedidos
```

```json
{
  "clienteId": 1,
  "enderecoId": 1,
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 1
    }
  ]
}
```

## 8) Fluxo recomendado para iniciar tudo

Em ordem ideal:

1. Inicie o MongoDB replica set ou configure o MongoDB Atlas
2. Crie o `.env` e configure `MONGODB_URI`
3. Rode `npm install`
4. Carregue os dados com `npm run seed`
5. Inicie a API com `npm run dev`
6. Rode o frontend com `npm run dev` dentro de `frontend`
7. Teste os endpoints no Postman

## 9) Solução de problemas comuns

### Erro de conexão com o banco

Sintomas:

- `ER_ACCESS_DENIED_ERROR`
- `ECONNREFUSED`
- `Unknown database`

Verifique:

- o MongoDB está acessível
- `MONGODB_URI` está correto
- a instância suporta replica set/transações

### Porta ocupada

Se a porta 3000 ou 5173 estiver ocupada, ajuste a porta no arquivo de configuração ou encerre o processo que está usando a porta.

### CORS

Se o frontend não conseguir acessar a API, verifique se `cors` está habilitado no `server.js`.

### Token inválido

Se a autenticação falhar:

- confirme se o token foi enviado no header `Authorization`
- use o formato `Bearer <token>`
- verifique se o token foi gerado no login da mesma base

### Frontend sem carregar a API

Confirme se a API local está ativa em `http://localhost:3000` e se o serviço do frontend está apontando para a URL correta em `frontend/src/services/api.js` ou arquivos equivalentes.

## 10) URLs úteis

- API backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Banco local: MongoDB em `localhost` (replica set)

## 11) Conta administrativa de exemplo

O projeto já inclui um usuário admin de demonstração. Em geral:

- Email: `admin@multiversocolecionaveis.com.br`
- Senha: `admin123`

Use isso para testar rotas administrativas como `/admin`.

## 12) Dica final

Para facilitar o desenvolvimento, mantenha sempre 3 terminais abertos:

- 1 terminal: API (`npm run dev`)
- 1 terminal: frontend (`cd frontend && npm run dev`)
- 1 terminal: banco / consultas / testes

Isso deixa o ciclo de desenvolvimento mais simples e rápido.

Se quiser, posso também criar uma versão mais enxuta em formato de checklist para imprimir ou uma documentação com exemplos de chamadas prontas para o Postman.

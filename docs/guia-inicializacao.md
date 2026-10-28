# Guia de inicialização rápida

Este documento reúne os passos básicos para rodar o projeto Multiverso Colecionáveis: banco MariaDB, API (`server.js`), frontend e testes no Postman.

## 1) Pré-requisitos

Antes de iniciar, verifique se você tem instalado:

- Node.js 18+ ou 20+
- npm
- MariaDB (compatível com MySQL)
- Git
- Postman

Opcional:

- DBeaver ou phpMyAdmin para visualizar o banco
- MariaDB CLI (`mysql`) com acesso ao terminal

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

## 3) Configurar o banco MariaDB

### 3.1 Iniciar o MariaDB

Se o MariaDB estiver instalado localmente, inicie o serviço:

Linux (Ubuntu/Debian):

```bash
sudo systemctl start mariadb
```

Ou via XAMPP/WAMP se você usar uma instalação guiada.

### 3.2 Criar o banco e importar os dados

Acesse o MariaDB com o cliente de sua preferência:

```bash
mysql -u root -p
```

Depois execute:

```sql
SOURCE /caminho/para/o/projeto/create.sql;
SOURCE /caminho/para/o/projeto/insert.sql;
```

Se preferir usar o MySQL Workbench, DBeaver ou phpMyAdmin, importe os arquivos:

- `create.sql`
- `insert.sql`

Importante: o projeto usa o banco `multiverso_colecionaveis` e o arquivo `create.sql` já cria a base caso ela não exista.

## 4) Configurar variáveis de ambiente

Na raiz do projeto, copie o exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=multiverso_colecionaveis
PORT=3000
JWT_SECRET=uma_frase_longa_e_aleatoria
MP_ACCESS_TOKEN=seu_access_token_de_teste_do_mercado_pago
```

Se você estiver usando um MariaDB com usuário diferente do `root`, ajuste:

- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

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

1. Suba o MariaDB
2. Importe `create.sql` e `insert.sql`
3. Crie o `.env`
4. Rode `npm install`
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

- o MariaDB está rodando
- usuário/senha do `.env` estão corretos
- o banco `multiverso_colecionaveis` existe

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
- Banco local: MariaDB em `localhost`

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

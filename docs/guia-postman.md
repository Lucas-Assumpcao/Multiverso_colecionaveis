# Guia rápido para Postman, MongoDB, front e API

Este guia foi pensado para facilitar a primeira execução do projeto sem ficar consultando vários arquivos ao mesmo tempo.

## 1) Checklist de inicialização

### Banco de dados (MongoDB)

1. Verifique se o MongoDB está ativo e configurado como replica set ou use o MongoDB Atlas. O fluxo de criação de pedidos usa transações, que não funcionam em instância standalone.
2. Copie `.env.example` para `.env` e configure `MONGODB_URI`.
3. Na raiz do projeto, carregue os dados de demonstração:

```bash
npm run seed
```

O seed cria as coleções necessárias e dados de demonstração. Os arquivos `.sql` no repositório são legados do MySQL e não devem ser executados nesta versão.

### API (`server.js`)

Na raiz do projeto:

```bash
npm install
cp .env.example .env
npm run dev
```

Se tudo estiver correto, a API deve subir em:

```text
http://localhost:3000
```

### Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A aplicação frontend normalmente abre em:

```text
http://localhost:5173
```

## 2) Arquivo `.env`

Exemplo:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/multiverso_colecionaveis?replicaSet=rs0
PORT=3000
JWT_SECRET=uma_frase_longa_e_aleatoria
MP_ACCESS_TOKEN=seu_access_token_de_teste_do_mercado_pago
ADMIN_EMAIL=admin@multiversocolecionaveis.com.br
ADMIN_SENHA=admin123
```

## 3) Como usar no Postman

### Organização recomendada

Crie uma collection chamada:

```text
Multiverso Colecionáveis
```

E adicione as pastas:

- Auth
- Clientes
- Produtos
- Endereços
- Pedidos
- Admin

## 4) Exemplos de requisições

### 4.1 Verificar se a API está no ar

Método: `GET`

URL:

```text
http://localhost:3000/
```

Resposta esperada:

```json
{
  "status": "API no ar"
}
```

### 4.2 Listar produtos

Método: `GET`

URL:

```text
http://localhost:3000/produtos
```

Também pode filtrar por categoria ou nome:

```text
http://localhost:3000/produtos?categoria=1
http://localhost:3000/produtos?nome=figure
```

### 4.3 Cadastrar cliente

Método: `POST`

URL:

```text
http://localhost:3000/clientes
```

Body (JSON):

```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "123456",
  "cpf": "123.456.789-09"
}
```

### 4.4 Fazer login

Método: `POST`

URL:

```text
http://localhost:3000/login
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Importante: copie o token retornado e use em rotas protegidas.

### 4.5 Criar endereço do cliente

Método: `POST`

URL:

```text
http://localhost:3000/enderecos
```

Headers:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "cep": "01000-000",
  "logradouro": "Avenida Paulista",
  "numero": "1000",
  "complemento": "Ap 101",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP"
}
```

### 4.6 Listar pedidos do cliente

Método: `GET`

URL:

```text
http://localhost:3000/pedidos
```

Headers:

```http
Authorization: Bearer <token>
```

### 4.7 Criar pedido

Método: `POST`

URL:

```text
http://localhost:3000/pedidos
```

Headers:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

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

### 4.8 Login de administrador

Método: `POST`

URL:

```text
http://localhost:3000/admin/login
```

Body:

```json
{
  "email": "admin@multiversocolecionaveis.com.br",
  "senha": "admin123"
}
```

## 5) Como testar o fluxo completo

A sequência mais simples é:

1. Criar cliente (`POST /clientes`)
2. Fazer login (`POST /login`)
3. Salvar o token
4. Criar endereço (`POST /enderecos`)
5. Buscar produtos (`GET /produtos`)
6. Criar pedido (`POST /pedidos`)
7. Verificar o pedido em (`GET /pedidos`)

## 6) Dicas úteis no Postman

- Use a aba `Tests` para validar respostas automaticamente.
- Salve o token em uma variável global:

```text
{{token}}
```

- Configure as variáveis de ambiente:

```text
baseUrl = http://localhost:3000
```

- Para rotas autenticadas, sempre use o header:

```http
Authorization: Bearer {{token}}
```

## 7) Problemas comuns

### API não responde

Verifique se a aplicação está rodando:

```bash
npm run dev
```

### Banco não conecta

Confirme:

- MongoDB está ativo e acessível
- `MONGODB_URI` no `.env` está correto
- a instância está configurada como replica set para suportar transações

### Erro de CORS

Se o front não consegue chamar a API, verifique se o backend está ativo e se `cors` está habilitado no `server.js`.

### Token inválido

Use o cabeçalho no formato correto:

```http
Authorization: Bearer <token>
```

## 8) Resumo em 5 passos

1. Inicie o MongoDB replica set ou configure o MongoDB Atlas.
2. Configure `MONGODB_URI` no `.env`.
3. Execute `npm run seed` na raiz.
4. Execute `npm run dev` na raiz.
5. Abra o frontend e teste as rotas no Postman.

Se quiser, posso também criar um arquivo com a collection em formato JSON do Postman para importar direto no programa.

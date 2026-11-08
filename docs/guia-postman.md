# Guia do Postman

Este guia prepara a API e descreve a ordem básica de chamadas. Os contratos completos, exemplos de corpo e respostas ficam em [api.md](../api.md).

## Preparar o ambiente

1. Inicie o MySQL 8+ ou MariaDB.
2. No DBeaver, execute `create.sql` e depois `insert.sql`.
3. Copie `.env.example` para `.env` e configure a conexão e o segredo JWT.
4. Execute `npm install` e `npm run seed` na raiz para criar o administrador configurado no ambiente.
5. Inicie a API com `npm run dev`; ela responde por padrão em `http://localhost:3000`.

O seed é idempotente para categorias, produtos e administrador existente. Use um banco local de desenvolvimento para os testes, pois eles criam clientes, endereços e pedidos.

## Criar uma collection

Crie uma collection `Multiverso Colecionáveis` com pastas para Catálogo, Cliente, Endereços, Pedidos, Pagamentos e Admin. Defina a variável `baseUrl` como `http://localhost:3000`.

Para rotas protegidas, envie:

```http
Authorization: Bearer {{token}}
```

## Ordem recomendada para validar uma compra

1. `GET {{baseUrl}}/` — verifica se a API está no ar.
2. `GET {{baseUrl}}/categorias` e `GET {{baseUrl}}/produtos` — consulta o catálogo.
3. `POST {{baseUrl}}/clientes` — cria uma conta de cliente.
4. `POST {{baseUrl}}/login` — autentica o cliente; guarde o token retornado.
5. `POST {{baseUrl}}/enderecos` — cria um endereço com o token do cliente.
6. `POST {{baseUrl}}/pedidos` — cria um pedido com `endereco_id` e itens `{ produto_id, quantidade }`.
7. `GET {{baseUrl}}/pedidos/{{pedidoId}}` — confere os dados do pedido autenticado.

O servidor busca preços e identidade do cliente no banco. Não envie preço calculado pelo navegador como fonte confiável.

## Validar a administração

1. `POST {{baseUrl}}/admin/login` — autentica com `ADMIN_EMAIL` e `ADMIN_SENHA` configurados no ambiente.
2. Guarde o token administrativo em uma variável separada.
3. Use o token para `GET {{baseUrl}}/admin/pedidos`, alterar status, e executar o CRUD em `/produtos`.

## Problemas comuns

- **A API não conecta ao banco:** confirme que MySQL/MariaDB está iniciado, que `create.sql` foi executado e que as variáveis `DB_*` estão corretas.
- **A API não inicia:** confirme que as dependências estão instaladas e que a porta configurada está disponível.
- **401 ou 403:** confira o token e use o token administrativo nas rotas de administração.
- **Estoque insuficiente:** confira o estoque atual do produto; a criação do pedido não deve deixar baixa parcial.
- **CORS no navegador:** inclua a origem do front em `CORS_ORIGINS`.

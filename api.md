# API — Multiverso Colecionáveis

API REST em Node.js + Express. Todas as respostas são JSON.

| | |
|---|---|
| URL base (desenvolvimento) | `http://localhost:3000` |
| Autenticação | Header `Authorization: Bearer <token>` (JWT) |
| Validade do token | Cliente: 1 hora · Administrador: 2 horas |
| Formato de erro | `{ "mensagem": "texto explicando o problema" }` |

## Códigos de status usados

| Código | Quando |
|---|---|
| 200 | Deu certo |
| 201 | Recurso criado |
| 400 | Requisição mal formada ou dado inválido |
| 401 | Sem token, token inválido/expirado ou credenciais erradas |
| 403 | Token válido, mas sem permissão (cliente tentando usar rota de administrador) |
| 404 | Recurso inexistente (ou que não pertence a quem pediu) |
| 409 | Conflito com o estado atual (e-mail já cadastrado, estoque insuficiente) |
| 500 | Erro interno do servidor |

> **Valores monetários** vêm como texto decimal, por exemplo `"249.90"`. Converta com `Number()` antes de calcular.

---

## Catálogo (público)

### `GET /produtos`

Lista os produtos. Parâmetro opcional: `?nome=goku` (busca por parte do nome, sem diferenciar maiúsculas).

```json
[
  {
    "id": 2,
    "categoria_id": 1,
    "nome": "Action Figure Goku Ultra Instinct",
    "descricao": "Dragon Ball Super — coleção premium",
    "preco": "229.90",
    "estoque": 10,
    "imagem_url": "/produtos/goku.jpg"
  }
]
```

### `GET /produtos/:id`

Devolve um produto (mesmo formato acima). Id inexistente: `404` com `{ "mensagem": "Produto não encontrado" }`.

### `GET /produtos/categoria/:categoriaId`

Lista os produtos de uma categoria. Categoria sem produtos devolve `[]`.

### `GET /categorias`

```json
[
  { "id": 1, "nome": "Animes/Mangás" },
  { "id": 2, "nome": "Super-heróis (Marvel/DC)" },
  { "id": 3, "nome": "Cultura Pop/Nostalgia/Videogames" }
]
```

---

## Clientes e login

### `POST /clientes`

```json
{ "nome": "Maria Souza", "email": "maria@email.com", "senha": "senha123", "cpf": "000.000.000-00" }
```

`cpf` é opcional.

- `201` → `{ "id": 5, "mensagem": "Cliente cadastrado com sucesso" }`
- `400` → campo obrigatório faltando (`nome`, `email` ou `senha`)
- `409` → `{ "mensagem": "E-mail já cadastrado" }`

### `POST /login`

```json
{ "email": "maria@email.com", "senha": "senha123" }
```

- `200`
  ```json
  {
    "id": 5,
    "nome": "Maria Souza",
    "email": "maria@email.com",
    "cpf": null,
    "data_cadastro": "2026-10-25T14:00:00.000Z",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
  A resposta nunca inclui `senha_hash`.
- `401` → `{ "mensagem": "Credenciais inválidas" }`. A mensagem é a mesma para e-mail inexistente e senha errada, de propósito: assim ninguém descobre quais e-mails têm conta.

---

## Endereços 🔒 cliente

### `POST /enderecos`

```json
{
  "cep": "06400-000", "logradouro": "Rua das Coleções", "numero": "123",
  "complemento": "Apto 45", "bairro": "Centro", "cidade": "Barueri", "estado": "SP"
}
```

`complemento` é opcional. O endereço fica ligado ao cliente do token.

- `201` → `{ "id": 3 }`
- `400` → campo obrigatório faltando

---

## Pedidos 🔒 cliente

### `POST /pedidos`

```json
{
  "endereco_id": 3,
  "itens": [
    { "produto_id": 2, "quantidade": 1 },
    { "produto_id": 9, "quantidade": 2 }
  ]
}
```

O servidor decide o que importa para o dinheiro e para a identidade:

- **Preço:** lido do banco, nunca do body.
- **Frete:** fixo em R$ 15,00; qualquer `valor_frete` enviado é ignorado.
- **Cliente:** vem do token, não do body.
- **Endereço:** precisa pertencer ao cliente do token.
- **Itens:** de 1 a 50, `quantidade` inteira entre 1 e 99; o mesmo produto repetido é somado.
- **Estoque:** baixado na mesma transação em que o pedido é gravado.

Respostas:

- `201` → `{ "id": 7, "mensagem": "Pedido criado com sucesso" }`
- `400` → itens vazios, quantidade inválida (zero, negativa, decimal ou acima de 99)
- `404` → produto ou endereço inexistente (ou de outro cliente)
- `409` → `{ "mensagem": "Estoque insuficiente ..." }`. Nada é gravado.

### `GET /pedidos`

Lista os pedidos do cliente logado, do mais recente para o mais antigo.

```json
[
  {
    "id": 7, "cliente_id": 5, "endereco_id": 3,
    "data_pedido": "2026-10-25T14:10:00.000Z",
    "status": "aguardando_pagamento",
    "valor_frete": "15.00", "valor_total": "244.90"
  }
]
```

### `GET /pedidos/:id`

Devolve o pedido com os itens. Pedido de outro cliente devolve `404`, igual a pedido inexistente.

```json
{
  "id": 7, "status": "aguardando_pagamento",
  "valor_frete": "15.00", "valor_total": "244.90",
  "itens": [
    { "produto_id": 2, "nome": "Action Figure Goku Ultra Instinct", "quantidade": 1, "preco_unitario": "229.90" }
  ]
}
```

Status possíveis: `aguardando_pagamento`, `pago`, `enviado`, `entregue`, `cancelado`.

---

## Pagamento

### `POST /pagamentos/:pedidoId` 🔒 cliente

Cria uma preferência de pagamento no Mercado Pago (Checkout Pro, ambiente de testes) para o pedido e registra uma tentativa `pendente`.

- `200` → `{ "init_point": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..." }`. O front redireciona o cliente para esse endereço.
- `404` → pedido inexistente ou de outro cliente

O cliente escolhe Pix, cartão ou boleto na página do Mercado Pago e volta para `/confirmacao`, que mostra o número do pedido e o resultado.

### `POST /webhooks/mercadopago`

Chamado pelo Mercado Pago (não pelo front) quando o pagamento muda de situação. Recebe `type=payment` e `data.id` como parâmetros.

O servidor **não confia no corpo da notificação**: ele consulta o pagamento direto na API do Mercado Pago pelo id e, a partir da resposta, atualiza `pagamento` e o `status` do pedido (aprovado → `pago`, recusado → `cancelado`). Responde sempre `200`, para o Mercado Pago não reenviar a notificação em loop.

---

## Administração

### `POST /admin/login`

```json
{ "email": "admin@multiversocolecionaveis.com.br", "senha": "admin123" }
```

- `200` → `{ "id": 1, "nome": "Admin Multiverso", "token": "eyJ..." }`. O token carrega `tipo: "admin"`.
- `401` → `{ "mensagem": "Credenciais inválidas" }`

Nas rotas abaixo (🔒 admin): sem token devolve `401`; token de cliente devolve `403`.

### `POST /produtos` 🔒 admin

```json
{
  "categoria_id": 1, "nome": "Action Figure Exemplo", "descricao": "Opcional",
  "preco": 199.9, "estoque": 5, "imagem_url": "/produtos/exemplo.jpg"
}
```

- `201` → `{ "id": 19 }`
- `400` → campos obrigatórios faltando (`categoria_id`, `nome`, `preco`, `estoque`)

### `PUT /produtos/:id` 🔒 admin

Mesmo corpo do `POST`. `200` → `{ "mensagem": "Produto atualizado" }` · `404` se o produto não existe.

### `DELETE /produtos/:id` 🔒 admin

`200` → `{ "mensagem": "Produto removido" }` · `404` se o produto não existe.

### `GET /admin/pedidos` 🔒 admin

Lista todos os pedidos, com o nome do cliente (`cliente_nome`).

### `PUT /admin/pedidos/:id/status` 🔒 admin

```json
{ "status": "enviado" }
```

- `200` → `{ "mensagem": "Status atualizado" }`
- `400` → status fora da lista de status possíveis

---

## Limitações conhecidas

- O frete é fixo; o cálculo por CEP ficou para uma versão futura. O CEP só preenche o endereço (ViaCEP).
- A listagem de produtos não tem paginação.
- Um produto que já aparece em algum pedido não pode ser excluído (restrição de chave estrangeira); hoje isso volta como erro `500`.
- Em ambiente local o Mercado Pago não consegue chamar o webhook (`localhost` não é acessível da internet). A atualização de status foi validada chamando a rota manualmente.
- O CORS está aberto para qualquer origem, adequado para desenvolvimento.

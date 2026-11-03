# Banco de dados — Multiverso Colecionáveis

SGBD: **MongoDB**, acessado pela aplicação com **Mongoose**. A URI fica em `MONGODB_URI`; os esquemas e coleções são declarados em `src/models/documentos.js`.

O banco usa as coleções `clientes`, `enderecos`, `categorias`, `produtos`, `usuarios_admin`, `pedidos`, `pagamentos` e `contadores`. Os IDs de domínio são numéricos e gerados por contador, preservando o formato usado pela API e pelo frontend. O `_id` interno do MongoDB não é exposto pela API.

## Documentos e relacionamentos

| Coleção | Conteúdo e referências |
|---|---|
| `clientes` | Nome, e-mail único, hash da senha, CPF opcional e data de cadastro. |
| `enderecos` | Dados de entrega e `cliente_id` numérico. |
| `categorias` | Nome único da categoria. |
| `produtos` | `categoria_id`, nome, descrição, preço, estoque e URL da imagem. |
| `usuarios_admin` | Credenciais administrativas, com e-mail único e hash da senha. |
| `pedidos` | `cliente_id`, `endereco_id`, data, status, frete, total e array embutido de itens. |
| `pagamentos` | Tentativas associadas a um pedido por `pedido_id`. |
| `contadores` | Sequências atômicas usadas para emitir os IDs numéricos. |

Cada item embutido no pedido guarda `produto_id`, nome, quantidade e `preco_unitario` praticado na compra. Assim, o histórico continua legível mesmo se o cadastro do produto mudar. A aplicação impede remover produtos que já aparecem em pedidos.

As relações entre coleções usam IDs numéricos, não chaves estrangeiras do banco. A aplicação valida a posse do endereço, a existência da categoria e a existência do produto nos fluxos correspondentes.

## Pedido e estoque

Criar pedido e baixar o estoque acontece dentro de uma transação MongoDB. O estoque é decrementado por atualização condicional (`estoque >= quantidade`); qualquer falha desfaz as alterações. Por esse motivo, a instância MongoDB deve ser um **replica set** (inclusive em desenvolvimento local) ou MongoDB Atlas. Uma instância standalone não suporta esse fluxo transacional.

## Configuração e dados de demonstração

Configure `MONGODB_URI` no `.env`, por exemplo:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/multiverso_colecionaveis?replicaSet=rs0
```

Após configurar uma instância com suporte a transações, carregue os dados de demonstração com:

```bash
npm run seed
```

O seed idempotente cria as três categorias, os produtos de exemplo e uma conta administrativa se ainda não existirem. A conta usa `ADMIN_EMAIL` e `ADMIN_SENHA`; os padrões de demonstração são `admin@multiversocolecionaveis.com.br` e `admin123`. Configure uma senha própria antes de usar em qualquer ambiente compartilhado.

## Migração do banco anterior

Os arquivos `create.sql`, `insert.sql`, `tests/limpar-testes.sql` e `docs/migracoes/*.sql` são scripts MySQL legados e **não** devem ser executados para configurar esta versão. O `npm run seed` carrega apenas os dados de demonstração no MongoDB; não importa automaticamente dados de uma instância MySQL existente. Preserve e migre os dados antigos separadamente antes de desativar o banco anterior.

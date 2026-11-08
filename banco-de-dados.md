# Banco de dados — Multiverso Colecionáveis

O projeto usa MySQL 8+ ou MariaDB, acessado pelo driver `mysql2`. O schema está em `create.sql`; os dados de catálogo de demonstração estão em `insert.sql`. As tabelas usam InnoDB para que a criação do pedido e a baixa de estoque possam ser feitas na mesma transação.

## Tabelas

| Tabela | Conteúdo e relações |
|---|---|
| `cliente` | Dados do cliente, e-mail único, hash da senha e data de cadastro. |
| `endereco` | Endereços de entrega; cada endereço referencia um cliente. |
| `categoria` | Categorias de produtos, com nome único. |
| `produto` | Produtos, categoria, preço `DECIMAL(10,2)`, estoque e caminho da imagem. |
| `usuario_admin` | Conta administrativa e hash da senha. |
| `pedido` | Cliente, endereço, status, frete, total e data do pedido. |
| `item_pedido` | Produtos do pedido, quantidade e preço unitário no momento da compra. |
| `pagamento` | Tentativa de pagamento, método, status e identificador da transação. |

Os IDs são inteiros auto incrementais. Chaves estrangeiras representam as relações entre tabelas. Valores monetários usam `DECIMAL`, não ponto flutuante.

## Pedido e estoque

A API valida os dados do pedido e confere a posse do endereço e o estoque. Em seguida, dentro de uma transação InnoDB, grava o pedido e os itens e decrementa o estoque com uma condição (`estoque >= quantidade`). Se qualquer etapa falhar, a transação é desfeita.

## Configuração local

Configure no `.env` as variáveis de conexão. Para um MySQL/MariaDB local, o exemplo usual é:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=multiverso_colecionaveis
```

No DBeaver, conecte ao servidor e execute `create.sql`; depois execute `insert.sql` para carregar o catálogo de demonstração. Execute também `npm run seed` depois de configurar o `.env`: ele garante as categorias e produtos e cria o administrador configurado por `ADMIN_EMAIL` e `ADMIN_SENHA` quando ainda não existe.

## Publicação

Em produção, o banco deve estar em um serviço acessível pela API hospedada. A API publicada na Vercel não consegue conectar ao banco local do computador do SENAI. Configure as credenciais no ambiente da hospedagem, habilite SSL conforme o provedor (`DB_SSL=true`) e escolha um limite de conexões compatível com o serviço. Não use credenciais locais ou de demonstração em produção.

Esta versão da aplicação não lê nem migra dados do MongoDB usado anteriormente. O banco MongoDB existente não é apagado por esta mudança; pedidos e contas que estejam somente nele precisarão de uma migração de dados separada se forem necessários no MySQL/MariaDB.

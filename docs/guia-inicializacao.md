# Guia de inicialização

Este guia inicia o banco MySQL/MariaDB, a API e o front-end em ambiente local.

## Pré-requisitos

- Node.js 20 ou superior e npm
- MySQL 8+ ou MariaDB em execução, com acesso ao DBeaver ou cliente SQL equivalente
- Git e Postman (opcional)

## 1. Instalar dependências

Na raiz do repositório:

```bash
npm install
```

No front-end, em outro terminal ou depois:

```bash
cd frontend
npm install
cd ..
```

## 2. Criar e popular o banco

No DBeaver, conecte ao servidor MySQL/MariaDB e execute primeiro `create.sql`, depois `insert.sql`. O primeiro script cria o banco e as tabelas; o segundo carrega as categorias e os produtos de demonstração. O projeto usa InnoDB para transações de pedido.

## 3. Configurar o ambiente local

Copie `.env.example` para `.env` e ajuste os valores locais de banco, JWT e Mercado Pago. Exemplo da conexão:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_local
DB_NAME=multiverso_colecionaveis
DB_CONNECTION_LIMIT=3
DB_SSL=false
PORT=3000
JWT_SECRET=gere_uma_chave_aleatoria_longa
MP_ACCESS_TOKEN=credencial_de_teste_do_mercado_pago
ADMIN_EMAIL=admin@multiversocolecionaveis.com.br
ADMIN_SENHA=defina_uma_senha_local
FRONTEND_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
```

Não versione o `.env`. `MP_ACCESS_TOKEN` só é necessário para iniciar um pagamento no Mercado Pago; o restante do site pode ser desenvolvido sem executar esse fluxo.

## 4. Cadastrar dados iniciais

Depois de configurar o `.env`, execute o seed para criar o administrador com as credenciais de ambiente e garantir o catálogo inicial:

```bash
npm run seed
```

O seed é idempotente para categorias, produtos e administrador existentes.

## 5. Iniciar a API e o front-end

Na raiz:

```bash
npm run dev
```

Em outro terminal:

```bash
cd frontend
npm run dev
```

Endereços locais padrão: API `http://localhost:3000` e front-end `http://localhost:5173`.

## 6. Verificar a API e testar

Abra `http://localhost:3000/`; a resposta esperada é `{"status":"API no ar"}`. A documentação dos endpoints e exemplos de payload está em [api.md](../api.md). Com a API em execução e banco de desenvolvimento populado, os testes podem ser executados da raiz:

```bash
npm test
```

Os testes criam registros. Use uma base local de desenvolvimento, nunca uma base de produção.

## Publicar na Vercel

O front-end e a API Express podem ser configurados como projetos separados no mesmo repositório: diretório raiz `frontend/` para o front e raiz do repositório para a API. Configure `VITE_API_URL` no projeto do front e as variáveis `DB_*`, `JWT_SECRET`, `MP_ACCESS_TOKEN`, `FRONTEND_URL` e `CORS_ORIGINS` no projeto da API.

A Vercel precisa alcançar o banco por rede pública/privada suportada pelo provedor. O MySQL/MariaDB local do SENAI não fica acessível para uma API publicada. Para uso real, hospede o banco externamente, habilite SSL conforme as instruções do provedor e configure o limite de conexões. Defina `VITE_API_URL` nas variáveis do projeto front-end na Vercel (localmente o padrão é `http://localhost:3000`). Para apresentação em sala sem acesso ao serviço externo, rode API e front localmente contra o MariaDB do SENAI.

## Problemas comuns

- **`ECONNREFUSED`:** confirme se o serviço MySQL/MariaDB está iniciado, e confira `DB_HOST` e `DB_PORT`.
- **`ER_ACCESS_DENIED_ERROR`:** confira usuário e senha e as permissões desse usuário no banco.
- **`Unknown database`:** execute `create.sql` no DBeaver.
- **Erro de chave estrangeira:** verifique se as categorias foram carregadas antes dos produtos e se o endereço pertence ao cliente autenticado.
- **Erro de CORS:** confirme que a origem do front está em `CORS_ORIGINS` na API.
- **API sem resposta no front:** confirme `VITE_API_URL` e reinicie o servidor Vite após alterar variáveis.

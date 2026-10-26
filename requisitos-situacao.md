# Requisitos — situação na versão 1

Este documento acompanha o [documento de requisitos](documento-de-requisitos.pdf) (planejamento original) e diz o que foi entregue, o que ficou parcial e o que ficou fora da versão 1.

Legenda: **Implementado** · **Parcial** · **Fora da v1** (decisão de escopo, não esquecimento) · **A validar**

## Requisitos funcionais

| Cód. | Requisito | Prioridade | Situação | Onde está |
|---|---|---|---|---|
| RF01 | Cadastro de cliente | Essencial | Implementado | `POST /clientes`, tela Cadastro |
| RF02 | Login com token JWT | Essencial | Implementado | `POST /login`, tela Login |
| RF03 | Recuperação de senha | Importante | **Fora da v1** | Exigiria envio de e-mail |
| RF04 | Listagem de produtos com paginação | Essencial | **Parcial** | A listagem existe; a paginação ficou para a v2 (catálogo de 18 itens) |
| RF05 | Filtro por categoria | Essencial | Implementado | `GET /produtos/categoria/:id`, tela Categoria |
| RF06 | Busca por nome | Essencial | Implementado | `GET /produtos?nome=`, campo no topo e tela Busca |
| RF07 | Detalhe do produto | Essencial | Implementado | `GET /produtos/:id`, tela Detalhe |
| RF08 | Carrinho (adicionar, remover, quantidade) | Essencial | Implementado | Contexto do carrinho, tela Carrinho |
| RF09 | Frete por CEP | Essencial | **Parcial** | O CEP preenche o endereço (ViaCEP); o frete é fixo, R$ 15,00, calculado no servidor. Cálculo por região ficou para a v2 |
| RF10 | Endereço de entrega | Essencial | Implementado | `POST /enderecos`, tela Endereço |
| RF11 | Checkout | Essencial | Implementado | `POST /pedidos` (transação com baixa de estoque) |
| RF12 | Pagamento Mercado Pago (sandbox) | Essencial | Implementado | Checkout Pro via `POST /pagamentos/:pedidoId`; Pix, cartão e boleto escolhidos na página do Mercado Pago. O webhook está implementado, mas ainda não foi exercitado com uma notificação real (ver [api.md](api.md)) |
| RF13 | Histórico de pedidos do cliente | Importante | Implementado | `GET /pedidos`, `GET /pedidos/:id`, tela Meus Pedidos |
| RF14 | Admin: CRUD de produtos | Essencial | Implementado | `POST/PUT/DELETE /produtos`, telas de admin |
| RF15 | Admin: CRUD de categorias | Importante | **Fora da v1** | As 3 categorias são fixas e criadas pelo `insert.sql` |
| RF16 | Admin: gestão de pedidos | Essencial | Implementado | `GET /admin/pedidos`, tela Pedidos |
| RF17 | Admin: atualizar status do pedido | Importante | Implementado | `PUT /admin/pedidos/:id/status` |
| RF18 | Avaliação de produto | Desejável | **Fora da v1** | |

Resumo: 13 implementados, 2 parciais e 3 fora da v1.

## Requisitos não funcionais

| Cód. | Requisito | Situação | Evidência |
|---|---|---|---|
| RNF01 | Senha com hash bcrypt | Implementado | `senha_hash` em `cliente` e `usuario_admin`; a API nunca devolve o hash |
| RNF02 | Resposta da API abaixo de 2 s | **A validar** | Não medido formalmente; as rotas respondem de forma imediata no ambiente local |
| RNF03 | Layout responsivo, a partir de 360 px | **A validar** | Telas montadas com classes responsivas do Tailwind; falta o teste a 360 px |
| RNF04 | Navegadores modernos | Implementado | Testado no Chrome |
| RNF05 | Rotina de backup do banco | **Fora da v1** | Hoje o banco é recriável a partir de `create.sql` e `insert.sql`; backup periódico não foi automatizado |
| RNF06 | Segredos fora do repositório | Implementado | `.env` no `.gitignore` e fora do controle de versão; `.env.example` como modelo |
| RNF07 | Contraste mínimo AA | **Parcial** | Ver a medição abaixo |

## Medição de contraste (RNF07)

O critério AA da WCAG pede 4,5:1 para texto normal e 3:1 para texto grande. Razões calculadas com as cores reais da marca:

| Combinação (texto sobre fundo) | Razão | Uso | Resultado |
|---|---|---|---|
| Branco sobre roxo `#2D1B4E` | 15,2:1 | Header, textos sobre roxo | Passa |
| Amarelo `#F5B700` sobre roxo | 8,5:1 | Logo, destaques | Passa |
| Roxo sobre amarelo | 8,5:1 | Botões de ação | Passa |
| Chumbo `#22223B` sobre claro `#F7F7F7` | 14,4:1 | Texto principal | Passa |
| Roxo sobre branco | 15,2:1 | Títulos | Passa |
| Amarelo sobre branco | 1,8:1 | Não usado como texto | Evitar |
| **Vermelho `#E63946` sobre branco** | **4,2:1** | Mensagens de erro em texto pequeno | **Não passa (abaixo de 4,5:1)** |
| **Vermelho sobre claro `#F7F7F7`** | **3,9:1** | Idem | **Não passa** |
| Branco sobre vermelho | 4,2:1 | Selos e etiquetas | Só passa em texto grande |

**Ajuste adotado:** para texto de erro sobre fundo claro, usar uma variante mais escura do vermelho, `#C42B38` (5,6:1 sobre branco e 5,2:1 sobre o claro). O vermelho original continua valendo para fundos, bordas e selos.

A frase do manual de marca que dizia que a combinação estava "testada" refere-se ao par roxo e amarelo, que de fato passa com folga. O vermelho em texto pequeno é a exceção acima.

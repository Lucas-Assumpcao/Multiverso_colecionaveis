# Requisitos — situação na versão 1

Este documento acompanha o [documento de requisitos](../documento-requisitos-multiverso-colecionaveis.pdf) (planejamento original) e diz o que foi entregue, o que ficou parcial e o que ficou fora da versão 1.

Legenda: **Implementado** · **Parcial** · **Fora da v1** (decisão de escopo, não esquecimento) · **A validar**

## Requisitos funcionais

| Cód. | Requisito | Prioridade | Situação | Onde está |
|---|---|---|---|---|
| RF01 | Cadastro de cliente | Essencial | Implementado | `POST /clientes`, tela Cadastro |
| RF02 | Login com token JWT | Essencial | Implementado | `POST /login`, tela Login |
| RF03 | Recuperação de senha | Importante | **Fora da v1** | Exigiria envio de e-mail |
| RF04 | Listagem de produtos com paginação | Essencial | **Parcial** | Paginação no cliente (12 por página) implementada; paginação no servidor fica para a v2 |
| RF05 | Filtro por categoria | Essencial | Implementado | `GET /produtos/categoria/:id`, tela Categoria |
| RF06 | Busca por nome | Essencial | Implementado | Busca local por nome e descrição, campo no topo com sugestões de produtos e tela Busca |
| RF07 | Detalhe do produto | Essencial | Implementado | `GET /produtos/:id`, tela Detalhe |
| RF08 | Carrinho (adicionar, remover, quantidade) | Essencial | Implementado | Contexto do carrinho, tela Carrinho |
| RF09 | Frete por CEP | Essencial | **Parcial** | O CEP preenche o endereço (ViaCEP); o frete é fixo, R$ 15,00, calculado no servidor. Cálculo por região ficou para a v2 |
| RF10 | Endereço de entrega | Essencial | Implementado | `POST /enderecos`, tela Endereço |
| RF11 | Checkout | Essencial | Implementado | `POST /pedidos` (transação com baixa de estoque) |
| RF12 | Pagamento Mercado Pago (sandbox) | Essencial | Implementado | Checkout Pro via `POST /pagamentos/:pedidoId`; Pix, cartão e boleto escolhidos na página do Mercado Pago. O webhook está implementado, mas ainda não foi exercitado com uma notificação real (ver [api.md](../api.md)) |
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
| RNF03 | Layout responsivo, a partir de 360 px | **Parcial** | 16 rotas verificadas a 360 px sem overflow horizontal e sem alvos visíveis menores que 44×44 px nos estados renderizados. Checkout e admin não foram validados com dados reais porque a API estava indisponível; `/pagamento` foi exercitada pelo redirecionamento de proteção. |
| RNF04 | Navegadores modernos | Implementado | Testado no Chrome |
| RNF05 | Rotina de backup do banco | **Fora da v1** | Hoje o banco é recriável a partir de `create.sql` e `insert.sql`; backup periódico não foi automatizado |
| RNF06 | Segredos fora do repositório | Implementado | `.env` no `.gitignore` e fora do controle de versão; `.env.example` como modelo |
| RNF07 | Contraste mínimo AA | **Parcial** | Tokens principais medidos; foco visível e textos secundários/erros auditados. A medição cobre as combinações abaixo, não uma verificação automatizada de todas as telas. |

## Medição de contraste (RNF07)

O critério AA da WCAG pede 4,5:1 para texto normal e 3:1 para texto grande. Razões calculadas com as cores reais da marca:

| Combinação (texto sobre fundo) | Razão | Uso | Resultado |
|---|---|---|---|
| Branco sobre roxo `#2D1B4E` | 15,2:1 | Header, textos sobre roxo | Passa |
| Amarelo `#F5B700` sobre roxo | 8,5:1 | Logo, destaques | Passa |
| Roxo sobre amarelo | 8,5:1 | Botões de ação | Passa |
| Chumbo `#22223B` sobre claro `#F7F7F7` | 14,4:1 | Texto principal | Passa |
| Roxo sobre branco | 15,2:1 | Títulos | Passa |
| Suave `#666680` sobre branco | 5,56:1 | Texto secundário | Passa |
| Vermelho-escuro `#C42B38` sobre branco | 5,60:1 | Texto de erro e selos com texto branco | Passa |
| Amarelo sobre branco | 1,8:1 | Não usado como texto | Evitar |
| **Vermelho `#E63946` sobre branco** | **4,2:1** | Mensagens de erro em texto pequeno | **Não passa (abaixo de 4,5:1)** |
| **Vermelho sobre claro `#F7F7F7`** | **3,9:1** | Idem | **Não passa** |
| Branco sobre vermelho | 4,2:1 | Selos e etiquetas | Só passa em texto grande |

**Ajuste adotado:** texto de erro e selos danger sobre fundo claro usam a variante mais escura `#C42B38`, com texto branco nos selos. A medição confirma 5,60:1 sobre branco; o vermelho original `#E63946` não deve ser usado em texto pequeno sobre fundo claro.

A verificação responsiva mediu as 16 rotas em viewport de 360 px e não encontrou overflow horizontal nem alvos interativos visíveis abaixo de 44×44 px nos estados percorridos. Como a API local não estava ativa, dados reais de conta, checkout e admin não foram testados. A auditoria de contraste mediu as combinações listadas, sem executar uma varredura automatizada completa de todas as telas.

# Briefing — Multiverso Colecionáveis

> "Todo fandom, um só lugar."

## 1. O negócio

**Multiverso Colecionáveis** é uma loja virtual de colecionáveis e action figures licenciados, com mangás, camisetas, pôsteres e itens retrô. A ideia do nome é a de um multiverso: vários universos de ficção reunidos num só catálogo.

| | |
|---|---|
| Segmento sorteado | Colecionáveis e action figures |
| Nome fantasia | Multiverso Colecionáveis |
| Frase de marca | Todo fandom, um só lugar. |
| Modelo | Loja virtual (e-commerce), compra com cadastro e pagamento on-line |

## 2. Público-alvo

| Perfil | Faixa etária | O que valoriza | Como compra |
|---|---|---|---|
| Jovem fã | 12 a 17 anos | Personagens e franquias do momento, preço acessível, lançamentos | Compra por impulso ou como presente |
| Colecionador adulto | 25 a 45+ anos | Autenticidade, edições limitadas, estado do item, nostalgia | Pesquisa o item específico antes de comprar |

## 3. Catálogo inicial (3 categorias, 18 produtos)

### Animes/Mangás

| Produto | Preço | Descrição |
|---|---|---|
| Action Figure Luffy Gear 5 | R$ 249,90 | One Piece — edição articulada |
| Action Figure Goku Ultra Instinct | R$ 229,90 | Dragon Ball Super — coleção premium |
| Mangá One Piece Vol. 105 - Colecionador | R$ 49,90 | Edição de colecionador com capa dura |
| Action Figure Naruto Modo Sábio | R$ 199,90 | Naruto Shippuden — 17cm |
| Camiseta Attack on Titan | R$ 89,90 | Edição limitada, estampa exclusiva |
| Estatueta Sailor Moon Crystal | R$ 179,90 | Compact Edition — S.H.Figuarts |

### Super-heróis (Marvel/DC)

| Produto | Preço | Descrição |
|---|---|---|
| Action Figure Homem-Aranha | R$ 299,90 | S.H.Figuarts — No Way Home |
| Action Figure Batman Hush | R$ 259,90 | Edição especial, base inclusa |
| Réplica Escudo Capitão América | R$ 349,90 | Escala 1:1, acabamento metálico |
| Boneco Coringa Arkham | R$ 219,90 | Série Arkham Origins |
| Camiseta Liga da Justiça | R$ 79,90 | Estampa clássica retrô |
| Estatueta Mulher-Maravilha | R$ 289,90 | Edição de colecionador, resina |

### Cultura Pop / Nostalgia / Videogames

| Produto | Preço | Descrição |
|---|---|---|
| Action Figure Baby Yoda | R$ 189,90 | Star Wars — The Mandalorian |
| Boneco Chewbacca Retrô | R$ 169,90 | Linha vintage, embalagem retrô |
| Estatueta Master Chief | R$ 259,90 | Halo — edição de colecionador |
| Action Figure Link | R$ 209,90 | The Legend of Zelda — Breath of the Wild |
| Pôster Retrô De Volta para o Futuro | R$ 59,90 | Impressão em alta qualidade |
| Miniatura DeLorean | R$ 149,90 | Réplica em escala, edição retrô |

Os dados de teste estão em [`insert.sql`](../insert.sql). Os preços são ilustrativos.

## 4. Regras de negócio desta versão

| Tema | Regra | Situação |
|---|---|---|
| Frete | Valor fixo de R$ 15,00, calculado no servidor (o front não define o valor) | Implementado |
| Pagamento | Pix, cartão ou boleto, escolhidos na página do Mercado Pago (Checkout Pro), em ambiente de testes — nenhum pagamento real | Implementado |
| Estoque | Baixa automática ao criar o pedido; pedido com quantidade acima do estoque é recusado | Implementado |
| Status do pedido | Nasce como "aguardando pagamento" e segue por pago, enviado, entregue ou cancelado | Implementado |
| Troca e devolução | 7 dias corridos para desistência de compra on-line (art. 49 do Código de Defesa do Consumidor) | Política da loja, fora do sistema |
| Prazo de entrega | Previsto de 3 a 10 dias úteis | Informativo, não calculado pelo sistema |

## 5. Referências e concorrentes

| Loja | O que copiar | O que evitar |
|---|---|---|
| **Fantoy** (referência indicada) | Menu por tipo de vitrine (Novidades, Em breve, Promoção, Combos), parcelamento visível no card, botão de compra bem destacado | Visual muito próximo (roxo escuro com dourado): a Multiverso se diferencia pelo logo de portal com estrela, pela tipografia e pelo tom de voz |
| **ToyShow** | Curadoria por franquia e senso de comunidade em torno dos fãs | Depender só de itens de ticket alto, sem opções de entrada |
| **Sempre Geek** | Catálogo amplo e bem categorizado | Visual genérico de marketplace, sem identidade própria |

## 6. Identidade e tom de voz

Resumo do [manual de marca](manual-de-marca.pdf):

- **Cores:** roxo `#2D1B4E`, amarelo `#F5B700`, vermelho `#E63946`, claro `#F7F7F7`, chumbo `#22223B`
- **Tipografia:** Poppins nos títulos e botões, Inter no texto corrido
- **Tom de voz:** direto, empolgado, com leve gíria geek; fala com quem já entende do assunto, sem ser infantil
  - Botão de compra: "Adicionar à coleção"
  - Confirmação: "Seu pedido tá a caminho — prepara a estante!"

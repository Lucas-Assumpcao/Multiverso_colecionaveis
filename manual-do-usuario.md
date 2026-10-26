# Manual do usuário — Multiverso Colecionáveis

Este manual tem duas partes: **como comprar** (para clientes) e **como administrar a loja** (para o administrador).

> **Aviso:** esta versão usa o ambiente de testes do Mercado Pago. Nenhuma cobrança é real e nenhum produto é enviado.

---

## Parte 1 — Como comprar

### 1. Conhecer o catálogo

Na **página inicial** aparecem as três categorias da loja: Animes/Mangás, Super-heróis (Marvel/DC) e Cultura Pop/Nostalgia/Videogames. Clique em uma delas para ver os produtos, com foto, nome, descrição e preço.

Para procurar um item específico, use o **campo de busca** no topo do site e digite parte do nome (por exemplo, "goku"). Se não houver resultado, a página avisa.

Clique num produto para ver a **página de detalhe**, com a descrição completa e o estoque disponível. Produtos sem estoque têm o botão de compra desabilitado.

### 2. Criar sua conta

1. Clique em **Cadastre-se** no topo.
2. Preencha nome, e-mail e senha e clique em **Cadastrar**.
3. Você será levado à tela de login. Entre com o e-mail e a senha que acabou de criar.

Se o e-mail já tiver cadastro, o site avisa. Nesse caso, use **Login**.

### 3. Montar o carrinho

1. Na página do produto, clique em **Adicionar à coleção**. O botão confirma por um instante.
2. O número ao lado de **Carrinho**, no topo, mostra quantos itens você já separou.
3. Abra o **Carrinho** para alterar quantidades, remover itens e ver o total.

O carrinho fica salvo no seu navegador: se você fechar a página e voltar, os itens continuam lá.

### 4. Informar o endereço

1. No carrinho, clique em **Fechar pedido**. É preciso estar logado.
2. Digite o **CEP**. Ao sair do campo, rua, bairro, cidade e UF são preenchidos sozinhos.
3. Complete o **número** (e o complemento, se houver) e clique em **Continuar para pagamento**.

Se o CEP não for encontrado, aparece um aviso. Confira o número e tente de novo.

### 5. Pagar

1. A tela de **Pagamento** mostra o resumo: itens, frete (R$ 15,00) e total.
2. Clique em **Ir para o pagamento**. Você é levado ao Mercado Pago.
3. Lá, escolha **Pix, cartão ou boleto** e conclua o pagamento. Em ambiente de testes, use os usuários e cartões de teste fornecidos pelo Mercado Pago.
4. Ao terminar, use o botão de voltar ao site. A página de **confirmação** mostra o número do pedido e a situação do pagamento.

Se a quantidade pedida for maior que o estoque, o pedido não é criado e o site mostra a mensagem. Reduza a quantidade no carrinho e tente de novo.

### 6. Acompanhar seus pedidos

Clique em **Meus Pedidos** no topo. A lista mostra, do mais recente ao mais antigo, o número, a data, o valor e a situação de cada pedido:

| Situação | Significa |
|---|---|
| Aguardando pagamento | O pedido foi criado e o pagamento ainda não foi confirmado |
| Pago | Pagamento aprovado |
| Enviado | O pedido saiu da loja |
| Entregue | O pedido chegou |
| Cancelado | O pagamento foi recusado ou o pedido foi cancelado |

### 7. Sair

Clique em **Sair** no topo. Para entrar de novo, use **Login**.

### Problemas comuns

| O que aconteceu | O que fazer |
|---|---|
| "Credenciais inválidas" no login | Confira e-mail e senha. O site não diz qual dos dois está errado, por segurança |
| O botão **Adicionar à coleção** está apagado | O produto está sem estoque |
| "Estoque insuficiente" ao pagar | Reduza a quantidade no carrinho |
| Voltei do Mercado Pago e não vejo o pedido | Abra **Meus Pedidos**; o pedido aparece lá |
| Página "404" | O endereço digitado não existe; volte à página inicial |

---

## Parte 2 — Como administrar a loja

O painel não aparece no menu do site. Ele é acessado direto pelo endereço `/admin`.

### 1. Entrar

1. Acesse `http://localhost:5173/admin`.
2. Entre com o e-mail e a senha de administrador. Na demonstração: `admin@multiversocolecionaveis.com.br` e `admin123`.
3. O painel mostra dois atalhos: **Gerenciar Produtos** e **Gerenciar Pedidos**. Use **Sair** ao terminar.

### 2. Gerenciar produtos

- **Ver a lista:** nome, preço e estoque de cada produto.
- **Cadastrar:** clique em **+ Novo produto**, escolha a categoria, preencha nome, preço e estoque (descrição e imagem são opcionais) e clique em **Salvar**.
- **Editar:** clique em **Editar** ao lado do produto, altere os campos e salve. Use isso também para repor estoque.
- **Remover:** clique em **Remover** e confirme. Um produto que já aparece em algum pedido não pode ser removido; neste caso, zere o estoque.

Para a imagem, informe o caminho de um arquivo que esteja em `frontend/public/produtos/`, por exemplo `/produtos/goku.jpg`.

### 3. Gerenciar pedidos

A lista mostra todos os pedidos, com o número, o nome do cliente, o valor e a data. Para atualizar a situação, escolha o novo status na caixa ao lado do pedido: a alteração é salva na hora.

Fluxo normal: aguardando pagamento → pago → enviado → entregue. Use **cancelado** para pedidos que não vão seguir.

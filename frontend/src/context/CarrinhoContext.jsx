import { createContext, useContext, useState, useEffect } from 'react';

export const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(() => {
    const salvo = localStorage.getItem('carrinho');
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(itens));
  }, [itens]);

  function adicionar(produto) {
    setItens((atual) => {
      const existente = atual.find((i) => i.produto_id === produto.id);
      if (existente) {
        return atual.map((i) =>
          i.produto_id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...atual, {
        produto_id: produto.id,
        nome: produto.nome,
        preco: Number(produto.preco),
        quantidade: 1,
      }];
    });
  }

  function remover(produtoId) {
    setItens((atual) => atual.filter((i) => i.produto_id !== produtoId));
  }

  function atualizarQuantidade(produtoId, quantidade) {
    if (quantidade < 1) return;
    setItens((atual) =>
      atual.map((i) => (i.produto_id === produtoId ? { ...i, quantidade } : i))
    );
  }

  function limpar() {
    setItens([]);
  }

  const total = itens.reduce((soma, i) => soma + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, atualizarQuantidade, limpar, total }}>
      {children}
    </CarrinhoContext.Provider>
  );
}
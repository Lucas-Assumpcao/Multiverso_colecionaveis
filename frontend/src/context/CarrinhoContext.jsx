import { useEffect, useRef, useState } from 'react';
import { CarrinhoContext } from './carrinhoCtx';

const CHAVE_CARRINHO = 'carrinho:v2';
const CHAVE_CARRINHO_ANTIGA = 'carrinho';

function lerItens(raw, chave) {
  const itens = JSON.parse(raw);
  if (!Array.isArray(itens)) {
    throw new Error(`O conteúdo salvo em ${chave} não é uma lista válida.`);
  }
  return itens;
}

function carregarCarrinho() {
  const salvoV2 = localStorage.getItem(CHAVE_CARRINHO);
  if (salvoV2 !== null) {
    const itens = lerItens(salvoV2, CHAVE_CARRINHO);
    localStorage.removeItem(CHAVE_CARRINHO_ANTIGA);
    return itens;
  }

  const salvoAntigo = localStorage.getItem(CHAVE_CARRINHO_ANTIGA);
  if (salvoAntigo === null) return [];

  const itensMigrados = lerItens(salvoAntigo, CHAVE_CARRINHO_ANTIGA).map((item) => ({
    ...item,
    imagem_url: null,
    estoque: null,
  }));
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itensMigrados));
  localStorage.removeItem(CHAVE_CARRINHO_ANTIGA);
  return itensMigrados;
}

function estoqueConhecido(estoque) {
  return estoque !== null && estoque !== undefined && estoque !== ''
    && Number.isFinite(Number(estoque));
}

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState(carregarCarrinho);
  const itensRef = useRef(itens);

  useEffect(() => {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  }, [itens]);

  function salvarItens(novosItens) {
    itensRef.current = novosItens;
    setItens(novosItens);
  }

  function adicionar(produto) {
    const atual = itensRef.current;
    const existente = atual.find((item) => item.produto_id === produto.id);
    const estoqueProduto = estoqueConhecido(produto.estoque)
      ? Number(produto.estoque)
      : null;
    const limite = estoqueProduto ?? existente?.estoque ?? null;
    const imagemUrl = produto.imagem_url ?? existente?.imagem_url ?? null;
    const estoque = estoqueProduto ?? existente?.estoque ?? null;

    if (existente && limite !== null && existente.quantidade >= limite) {
      if (existente.imagem_url !== imagemUrl || existente.estoque !== estoque) {
        salvarItens(atual.map((item) => (
          item.produto_id === produto.id ? { ...item, imagem_url: imagemUrl, estoque } : item
        )));
      }
      return { ok: false, limite };
    }

    if (!existente && limite !== null && limite <= 0) {
      return { ok: false, limite };
    }

    const novosItens = existente
      ? atual.map((item) => (
        item.produto_id === produto.id
          ? {
            ...item,
            imagem_url: imagemUrl,
            estoque,
            quantidade: item.quantidade + 1,
          }
          : item
      ))
      : [
        ...atual,
        {
          produto_id: produto.id,
          nome: produto.nome,
          preco: Number(produto.preco),
          quantidade: 1,
          imagem_url: imagemUrl,
          estoque,
        },
      ];

    salvarItens(novosItens);
    return { ok: true, limite };
  }

  function remover(produtoId) {
    salvarItens(itensRef.current.filter((item) => item.produto_id !== produtoId));
  }

  function atualizarQuantidade(produtoId, quantidade) {
    const item = itensRef.current.find((entry) => entry.produto_id === produtoId);
    const limite = item?.estoque ?? null;
    if (!item || quantidade < 1 || !Number.isInteger(quantidade)) {
      return { ok: false, limite };
    }
    if (limite !== null && quantidade > limite) {
      return { ok: false, limite };
    }

    salvarItens(itensRef.current.map((entry) => (
      entry.produto_id === produtoId ? { ...entry, quantidade } : entry
    )));
    return { ok: true, limite };
  }

  function limpar() {
    salvarItens([]);
  }

  const total = itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{
      itens,
      adicionar,
      remover,
      atualizarQuantidade,
      limpar,
      total,
    }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

import { useEffect, useState } from 'react';
import { listarTodos } from '../services/produtoService';

let produtosCache = null;
let produtosPromise = null;
let versaoProdutos = 0;
const ouvintes = new Set();

function carregarProdutos() {
  if (produtosCache !== null) return Promise.resolve(produtosCache);
  if (produtosPromise) return produtosPromise;

  const versaoDaRequisicao = versaoProdutos;
  const requisicao = listarTodos()
    .then((produtos) => {
      if (versaoDaRequisicao === versaoProdutos) produtosCache = produtos;
      return produtos;
    })
    .finally(() => {
      if (versaoDaRequisicao === versaoProdutos) produtosPromise = null;
    });

  produtosPromise = requisicao;
  return requisicao;
}

export function invalidarProdutos() {
  versaoProdutos += 1;
  produtosCache = null;
  produtosPromise = null;
  ouvintes.forEach((notificar) => notificar());
}

export function useProdutos() {
  const [versao, setVersao] = useState(versaoProdutos);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const notificar = () => {
      setVersao(versaoProdutos);
      setCarregando(true);
      setErro(null);
    };
    ouvintes.add(notificar);
    return () => ouvintes.delete(notificar);
  }, []);

  useEffect(() => {
    let ativo = true;
    const versaoDaLeitura = versaoProdutos;

    carregarProdutos()
      .then((resultado) => {
        if (ativo && versaoDaLeitura === versaoProdutos) setProdutos(resultado);
      })
      .catch((erroCarregamento) => {
        if (ativo && versaoDaLeitura === versaoProdutos) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo && versaoDaLeitura === versaoProdutos) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [versao]);

  return { produtos, carregando, erro };
}

import { useEffect, useState } from 'react';
import { listarCategorias } from '../services/categoriaService';

let categoriasPromise;
let versaoCategorias = 0;
const ouvintes = new Set();

function carregarCategorias() {
  if (!categoriasPromise) {
    categoriasPromise = listarCategorias();
  }
  return categoriasPromise;
}

export function invalidarCategorias() {
  categoriasPromise = null;
  versaoCategorias += 1;
  ouvintes.forEach((notificar) => notificar());
}

export function rotuloCurto(nome) {
  return nome.split(/[/(]/)[0].trim();
}

export function useCategorias() {
  const [versao, setVersao] = useState(versaoCategorias);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const notificar = () => {
      setVersao(versaoCategorias);
      setCarregando(true);
      setErro(null);
    };
    ouvintes.add(notificar);
    return () => ouvintes.delete(notificar);
  }, []);

  useEffect(() => {
    let ativo = true;
    const versaoDaLeitura = versaoCategorias;

    carregarCategorias()
      .then((resultado) => {
        if (ativo && versaoDaLeitura === versaoCategorias) setCategorias(resultado);
      })
      .catch((erroCarregamento) => {
        if (ativo && versaoDaLeitura === versaoCategorias) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo && versaoDaLeitura === versaoCategorias) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [versao]);

  return { categorias, carregando, erro };
}

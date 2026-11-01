import { useEffect, useState } from 'react';
import { listarCategorias } from '../services/categoriaService';

let categoriasPromise;

function carregarCategorias() {
  if (!categoriasPromise) {
    categoriasPromise = listarCategorias();
  }
  return categoriasPromise;
}

export function rotuloCurto(nome) {
  return nome.split(/[/(]/)[0].trim();
}

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    carregarCategorias()
      .then((resultado) => {
        if (ativo) setCategorias(resultado);
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return { categorias, carregando, erro };
}

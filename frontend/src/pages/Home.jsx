import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarCategorias } from '../services/categoriaService';

function Home() {
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    const carregarCategorias = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const dados = await listarCategorias();
        if (ativo) {
          setCategorias(dados);
        }
      } catch (erroCarregamento) {
        if (ativo) {
          setErro(erroCarregamento);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregarCategorias();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-roxo text-3xl font-bold mb-6">Multiverso Colecionáveis</h1>

      {carregando ? (
        <p>Carregando categorias...</p>
      ) : erro ? (
        <p>Erro ao carregar categorias: {erro.message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/categoria/${categoria.id}`}
              className="bg-roxo text-amarelo font-bold text-lg rounded-lg p-6 text-center hover:opacity-90"
            >
              {categoria.nome}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { listarPorCategoria } from '../services/produtoService';

function Categoria() {
  const { categoriaId } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    const carregarProdutos = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const produtosCategoria = await listarPorCategoria(categoriaId);

        if (ativo) {
          setProdutos(produtosCategoria);
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

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, [categoriaId]);

  return (
    <div className="p-8">
      <h1 className="text-roxo text-3xl font-bold mb-4">Categoria {categoriaId}</h1>
      {carregando ? (
        <p>Carregando produtos...</p>
      ) : erro ? (
        <p>Erro ao carregar produtos: {erro.message}</p>
      ) : produtos.length === 0 ? (
        <p>Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="border border-gray-300 rounded-lg p-4">
              <h2 className="text-lg font-bold">{produto.nome}</h2>
              <p className="text-gray-600">{produto.descricao}</p>
             <p className="text-xl font-bold">R$ {Number(produto.preco).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categoria;

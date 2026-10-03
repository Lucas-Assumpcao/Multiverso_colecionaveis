import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarPorId } from '../services/produtoService';
import { useCarrinho } from '../context/useCarrinho';

function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [adicionado, setAdicionado] = useState(false);
  const { adicionar } = useCarrinho();

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      setCarregando(true);
      setErro(null);
      try {
        const dados = await buscarPorId(id);
        if (ativo) setProduto(dados);
      } catch (e) {
        if (ativo) setErro(e);
      } finally {
        if (ativo) setCarregando(false);
      }
    };
    carregar();
    return () => { ativo = false; };
  }, [id]);

  function handleAdicionar() {
    adicionar(produto);
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1500);
  }

  if (carregando) return <p className="p-8">Carregando produto...</p>;
  if (erro) return <p className="p-8">Erro: {erro.message}</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to={`/categoria/${produto.categoria_id}`} className="text-roxo underline">
        &larr; Voltar
      </Link>
      <h1 className="text-3xl font-bold mt-4">{produto.nome}</h1>
      <p className="text-gray-600 mt-2">{produto.descricao}</p>
      <p className="text-2xl font-bold text-roxo mt-4">
        R$ {Number(produto.preco).toFixed(2)}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}
      </p>
      <button
        disabled={produto.estoque === 0}
        onClick={handleAdicionar}
        className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg mt-6 disabled:opacity-40"
      >
        {adicionado ? 'Adicionado! ✓' : 'Adicionar à coleção'}
      </button>
    </div>
  );
}

export default ProdutoDetalhe;
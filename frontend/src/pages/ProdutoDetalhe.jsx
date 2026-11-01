import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarPorId } from '../services/produtoService';
import { useCarrinho } from '../context/useCarrinho';
import Container from '../components/ui/Container';
import { useToast } from '../hooks/useToast';
import { useCarrinhoDrawer } from '../hooks/useCarrinhoDrawer';

function ProdutoDetalhe() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [adicionado, setAdicionado] = useState(false);
  const { adicionar } = useCarrinho();
  const toast = useToast();
  const { abrir: abrirCarrinho } = useCarrinhoDrawer();

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

  function handleAdicionar(event) {
    const resultado = adicionar(produto);
    if (!resultado.ok) {
      toast.info('Você já separou todo o estoque disponível desse item.');
      return;
    }
    setAdicionado(true);
    abrirCarrinho(event.currentTarget);
    setTimeout(() => setAdicionado(false), 1500);
  }

  if (carregando) return <Container className="py-6 sm:py-10">Carregando produto...</Container>;
  if (erro) return <Container className="py-6 sm:py-10">Erro: {erro.message}</Container>;

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
      <Link to={`/categoria/${produto.categoria_id}`} className="text-roxo underline">
        &larr; Voltar
      </Link>
      {produto.imagem_url && (
        <img
          src={produto.imagem_url}
          alt={produto.nome}
          loading="lazy"
          className="w-full h-80 object-contain mt-4"
          onError={(event) => { event.currentTarget.style.display = 'none'; }}
        />
      )}
      <h1 className="text-3xl font-bold mt-4">{produto.nome}</h1>
      <p className="text-gray-600 mt-2">{produto.descricao}</p>
      <p className="text-2xl font-bold text-roxo mt-4">
        R$ {Number(produto.preco).toFixed(2)}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}
      </p>
      <button
        type="button"
        disabled={produto.estoque === 0}
        onClick={handleAdicionar}
        className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg mt-6 disabled:opacity-40"
      >
        {adicionado ? 'Adicionado! ✓' : 'Adicionar à coleção'}
      </button>
      </div>
    </Container>
  );
}

export default ProdutoDetalhe;

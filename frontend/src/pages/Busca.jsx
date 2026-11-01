import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buscarPorNome } from '../services/produtoService';
import ProdutoCard from '../components/ProdutoCard';
import Container from '../components/ui/Container';

function Busca() {
  const [searchParams] = useSearchParams();
  const nome = (searchParams.get('nome') || '').trim();
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    let ativo = true;

    const carregarProdutos = async () => {
      setCarregando(true);
      setErro(null);

      if (!nome) {
        setProdutos([]);
        setCarregando(false);
        return;
      }

      try {
        const encontrados = await buscarPorNome(nome);
        if (ativo) setProdutos(encontrados);
      } catch (erroCarregamento) {
        if (ativo) setErro(erroCarregamento);
      } finally {
        if (ativo) setCarregando(false);
      }
    };

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, [nome]);

  return (
    <Container className="py-6 sm:py-10">
      <h1 className="text-roxo text-3xl font-bold mb-4">Resultados para "{nome}"</h1>
      {carregando ? (
        <p>Buscando produtos...</p>
      ) : erro ? (
        <p>Erro ao buscar produtos: {erro.message}</p>
      ) : produtos.length === 0 ? (
        <p>Nenhum produto encontrado para '{nome}'</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtos.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>
      )}
    </Container>
  );
}

export default Busca;

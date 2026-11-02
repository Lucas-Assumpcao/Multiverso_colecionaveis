import { useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ListaProdutos from '../components/ListaProdutos';
import Container from '../components/ui/Container';
import { invalidarCategorias, rotuloCurto, useCategorias } from '../hooks/useCategorias';
import { invalidarProdutos, useProdutos } from '../hooks/useProdutos';
import usePageTitle from '../hooks/usePageTitle';

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function Busca() {
  const [searchParams] = useSearchParams();
  const tituloRef = useRef(null);
  const termo = (searchParams.get('nome') || '').trim();
  const {
    produtos,
    carregando: carregandoProdutos,
    erro: erroProdutos,
  } = useProdutos();
  const {
    categorias,
    carregando: carregandoCategorias,
    erro: erroCategorias,
  } = useCategorias();
  const termoNormalizado = normalizar(termo);
  const encontrados = termoNormalizado
    ? produtos.filter((produto) => (
      normalizar(`${produto.nome} ${produto.descricao || ''}`).includes(termoNormalizado)
    ))
    : produtos;
  const categoriasVisiveis = categorias.slice(0, 3);
  usePageTitle(termo ? `Resultados para "${termo}"` : 'Todos os produtos');

  function tentarNovamente() {
    if (erroProdutos) invalidarProdutos();
    if (erroCategorias) invalidarCategorias();
  }

  const acaoVazia = categoriasVisiveis.length > 0 ? (
    <nav aria-label="Explorar categorias" className="flex flex-wrap justify-center gap-3">
      {categoriasVisiveis.map((categoria) => (
        <Link
          key={categoria.id}
          to={`/categoria/${categoria.id}`}
          className="rounded-lg border border-roxo px-4 py-2 font-semibold text-roxo transition-colors hover:bg-lilas/30"
        >
          {rotuloCurto(categoria.nome)}
        </Link>
      ))}
    </nav>
  ) : null;

  return (
    <Container className="py-6 sm:py-10">
      <h1 ref={tituloRef} tabIndex="-1" className="mb-6 text-3xl font-bold text-roxo">
        {termo ? `Resultados para "${termo}"` : 'Todos os produtos'}
      </h1>
      <ListaProdutos
        produtos={encontrados}
        carregando={carregandoProdutos || carregandoCategorias}
        erro={erroProdutos || erroCategorias}
        onTentarNovamente={tentarNovamente}
        tituloRef={tituloRef}
        vazioTitulo={termo
          ? `Nenhum produto encontrado para '${termo}'`
          : 'Nossa coleção está chegando'}
        vazioTexto={termo
          ? 'Explore outras categorias enquanto procura sua próxima peça.'
          : 'Em breve, novos produtos para você descobrir.'}
        vazioAcao={acaoVazia}
      />
    </Container>
  );
}

export default Busca;

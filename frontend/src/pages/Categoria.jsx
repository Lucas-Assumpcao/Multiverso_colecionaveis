import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import ListaProdutos from '../components/ListaProdutos';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import { invalidarCategorias, rotuloCurto, useCategorias } from '../hooks/useCategorias';
import { invalidarProdutos, useProdutos } from '../hooks/useProdutos';
import usePageTitle from '../hooks/usePageTitle';

const coresCategoria = [
  'bg-roxo-claro text-white',
  'bg-amarelo text-roxo',
  'bg-chumbo text-white',
];

function Categoria() {
  const { categoriaId } = useParams();
  const tituloRef = useRef(null);
  const {
    categorias,
    carregando: carregandoCategorias,
    erro: erroCategorias,
  } = useCategorias();
  const {
    produtos,
    carregando: carregandoProdutos,
    erro: erroProdutos,
  } = useProdutos();
  const categoria = categorias.find((item) => String(item.id) === categoriaId);
  const produtosCategoria = categoria
    ? produtos.filter((produto) => Number(produto.categoria_id) === Number(categoria.id))
    : [];
  const indiceCategoria = categoria ? categorias.indexOf(categoria) : 0;
  usePageTitle(categoria ? rotuloCurto(categoria.nome) : 'Categoria');

  function tentarNovamente() {
    if (erroCategorias) invalidarCategorias();
    if (erroProdutos) invalidarProdutos();
  }

  if (!carregandoCategorias && !erroCategorias && !categoria) {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title="Categoria não encontrada"
          text="Confira outras categorias e encontre seu próximo colecionável."
          action={<Button to="/" variant="secondary">Voltar para o início</Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <nav aria-label="Trilha de navegação" className="mb-4 text-sm text-suave">
        <Link to="/" className="text-roxo underline">Início</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">
          {categoria ? rotuloCurto(categoria.nome) : 'Carregando categoria'}
        </span>
      </nav>

      <header className={`mb-8 rounded-card p-6 sm:p-8 ${coresCategoria[indiceCategoria % coresCategoria.length]}`}>
        <h1 ref={tituloRef} tabIndex="-1" className="text-3xl font-extrabold sm:text-4xl">
          {categoria ? rotuloCurto(categoria.nome) : 'Categoria'}
        </h1>
        <p className="mt-2 text-sm font-medium opacity-90">
          {categoria
            ? `${produtosCategoria.length} ${produtosCategoria.length === 1 ? 'produto' : 'produtos'}`
            : 'Explore os produtos desta categoria'}
        </p>
      </header>

      <ListaProdutos
        produtos={produtosCategoria}
        carregando={carregandoCategorias || carregandoProdutos}
        erro={erroCategorias || erroProdutos}
        onTentarNovamente={tentarNovamente}
        tituloRef={tituloRef}
      />
    </Container>
  );
}

export default Categoria;

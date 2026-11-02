import { useEffect, useRef, useState } from 'react';
import { ImageOff, Minus, Plus } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import ProdutoCard from '../components/ProdutoCard';
import { FRETE_FIXO } from '../config';
import { useCarrinho } from '../context/useCarrinho';
import { useCarrinhoDrawer } from '../hooks/useCarrinhoDrawer';
import { useToast } from '../hooks/useToast';
import { rotuloCurto, useCategorias } from '../hooks/useCategorias';
import { obterProdutoEmCache, useProdutos } from '../hooks/useProdutos';
import usePageTitle from '../hooks/usePageTitle';
import { buscarPorId } from '../services/produtoService';

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function ProdutoSkeleton() {
  return (
    <Container className="space-y-6 py-6 sm:py-10" aria-busy="true" aria-label="Carregando produto">
      <Skeleton className="h-5 w-56" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-card" />
        <div className="space-y-5 rounded-card border border-borda p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Container>
  );
}

function ProdutoDetalhe() {
  const { id } = useParams();
  const { produtos } = useProdutos();
  const { categorias } = useCategorias();
  const cacheInicial = obterProdutoEmCache(id);
  const [produtoState, setProdutoState] = useState(() => ({
    id,
    produto: cacheInicial,
  }));
  const [requisicaoState, setRequisicaoState] = useState(() => ({
    id,
    carregando: !cacheInicial,
    erro: null,
  }));
  const [tentativa, setTentativa] = useState(0);
  const [quantidadeState, setQuantidadeState] = useState({ id, valor: 1 });
  const caixaCompraRef = useRef(null);
  const { adicionar } = useCarrinho();
  const navigate = useNavigate();
  const toast = useToast();
  const { abrir: abrirCarrinho } = useCarrinhoDrawer();

  const produtoDaLista = produtos.find((item) => String(item.id) === String(id));
  const produto = produtoState.id === id && produtoState.produto
    ? produtoState.produto
    : produtoDaLista ?? obterProdutoEmCache(id);
  const requisicaoAtual = requisicaoState.id === id
    ? requisicaoState
    : { carregando: !produto, erro: null };
  const carregando = requisicaoAtual.carregando && !produto;
  const erro = requisicaoAtual.erro;
  const estoque = Number(produto?.estoque);
  const limiteQuantidade = Math.max(1, Math.min(estoque || 1, 99));
  const quantidade = Math.min(quantidadeState.id === id ? quantidadeState.valor : 1, limiteQuantidade);
  const categoria = categorias.find(
    (item) => Number(item.id) === Number(produto?.categoria_id),
  );
  usePageTitle(produto?.nome || 'Produto');
  const relacionados = produto
    ? produtos
      .filter((item) => (
        Number(item.categoria_id) === Number(produto.categoria_id)
        && Number(item.id) !== Number(produto.id)
      ))
      .slice(0, 4)
    : [];
  useEffect(() => {
    let ativo = true;
    buscarPorId(id)
      .then((dados) => {
        if (ativo) {
          setProdutoState({ id, produto: dados });
          setRequisicaoState({ id, carregando: false, erro: null });
        }
      })
      .catch((erroCarregamento) => {
        if (ativo) {
          setRequisicaoState({ id, carregando: false, erro: erroCarregamento });
        }
      });

    return () => {
      ativo = false;
    };
  }, [id, tentativa]);

  function tentarNovamente() {
    setRequisicaoState({ id, carregando: true, erro: null });
    setTentativa((valor) => valor + 1);
  }

  function adicionarAoCarrinho(event, irParaCarrinho = false) {
    const resultado = adicionar(produto, quantidade);
    if (!resultado.ok) {
      toast.info('Você já separou todo o estoque disponível desse item.');
      return;
    }

    if (irParaCarrinho) {
      navigate('/carrinho');
      return;
    }

    toast.success('Adicionado à coleção');
    abrirCarrinho(event.currentTarget);
  }

  if (carregando) return <ProdutoSkeleton />;

  if (erro?.message === 'Produto não encontrado') {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title="Produto não encontrado"
          text="Esse item não está disponível. Volte à loja para explorar a coleção."
          action={<Button to="/">Voltar para o início</Button>}
        />
      </Container>
    );
  }

  if (!produto && erro) {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title="Não foi possível atualizar o produto"
          text="O produto em cache continua disponível, mas não conseguimos confirmar o estoque agora."
          action={<Button variant="secondary" onClick={tentarNovamente}>
            Tentar novamente
          </Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <nav aria-label="Trilha de navegação" className="mb-6 text-sm text-suave">
        <Link to="/" className="text-roxo underline">Início</Link>
        <span aria-hidden="true" className="mx-2">/</span>
        {categoria ? (
          <Link to={`/categoria/${categoria.id}`} className="text-roxo underline">
            {rotuloCurto(categoria.nome)}
          </Link>
        ) : (
          <span>Categoria</span>
        )}
        <span aria-hidden="true" className="mx-2">/</span>
        <span aria-current="page">{produto.nome}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-card border border-borda bg-white shadow-card">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="size-full object-contain p-6 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
            />
          ) : (
            <ImageOff aria-hidden="true" className="size-16 text-roxo-claro" />
          )}
        </div>

        <section
          ref={caixaCompraRef}
          aria-labelledby="produto-nome"
          className="rounded-card border border-borda bg-white p-5 shadow-card sm:p-8"
        >
          {categoria && (
            <Badge variant="neutral" className="mb-4">
              <Link to={`/categoria/${categoria.id}`}>{rotuloCurto(categoria.nome)}</Link>
            </Badge>
          )}
          <h1 id="produto-nome" className="text-3xl font-extrabold text-roxo sm:text-4xl">
            {produto.nome}
          </h1>
          <p className="mt-4 whitespace-pre-line text-suave">{produto.descricao}</p>
          <p className="mt-6 text-3xl font-extrabold text-roxo">
            {formatarPreco(produto.preco)}
          </p>

          <div className="mt-3">
            {estoque <= 0
              ? <Badge variant="neutral">Esgotado</Badge>
              : estoque <= 5
                ? <Badge variant="danger">Restam {estoque}</Badge>
                : <Badge variant="success">Em estoque</Badge>}
          </div>

          <p className="mt-5 text-sm text-suave">
            Frete fixo de {formatarPreco(FRETE_FIXO)}, somado no pagamento.
          </p>
          {erro && (
            <div className="mt-4 rounded-lg bg-lilas/30 p-3 text-sm text-roxo" role="status">
              Não foi possível confirmar o estoque atualizado.
              <button
                type="button"
                onClick={tentarNovamente}
                className="ml-1 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-chumbo">Quantidade</p>
            <div className="inline-flex items-center rounded-lg border border-borda">
              <button
                type="button"
                aria-label="Diminuir quantidade"
                disabled={quantidade <= 1}
                onClick={() => setQuantidadeState({ id, valor: Math.max(1, quantidade - 1) })}
                className="rounded-l-lg p-3 text-roxo hover:bg-lilas/30 disabled:opacity-40"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <output aria-live="polite" aria-label={`Quantidade selecionada: ${quantidade}`} className="min-w-10 text-center font-semibold">
                {quantidade}
              </output>
              <button
                type="button"
                aria-label="Aumentar quantidade"
                disabled={estoque <= 0 || quantidade >= limiteQuantidade}
                onClick={() => setQuantidadeState({ id, valor: Math.min(limiteQuantidade, quantidade + 1) })}
                className="rounded-r-lg p-3 text-roxo hover:bg-lilas/30 disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-3">
            <Button
              disabled={estoque <= 0}
              onClick={(event) => adicionarAoCarrinho(event)}
              className="w-full"
            >
              Adicionar à coleção
            </Button>
            <Button
              variant="secondary"
              disabled={estoque <= 0}
              onClick={(event) => adicionarAoCarrinho(event, true)}
              className="w-full"
            >
              Comprar agora
            </Button>
          </div>
        </section>
      </div>

      {relacionados.length > 0 && (
        <section aria-labelledby="mais-produtos-titulo" className="mt-16">
          <h2 id="mais-produtos-titulo" className="mb-6 text-2xl font-extrabold text-roxo">
            Mais de {categoria ? rotuloCurto(categoria.nome) : 'esta categoria'}
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relacionados.map((item, indice) => (
              <ProdutoCard key={item.id} produto={item} indice={indice} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

export default ProdutoDetalhe;

import {
  CreditCard,
  Gamepad2,
  PackageSearch,
  Shield,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FRETE_FIXO } from '../config';
import ProdutoCard from '../components/ProdutoCard';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import { ProdutoCardSkeleton } from '../components/ui/Skeleton';
import Skeleton from '../components/ui/Skeleton';
import { invalidarCategorias, rotuloCurto, useCategorias } from '../hooks/useCategorias';
import { invalidarProdutos, useProdutos } from '../hooks/useProdutos';

const coresCategoria = [
  'bg-roxo-claro text-white',
  'bg-amarelo text-roxo',
  'bg-chumbo text-white',
];

function iconeCategoria(categoria) {
  const nome = categoria.nome.toLocaleLowerCase('pt-BR');
  if (Number(categoria.id) === 2 || /super|her[oó]i|marvel|dc/.test(nome)) return Shield;
  if (Number(categoria.id) === 3 || /pop|nostalgia|videogame/.test(nome)) return Gamepad2;
  return Sparkles;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Home() {
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
  const categoriasVisiveis = categorias.slice(0, 3);

  const produtosPorCategoria = categoriasVisiveis.map((categoria) => (
    produtos
      .filter((produto) => (
        Number(produto.categoria_id) === Number(categoria.id)
        && Number(produto.estoque) > 0
      ))
      .sort((a, b) => Number(b.preco) - Number(a.preco))
      .slice(0, 2)
  ));
  const destaques = Array.from(
    { length: Math.max(0, ...produtosPorCategoria.map((lista) => lista.length)) },
    (_, indice) => produtosPorCategoria.flatMap((lista) => lista[indice] || []),
  ).flat();
  const ultimasUnidades = produtos
    .filter((produto) => Number(produto.estoque) >= 1 && Number(produto.estoque) <= 5)
    .sort((a, b) => Number(a.estoque) - Number(b.estoque))
    .slice(0, 4);
  const produtoHero = produtos.find((produto) => produto.imagem_url && Number(produto.estoque) > 0);
  const temToken = Boolean(localStorage.getItem('token'));

  function tentarNovamente() {
    if (erroCategorias) invalidarCategorias();
    if (erroProdutos) invalidarProdutos();
  }

  function rolarPara(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  return (
    <div>
      <section aria-labelledby="home-titulo" className="relative isolate overflow-hidden bg-roxo text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="animate-ring-pulse absolute size-44 rounded-full border border-amarelo/30 sm:size-64" />
          <span className="animate-ring-pulse absolute size-64 rounded-full border border-amarelo/20 [animation-delay:300ms] sm:size-96" />
          <span className="animate-ring-pulse absolute size-80 rounded-full border border-white/10 [animation-delay:600ms] sm:size-[30rem]" />
        </div>
        <Container className="relative grid min-h-[26rem] items-center gap-8 py-12 sm:py-16 lg:min-h-[34rem] lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <p className="mb-4 font-semibold uppercase tracking-[0.2em] text-lilas">Multiverso Colecionáveis</p>
            <h1 id="home-titulo" className="max-w-2xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Todo fandom, <span className="text-amarelo">um só lugar.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-lilas sm:text-xl">
              Encontre a próxima peça da sua coleção e leve seus universos favoritos para casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                to="#categorias"
                onClick={(event) => {
                  event.preventDefault();
                  rolarPara('categorias');
                }}
              >
                Ver coleção
              </Button>
              {ultimasUnidades.length > 0 && (
                <Button
                  to="#ultimas-unidades"
                  variant="secondary"
                  className="border-white text-white hover:bg-white/10"
                  onClick={(event) => {
                    event.preventDefault();
                    rolarPara('ultimas-unidades');
                  }}
                >
                  Últimas unidades
                </Button>
              )}
            </div>
          </div>

          {carregandoProdutos ? (
            <div
              aria-busy="true"
              aria-label="Carregando produto em destaque"
              className="mx-auto w-full max-w-xs rounded-card border border-white/20 bg-white p-3 shadow-card-hover sm:max-w-sm lg:max-w-md"
            >
              <Skeleton className="aspect-square w-full rounded-xl" />
              <Skeleton className="mx-2 mb-2 mt-4 h-5 w-3/4" />
              <Skeleton className="mx-2 mb-2 h-4 w-1/3" />
            </div>
          ) : produtoHero && (
            <div className="animate-hero-float mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md">
              <div className="overflow-hidden rounded-card border border-white/20 bg-white p-3 shadow-card-hover">
                <img
                  src={produtoHero.imagem_url}
                  alt={`Produto em destaque: ${produtoHero.nome}`}
                  className="aspect-square w-full rounded-xl object-contain"
                />
                <div className="px-2 pb-2 pt-4 text-roxo">
                  <p className="text-sm font-semibold text-roxo-claro">Em destaque</p>
                  <p className="mt-1 line-clamp-1 text-lg font-bold">{produtoHero.nome}</p>
                  <p className="mt-1 font-bold">{formatarPreco(produtoHero.preco)}</p>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      <Container className="space-y-16 py-12 sm:space-y-20 sm:py-16">
        <section id="categorias" aria-labelledby="categorias-titulo" className="scroll-mt-28">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-semibold uppercase tracking-widest text-roxo-claro">Explore o multiverso</p>
              <h2 id="categorias-titulo" className="mt-2 text-3xl font-extrabold text-roxo">Escolha seu universo</h2>
            </div>
          </div>

          {erroCategorias ? (
            <EmptyState
              headingLevel={3}
              title="Não foi possível carregar a coleção"
              text="Tente novamente em instantes."
              action={<Button onClick={tentarNovamente} variant="secondary">Tentar de novo</Button>}
            />
          ) : carregandoCategorias || carregandoProdutos ? (
            <div aria-busy="true" aria-label="Carregando categorias" className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }, (_, indice) => (
                <div key={indice} className="h-48 animate-shimmer rounded-card bg-borda" />
              ))}
            </div>
          ) : categoriasVisiveis.length === 0 ? (
            <EmptyState
              headingLevel={3}
              title="Novos universos a caminho"
              text="Estamos preparando categorias para você explorar."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {categoriasVisiveis.map((categoria, indice) => {
                const Icon = iconeCategoria(categoria);
                const quantidade = produtos.filter(
                  (produto) => Number(produto.categoria_id) === Number(categoria.id),
                ).length;

                return (
                  <Link
                    key={categoria.id}
                    to={`/categoria/${categoria.id}`}
                    className={`group flex min-h-48 flex-col justify-between rounded-card p-6 shadow-card transition-transform hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transform-none ${coresCategoria[indice % coresCategoria.length]}`}
                  >
                    <Icon aria-hidden="true" className="size-9" />
                    <span>
                      <h3 className="text-2xl font-extrabold">{rotuloCurto(categoria.nome)}</h3>
                      <span className="mt-1 block text-sm opacity-90">
                        {erroProdutos
                          ? 'Contagem indisponível'
                          : `${quantidade} ${quantidade === 1 ? 'produto' : 'produtos'}`}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section aria-labelledby="destaques-titulo">
          <div className="mb-6">
            <p className="font-semibold uppercase tracking-widest text-roxo-claro">Peças que merecem destaque</p>
            <h2 id="destaques-titulo" className="mt-2 text-3xl font-extrabold text-roxo">Em destaque</h2>
          </div>
          {erroProdutos || erroCategorias ? (
            <EmptyState
              headingLevel={3}
              title="Destaques indisponíveis"
              text="Não foi possível carregar os produtos agora."
              action={<Button onClick={tentarNovamente} variant="secondary">Tentar de novo</Button>}
            />
          ) : carregandoProdutos || carregandoCategorias ? (
            <div aria-busy="true" aria-label="Carregando produtos em destaque" className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {Array.from({ length: 6 }, (_, indice) => <ProdutoCardSkeleton key={indice} />)}
            </div>
          ) : produtos.length === 0 ? (
            <EmptyState
              headingLevel={3}
              title="Nossa coleção está chegando"
              text="Em breve, novos produtos para você descobrir."
            />
          ) : destaques.length === 0 ? (
            <EmptyState headingLevel={3} title="Novidades em breve" text="Ainda não há produtos disponíveis para destacar." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              {destaques.map((produto, indice) => (
                <ProdutoCard key={produto.id} produto={produto} indice={indice} headingLevel={3} />
              ))}
            </div>
          )}
        </section>

        {!carregandoProdutos && !erroProdutos && !erroCategorias && ultimasUnidades.length > 0 && (
          <section id="ultimas-unidades" aria-labelledby="ultimas-titulo" className="scroll-mt-28">
            <div className="mb-6">
              <p className="font-semibold uppercase tracking-widest text-vermelho-escuro">Não deixe passar</p>
              <h2 id="ultimas-titulo" className="mt-2 text-3xl font-extrabold text-roxo">Últimas unidades</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {ultimasUnidades.map((produto, indice) => (
                <ProdutoCard key={produto.id} produto={produto} indice={indice} headingLevel={3} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="beneficios-titulo">
          <h2 id="beneficios-titulo" className="sr-only">Comprar com tranquilidade</h2>
          <div className="grid grid-cols-2 gap-4 rounded-card bg-lilas/30 p-5 md:grid-cols-4 md:p-8">
            <div className="flex flex-col items-center gap-3 text-center text-roxo">
              <CreditCard aria-hidden="true" className="size-8 text-roxo-claro" />
              <span className="font-semibold">Pix, cartão ou boleto</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center text-roxo">
              <ShieldCheck aria-hidden="true" className="size-8 text-roxo-claro" />
              <span className="font-semibold">Pagamento seguro via Mercado Pago</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center text-roxo">
              <Truck aria-hidden="true" className="size-8 text-roxo-claro" />
              <span className="font-semibold">Frete fixo de {formatarPreco(FRETE_FIXO)}</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center text-roxo">
              <PackageSearch aria-hidden="true" className="size-8 text-roxo-claro" />
              <span className="font-semibold">Acompanhe seus pedidos</span>
            </div>
          </div>
        </section>

        <section aria-labelledby="cta-titulo" className="rounded-card bg-roxo px-6 py-10 text-center text-white sm:px-10 sm:py-14">
          <h2 id="cta-titulo" className="font-display text-3xl font-extrabold sm:text-4xl">Bora montar sua coleção?</h2>
          <p className="mx-auto mt-3 max-w-xl text-lilas">
            O próximo item inesquecível está esperando por você.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button to="#categorias" onClick={(event) => {
              event.preventDefault();
              rolarPara('categorias');
            }}>
              Ver coleção
            </Button>
            {!temToken && (
              <Button
                to="/cadastro"
                variant="secondary"
                className="border-white text-white hover:bg-white/10"
              >
                Criar conta
              </Button>
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}

export default Home;

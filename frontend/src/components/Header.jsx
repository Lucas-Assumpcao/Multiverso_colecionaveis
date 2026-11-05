import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageOff, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCarrinho } from '../context/useCarrinho';
import { useCarrinhoDrawer } from '../hooks/useCarrinhoDrawer';
import { useCategorias, rotuloCurto } from '../hooks/useCategorias';
import { useProdutos } from '../hooks/useProdutos';
import LogoIcone from './LogoIcone';

function normalizarBusca(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Header() {
  const { itens } = useCarrinho();
  const { abrir } = useCarrinhoDrawer();
  const navigate = useNavigate();
  const { categorias, erro: erroCategorias } = useCategorias();
  const { produtos } = useProdutos();
  const [termoBusca, setTermoBusca] = useState('');
  const [termoDebounced, setTermoDebounced] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [sugestaoAtiva, setSugestaoAtiva] = useState(-1);
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolado, setRolado] = useState(false);
  const [contadorKey, setContadorKey] = useState(0);
  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const contagemAnterior = useRef(totalItens);
  const token = localStorage.getItem('token');
  const termoAtual = termoBusca.trim();
  const sugestoesDisponiveis = termoDebounced === termoAtual && termoAtual.length >= 2
    ? produtos
      .filter((produto) => normalizarBusca(`${produto.nome} ${produto.descricao || ''}`)
        .includes(normalizarBusca(termoAtual)))
      .slice(0, 5)
    : [];
  const opcoesSugestao = [
    ...sugestoesDisponiveis.map((produto) => ({ tipo: 'produto', produto })),
    ...(termoAtual.length >= 2 ? [{ tipo: 'todos' }] : []),
  ];

  useEffect(() => {
    const timer = setTimeout(() => setTermoDebounced(termoBusca.trim()), 150);
    return () => clearTimeout(timer);
  }, [termoBusca]);

  useEffect(() => {
    if (!sugestoesAbertas) return undefined;

    function fecharAoClicarFora(event) {
      if (!(event.target instanceof Element) || !event.target.closest('[data-search-root]')) {
        setSugestoesAbertas(false);
        setSugestaoAtiva(-1);
      }
    }

    document.addEventListener('pointerdown', fecharAoClicarFora);
    return () => document.removeEventListener('pointerdown', fecharAoClicarFora);
  }, [sugestoesAbertas]);

  useEffect(() => {
    const atualizarRolagem = () => setRolado(window.scrollY > 8);
    atualizarRolagem();
    window.addEventListener('scroll', atualizarRolagem, { passive: true });
    return () => window.removeEventListener('scroll', atualizarRolagem);
  }, []);

  useEffect(() => {
    if (totalItens > contagemAnterior.current) {
      setContadorKey((key) => key + 1);
    }
    contagemAnterior.current = totalItens;
  }, [totalItens]);

  useEffect(() => {
    const fecharMenu = () => setMenuAberto(false);
    window.addEventListener('popstate', fecharMenu);
    return () => window.removeEventListener('popstate', fecharMenu);
  }, []);

  useEffect(() => {
    if (!menuAberto) return undefined;

    function fecharComEscape(event) {
      if (event.key === 'Escape') {
        setMenuAberto(false);
        menuButtonRef.current?.focus();
      }
    }

    function fecharAoClicarFora(event) {
      if (
        !menuRef.current?.contains(event.target)
        && !menuButtonRef.current?.contains(event.target)
      ) {
        setMenuAberto(false);
      }
    }

    document.addEventListener('keydown', fecharComEscape);
    document.addEventListener('pointerdown', fecharAoClicarFora);
    return () => {
      document.removeEventListener('keydown', fecharComEscape);
      document.removeEventListener('pointerdown', fecharAoClicarFora);
    };
  }, [menuAberto]);

  function buscar(event) {
    event.preventDefault();
    navegarParaBusca();
  }

  function navegarParaBusca() {
    const nome = termoBusca.trim();
    if (!nome) return;
    setMenuAberto(false);
    setSugestoesAbertas(false);
    setSugestaoAtiva(-1);
    navigate(`/busca?nome=${encodeURIComponent(nome)}`);
  }

  function selecionarSugestao(opcao) {
    setSugestoesAbertas(false);
    setSugestaoAtiva(-1);
    if (opcao.tipo === 'produto') {
      navigate(`/produtos/${opcao.produto.id}`);
      setMenuAberto(false);
      return;
    }
    navegarParaBusca();
  }

  function navegarSugestoes(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setSugestoesAbertas(false);
      setSugestaoAtiva(-1);
      return;
    }

    const sugestoesProntas = termoAtual.length >= 2 && termoDebounced === termoAtual;
    if (
      event.key === 'Enter'
      && sugestoesProntas
      && sugestaoAtiva >= 0
      && opcoesSugestao[sugestaoAtiva]
    ) {
      event.preventDefault();
      selecionarSugestao(opcoesSugestao[sugestaoAtiva]);
      return;
    }

    if (
      !['ArrowDown', 'ArrowUp'].includes(event.key)
      || !sugestoesProntas
      || opcoesSugestao.length === 0
    ) return;
    event.preventDefault();
    setSugestoesAbertas(true);
    setSugestaoAtiva((indiceAtual) => {
      if (event.key === 'ArrowDown') {
        return indiceAtual < opcoesSugestao.length - 1 ? indiceAtual + 1 : 0;
      }
      return indiceAtual > 0 ? indiceAtual - 1 : opcoesSugestao.length - 1;
    });
  }

  function sair() {
    localStorage.removeItem('token');
    setMenuAberto(false);
    navigate('/');
  }

  function contador() {
    if (totalItens === 0) return null;
    return (
      <span
        key={contadorKey}
        className="animate-pop absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-amarelo px-1 text-[11px] font-bold text-roxo"
      >
        {totalItens}
      </span>
    );
  }

  function logo() {
    return (
      <Link
        to="/"
        onClick={() => setMenuAberto(false)}
        aria-label="Multiverso Colecionáveis — início"
        className="flex shrink-0 items-center gap-2"
      >
        <LogoIcone aria-hidden="true" className="size-11" />
        <span className="hidden leading-none sm:block">
          <span className="block font-display text-sm font-extrabold tracking-wide text-amarelo">MULTIVERSO</span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.22em] text-amarelo">COLECIONÁVEIS</span>
        </span>
      </Link>
    );
  }

  function busca(id, classes = '') {
    const listboxId = `${id}-sugestoes`;
    const mostrarSugestoes = sugestoesAbertas
      && termoAtual.length >= 2
      && termoDebounced === termoAtual;

    return (
      <div data-search-root className="relative w-full">
        <form
          onSubmit={buscar}
          role="search"
          className={`flex min-w-0 items-center overflow-hidden rounded-lg border border-white/40 bg-white ${classes}`}
        >
          <input
            id={`${id}-input`}
            type="search"
            role="combobox"
            aria-label="Buscar produtos por nome"
            aria-expanded={mostrarSugestoes}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              mostrarSugestoes && sugestaoAtiva >= 0
                ? `${id}-opcao-${sugestaoAtiva}`
                : undefined
            }
            placeholder="Buscar produtos"
            value={termoBusca}
            onFocus={() => {
              if (termoAtual.length >= 2) setSugestoesAbertas(true);
            }}
            onKeyDown={navegarSugestoes}
            onChange={(event) => {
              setTermoBusca(event.target.value);
              setSugestaoAtiva(-1);
              setSugestoesAbertas(event.target.value.trim().length >= 2);
            }}
            className="min-h-11 min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-chumbo"
          />
          <button
            type="submit"
            aria-label="Buscar"
            className="flex size-11 shrink-0 items-center justify-center bg-amarelo text-roxo transition-colors hover:brightness-95"
          >
            <Search aria-hidden="true" className="size-5" />
          </button>
        </form>
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Sugestões de produtos"
          hidden={!mostrarSugestoes}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-borda bg-white p-2 text-chumbo shadow-card-hover"
        >
          {mostrarSugestoes && opcoesSugestao.map((opcao, indice) => (
              <li
                key={opcao.tipo === 'produto' ? opcao.produto.id : 'todos'}
                id={`${id}-opcao-${indice}`}
                role="option"
                aria-selected={sugestaoAtiva === indice}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setSugestaoAtiva(indice)}
                onClick={() => selecionarSugestao(opcao)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-left ${
                  sugestaoAtiva === indice ? 'bg-lilas/40' : 'hover:bg-lilas/30'
                }`}
              >
                {opcao.tipo === 'produto' ? (
                  <>
                    {opcao.produto.imagem_url ? (
                      <img
                        src={opcao.produto.imagem_url}
                        alt=""
                        className="size-12 shrink-0 rounded-md bg-white object-contain"
                      />
                    ) : (
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-lilas/30 text-roxo">
                        <ImageOff aria-hidden="true" className="size-5" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{opcao.produto.nome}</span>
                      <span className="block text-xs text-suave">{formatarPreco(opcao.produto.preco)}</span>
                    </span>
                  </>
                ) : (
                  <span className="px-1 py-1 text-sm font-semibold text-roxo">
                    Ver todos os resultados para &apos;{termoAtual}&apos;
                  </span>
                )}
              </li>
          ))}
        </ul>
      </div>
    );
  }

  function carrinhoLink() {
    return (
      <button
        type="button"
        onClick={(event) => {
          setMenuAberto(false);
          abrir(event.currentTarget);
        }}
        aria-label={`Abrir carrinho${totalItens ? `, ${totalItens} itens` : ''}`}
        className="relative inline-flex size-11 shrink-0 items-center justify-center rounded-full text-amarelo transition-colors hover:bg-white/10"
      >
        <ShoppingCart aria-hidden="true" className="size-5" />
        {contador()}
      </button>
    );
  }

  function conta(classes = '') {
    return token ? (
      <div className={`flex items-center gap-4 ${classes}`}>
        <Link to="/meus-pedidos" onClick={() => setMenuAberto(false)} className="inline-flex min-h-11 items-center transition-colors hover:text-amarelo">Meus Pedidos</Link>
        <button type="button" onClick={sair} className="inline-flex min-h-11 min-w-11 items-center justify-center text-amarelo transition-colors hover:text-white">Sair</button>
      </div>
    ) : (
      <div className={`flex items-center gap-4 ${classes}`}>
        <Link to="/login" onClick={() => setMenuAberto(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 transition-colors hover:text-amarelo">Login</Link>
        <Link to="/cadastro" onClick={() => setMenuAberto(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 transition-colors hover:text-amarelo">Cadastre-se</Link>
      </div>
    );
  }

  function linksCategorias(classes = '') {
    if (erroCategorias) {
      return <p className="text-sm text-white/75">Categorias indisponíveis no momento.</p>;
    }

    return categorias.map((categoria) => (
      <Link
        key={categoria.id}
        to={`/categoria/${categoria.id}`}
        onClick={() => setMenuAberto(false)}
        className={`inline-flex min-h-11 items-center rounded px-2 py-3 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-amarelo ${classes}`}
      >
        {rotuloCurto(categoria.nome)}
      </Link>
    ));
  }

  return (
    <header
      className={`on-dark sticky top-0 z-40 bg-roxo text-white backdrop-blur transition-shadow duration-200 ${
        rolado ? 'shadow-md shadow-black/15' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-3 lg:h-[76px]">
          {logo()}

          <div className="hidden min-w-0 flex-1 justify-center px-6 lg:flex">
            {busca('busca-desktop', 'w-full max-w-xl')}
          </div>

          <div className="hidden shrink-0 items-center gap-5 text-sm lg:flex">
            {carrinhoLink()}
            {conta()}
          </div>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            {carrinhoLink()}
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="inline-flex size-11 items-center justify-center rounded-full text-amarelo transition-colors hover:bg-white/10"
            >
              {menuAberto
                ? <X aria-hidden="true" className="size-6" />
                : <Menu aria-hidden="true" className="size-6" />}
            </button>
          </div>
        </div>

        <nav aria-label="Categorias" className="hidden min-h-11 flex-wrap items-center justify-center gap-2 border-t border-white/10 py-2 lg:flex">
          {linksCategorias()}
        </nav>

        <div
          id="menu-mobile"
          ref={menuRef}
          aria-hidden={!menuAberto}
          inert={!menuAberto}
          className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
            menuAberto ? 'max-h-[80vh] border-t border-white/10 opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <div className="max-h-[80vh] overflow-y-auto py-4">
            {busca('busca-mobile', 'w-full')}
            <nav aria-label="Categorias no menu móvel" className="mt-4 grid grid-cols-2 gap-2">
              {linksCategorias('block break-words')}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">
              {conta('flex-col items-start gap-3')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

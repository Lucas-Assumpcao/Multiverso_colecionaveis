import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useCarrinho } from '../context/useCarrinho';
import { useCategorias, rotuloCurto } from '../hooks/useCategorias';
import LogoIcone from './LogoIcone';

function Header() {
  const { itens } = useCarrinho();
  const navigate = useNavigate();
  const { categorias, erro: erroCategorias } = useCategorias();
  const [termoBusca, setTermoBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolado, setRolado] = useState(false);
  const [contadorKey, setContadorKey] = useState(0);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const contagemAnterior = useRef(0);
  const token = localStorage.getItem('token');
  const totalItens = itens.reduce((soma, item) => soma + item.quantidade, 0);

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
      if (event.key === 'Escape') setMenuAberto(false);
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
    const nome = termoBusca.trim();
    if (!nome) return;
    setMenuAberto(false);
    navigate(`/busca?nome=${encodeURIComponent(nome)}`);
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
        <LogoIcone aria-hidden="true" className="size-10 sm:size-11" />
        <span className="hidden leading-none sm:block">
          <span className="block font-display text-sm font-extrabold tracking-wide text-amarelo">MULTIVERSO</span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[0.22em] text-amarelo">COLECIONÁVEIS</span>
        </span>
      </Link>
    );
  }

  function busca(classes = '') {
    return (
      <form
        onSubmit={buscar}
        role="search"
        className={`flex min-w-0 items-center overflow-hidden rounded-lg border border-white/40 bg-white ${classes}`}
      >
        <input
          type="search"
          aria-label="Buscar produtos por nome"
          placeholder="Buscar produtos"
          value={termoBusca}
          onChange={(event) => setTermoBusca(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-chumbo outline-none"
        />
        <button
          type="submit"
          aria-label="Buscar"
          className="flex h-10 w-11 shrink-0 items-center justify-center bg-amarelo text-roxo transition-colors hover:brightness-95"
        >
          <Search aria-hidden="true" className="size-5" />
        </button>
      </form>
    );
  }

  function carrinhoLink(mobile = false) {
    return (
      <Link
        to="/carrinho"
        onClick={() => setMenuAberto(false)}
        aria-label={`Abrir carrinho${totalItens ? `, ${totalItens} itens` : ''}`}
        className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-amarelo transition-colors hover:bg-white/10 ${mobile ? '' : 'px-2'}`}
      >
        <ShoppingCart aria-hidden="true" className="size-5" />
        {contador()}
      </Link>
    );
  }

  function conta(classes = '') {
    return token ? (
      <div className={`flex items-center gap-4 ${classes}`}>
        <Link to="/meus-pedidos" onClick={() => setMenuAberto(false)} className="transition-colors hover:text-amarelo">Meus Pedidos</Link>
        <button type="button" onClick={sair} className="text-amarelo transition-colors hover:text-white">Sair</button>
      </div>
    ) : (
      <div className={`flex items-center gap-4 ${classes}`}>
        <Link to="/login" onClick={() => setMenuAberto(false)} className="transition-colors hover:text-amarelo">Login</Link>
        <Link to="/cadastro" onClick={() => setMenuAberto(false)} className="transition-colors hover:text-amarelo">Cadastre-se</Link>
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
        className={`rounded px-2 py-1 text-sm text-white/90 transition-colors hover:bg-white/10 hover:text-amarelo ${classes}`}
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
            {busca('w-full max-w-xl')}
          </div>

          <div className="hidden shrink-0 items-center gap-5 text-sm lg:flex">
            {carrinhoLink()}
            {conta()}
          </div>

          <div className="flex shrink-0 items-center gap-1 lg:hidden">
            {carrinhoLink(true)}
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={menuAberto}
              aria-controls="menu-mobile"
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="inline-flex size-10 items-center justify-center rounded-full text-amarelo transition-colors hover:bg-white/10"
            >
              {menuAberto
                ? <X aria-hidden="true" className="size-6" />
                : <Menu aria-hidden="true" className="size-6" />}
            </button>
          </div>
        </div>

        <nav aria-label="Categorias" className="hidden min-h-10 flex-wrap items-center justify-center gap-2 border-t border-white/10 py-2 lg:flex">
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
            {busca('w-full')}
            <nav aria-label="Categorias" className="mt-4 grid grid-cols-2 gap-2">
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

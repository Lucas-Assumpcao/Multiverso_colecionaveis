import { Link } from 'react-router-dom';
import { useCategorias, rotuloCurto } from '../hooks/useCategorias';
import LogoIcone from './LogoIcone';

function Footer() {
  const { categorias, erro } = useCategorias();
  const ano = new Date().getFullYear();

  return (
    <footer className="on-dark bg-roxo text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" aria-label="Multiverso Colecionáveis — início" className="inline-flex items-center gap-3">
            <LogoIcone aria-hidden="true" className="size-12" />
            <span className="font-display text-lg font-extrabold tracking-wide text-amarelo">MULTIVERSO</span>
          </Link>
          <p className="mt-4 text-sm text-white/80">Todo fandom, um só lugar.</p>
        </div>

        <nav aria-label="Links do rodapé">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-amarelo">Explore</h2>
          <ul className="space-y-1 text-sm text-white/85">
            {erro
              ? <li>Categorias indisponíveis no momento.</li>
              : categorias.map((categoria) => (
                <li key={categoria.id}>
                  <Link className="inline-flex min-h-11 items-center py-2 hover:text-amarelo" to={`/categoria/${categoria.id}`}>
                    {rotuloCurto(categoria.nome)}
                  </Link>
                </li>
              ))}
            <li><Link className="inline-flex min-h-11 items-center py-2 hover:text-amarelo" to="/meus-pedidos">Meus Pedidos</Link></li>
            <li><Link className="inline-flex min-h-11 min-w-11 items-center justify-center py-2 hover:text-amarelo" to="/login">Login</Link></li>
          </ul>
        </nav>

        <div className="space-y-3 text-sm text-white/85">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amarelo">Pagamento seguro</h2>
          <p>Pague com Pix, cartão ou boleto via Mercado Pago.</p>
          <p className="text-white/70">Ambiente de demonstração: pagamentos de teste.</p>
        </div>
      </div>

      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/70">
        © {ano} — Multiverso Colecionáveis, projeto de portfólio.
      </div>
    </footer>
  );
}

export default Footer;

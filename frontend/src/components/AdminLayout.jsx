import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Container from './ui/Container';
import Field from './ui/Field';
import { useToast } from '../hooks/useToast';
import usePageTitle from '../hooks/usePageTitle';
import { login } from '../services/adminService';
import { ADMIN_SESSION_EXPIRED_EVENT } from '../services/adminAuthFetch';

const links = [
  { to: '/admin', label: 'Painel', end: true },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/pedidos', label: 'Pedidos' },
];

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const toast = useToast();
  usePageTitle('Admin — Entrar');

  async function handleSubmit(event) {
    event.preventDefault();
    if (carregando) return;
    setCarregando(true);
    try {
      const resultado = await login(email, senha);
      localStorage.setItem('adminToken', resultado.token);
      onLogin();
      toast.success('Bem-vindo ao painel administrativo.');
    } catch (erro) {
      toast.error(erro.message || 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto max-w-md rounded-card border border-borda bg-white p-6 shadow-card sm:p-8">
        <p className="font-semibold uppercase tracking-widest text-roxo-claro">Multiverso Colecionáveis</p>
        <h1 className="mb-6 mt-2 text-3xl font-extrabold text-roxo">Acesso administrativo</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field
            id="admin-email"
            label="E-mail"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Field
            id="admin-senha"
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            required
          />
          <Button type="submit" loading={carregando} loadingText="Entrando..." size="lg">
            Entrar
          </Button>
        </form>
        <Link to="/" className="mt-5 inline-block font-semibold text-roxo underline">
          Voltar à loja
        </Link>
      </div>
    </Container>
  );
}

function AdminLayout() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    function lidarComSessaoExpirada() {
      setToken(null);
      navigate('/admin', { replace: true });
      toast.info('Sessão expirada. Entre de novo.');
    }

    window.addEventListener(ADMIN_SESSION_EXPIRED_EVENT, lidarComSessaoExpirada);
    return () => window.removeEventListener(ADMIN_SESSION_EXPIRED_EVENT, lidarComSessaoExpirada);
  }, [navigate, toast]);

  function sair() {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/admin', { replace: true });
    toast.info('Você saiu do painel administrativo.');
  }

  if (!token) return <AdminLogin onLogin={() => setToken(localStorage.getItem('adminToken'))} />;

  return (
    <div className="min-h-[70vh] bg-[#F8F7FB]">
      <div className="border-b border-borda bg-white lg:hidden">
        <Container className="py-3">
          <nav aria-label="Navegação administrativa" className="flex flex-wrap items-center justify-center gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive ? 'bg-roxo text-white' : 'text-roxo hover:bg-lilas/40'
                }`}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/" className="rounded-lg px-3 py-2 text-sm font-semibold text-roxo hover:bg-lilas/40">
              Ver loja
            </Link>
            <button type="button" onClick={sair} className="rounded-lg px-3 py-2 text-sm font-semibold text-vermelho-escuro hover:bg-red-50">
              Sair
            </button>
          </nav>
        </Container>
      </div>

      <div className="mx-auto flex min-h-[70vh] max-w-[100rem]">
        <aside className="hidden w-64 shrink-0 border-r border-borda bg-white p-5 lg:block">
          <Link to="/admin" className="block text-xl font-extrabold text-roxo">
            MULTIVERSO
            <span className="mt-1 block text-xs font-semibold tracking-[0.2em] text-roxo-claro">ADMINISTRAÇÃO</span>
          </Link>
          <nav aria-label="Navegação administrativa" className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `rounded-lg px-4 py-3 font-semibold ${
                  isActive ? 'bg-roxo text-white' : 'text-chumbo hover:bg-lilas/40'
                }`}
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/" className="rounded-lg px-4 py-3 font-semibold text-chumbo hover:bg-lilas/40">
              Ver loja
            </Link>
          </nav>
          <Button variant="ghost" className="mt-8 w-full justify-start" onClick={sair}>
            Sair
          </Button>
        </aside>
        <main id="conteudo" tabIndex="-1" className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

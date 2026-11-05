import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CarrinhoProvider } from './context/CarrinhoContext';
import CarrinhoDrawerProvider from './context/CarrinhoDrawerProvider';
import ToastProvider from './context/ToastProvider';
import Skeleton, { ProdutoCardSkeleton } from './components/ui/Skeleton';
import Container from './components/ui/Container';

const LojaLayout = lazy(() => import('./components/LojaLayout'));
const AdminLayout = lazy(() => import('./components/AdminLayout'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const AdminPainel = lazy(() => import('./pages/AdminPainel'));
const AdminProdutos = lazy(() => import('./pages/AdminProdutos'));
const AdminProdutoForm = lazy(() => import('./pages/AdminProdutoForm'));
const AdminPedidos = lazy(() => import('./pages/AdminPedidos'));
const Cadastro = lazy(() => import('./pages/Cadastro'));
const Carrinho = lazy(() => import('./pages/Carrinho'));
const Categoria = lazy(() => import('./pages/Categoria'));
const Busca = lazy(() => import('./pages/Busca'));
const Confirmacao = lazy(() => import('./pages/Confirmacao'));
const Endereco = lazy(() => import('./pages/Endereco'));
const MeusPedidos = lazy(() => import('./pages/MeusPedidos'));
const Pagamento = lazy(() => import('./pages/Pagamento'));
const ProdutoDetalhe = lazy(() => import('./pages/ProdutoDetalhe'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UiKit = import.meta.env.DEV
  ? lazy(() => import('./pages/UiKit'))
  : null;

function PageSkeleton() {
  return (
    <Container as="div" className="py-8" aria-busy="true" aria-label="Carregando página">
      <Skeleton className="mb-6 h-9 w-2/3 max-w-sm" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <ProdutoCardSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}

function RouteContent() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <div key={location.pathname} className="animate-fade-up">
        <Routes location={location}>
          <Route element={<LojaLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/categoria/:categoriaId" element={<Categoria />} />
            <Route path="/busca" element={<Busca />} />
            <Route path="/confirmacao" element={<Confirmacao />} />
            <Route path="/endereco" element={<Endereco />} />
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
            <Route path="/pagamento" element={<Pagamento />} />
            <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
            {import.meta.env.DEV && <Route path="/ui-kit" element={<UiKit />} />}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPainel />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="produtos/form" element={<AdminProdutoForm />} />
            <Route path="pedidos" element={<AdminPedidos />} />
          </Route>
        </Routes>
      </div>
    </Suspense>
  );
}

function RouterApplication() {
  return (
    <CarrinhoProvider>
      <ToastProvider>
        <BrowserRouter>
          <CarrinhoDrawerProvider>
            <RouteContent />
          </CarrinhoDrawerProvider>
        </BrowserRouter>
      </ToastProvider>
    </CarrinhoProvider>
  );
}

export default RouterApplication;

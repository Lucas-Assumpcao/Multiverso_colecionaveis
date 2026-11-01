import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CarrinhoProvider } from './context/CarrinhoContext';
import ToastProvider from './context/ToastProvider';
import Header from './components/Header';
import Skeleton, { ProdutoCardSkeleton } from './components/ui/Skeleton';
import Container from './components/ui/Container';

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

function PageSkeleton() {
  return (
    <Container as="main" className="py-8" aria-busy="true" aria-label="Carregando página">
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
      <main key={`${location.pathname}${location.search}`} className="animate-fade-up">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPainel />} />
          <Route path="/admin/produtos" element={<AdminProdutos />} />
          <Route path="/admin/produtos/form" element={<AdminProdutoForm />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/categoria/:categoriaId" element={<Categoria />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="/confirmacao" element={<Confirmacao />} />
          <Route path="/endereco" element={<Endereco />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          <Route path="/pagamento" element={<Pagamento />} />
          <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </Suspense>
  );
}

function App() {
  return (
    <CarrinhoProvider>
      <ToastProvider>
        <BrowserRouter>
          <Header />
          <RouteContent />
        </BrowserRouter>
      </ToastProvider>
    </CarrinhoProvider>
  );
}

export default App;

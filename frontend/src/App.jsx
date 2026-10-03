import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPainel from './pages/AdminPainel';
import AdminProdutos from './pages/AdminProdutos';
import AdminProdutoForm from './pages/AdminProdutoForm';
import AdminPedidos from './pages/AdminPedidos';
import Cadastro from './pages/Cadastro';
import Carrinho from './pages/Carrinho';
import Categoria from './pages/Categoria';
import Confirmacao from './pages/Confirmacao';
import Endereco from './pages/Endereco';
import MeusPedidos from './pages/MeusPedidos';
import Pagamento from './pages/Pagamento';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import NotFound from './pages/NotFound';
import { CarrinhoProvider } from './context/CarrinhoContext';



function App() {
  return (
    <CarrinhoProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPainel />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/produtos/form" element={<AdminProdutoForm />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/categoria/:categoriaId" element={<Categoria />} />
        <Route path="/confirmacao" element={<Confirmacao />} />
        <Route path="/endereco" element={<Endereco />} />
        <Route path="/meus-pedidos" element={<MeusPedidos />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/produtos/:id" element={<ProdutoDetalhe />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </CarrinhoProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound'
import AdminPainel from './pages/AdminPainel';
import AdminProdutos from './pages/AdminProdutos';
import AdminProdutosForm from './pages/AdminProdutosForm';
import AdminPedidos from './pages/AdminPedidos';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminPainel />} />
        <Route path="/admin/produtos" element={<AdminProdutos />} />
        <Route path="/admin/produtos/form" element={<AdminProdutosForm />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
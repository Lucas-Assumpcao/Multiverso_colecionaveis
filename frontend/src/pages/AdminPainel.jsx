import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/adminService';

function AdminPainel() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const logado = !!localStorage.getItem('adminToken');

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await login(email, senha);
      localStorage.setItem('adminToken', resultado.token);
      navigate(0); // recarrega o componente pra refletir o novo estado de login
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }

  function sair() {
    localStorage.removeItem('adminToken');
    navigate(0);
  }

  if (!logado) {
    return (
      <div className="p-8 max-w-sm mx-auto">
        <h1 className="text-roxo text-3xl font-bold mb-6">Login Admin</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email" placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-lg p-3" required
          />
          <input
            type="password" placeholder="Senha" value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border rounded-lg p-3" required
          />
          {erro && <p className="text-vermelho text-sm">{erro.message}</p>}
          <button
            disabled={carregando}
            className="bg-amarelo text-roxo font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Painel Admin</h1>
      <div className="flex flex-col gap-3">
        <Link to="/admin/produtos" className="bg-roxo text-amarelo font-bold p-4 rounded-lg text-center">
          Gerenciar Produtos
        </Link>
        <Link to="/admin/pedidos" className="bg-roxo text-amarelo font-bold p-4 rounded-lg text-center">
          Gerenciar Pedidos
        </Link>
        <button onClick={sair} className="text-vermelho text-sm mt-4">Sair</button>
      </div>
    </div>
  );
}

export default AdminPainel;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';

function Header() {
  const { itens } = useCarrinho();
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const token = localStorage.getItem('token');
  const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);

  function buscar(e) {
    e.preventDefault();
    const nome = termoBusca.trim();
    if (!nome) return;
    navigate(`/busca?nome=${encodeURIComponent(nome)}`);
  }

  function sair() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <header className="bg-roxo text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg text-amarelo">
        Multiverso Colecionáveis
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <form onSubmit={buscar} role="search" className="flex items-center">
          <input
            type="search"
            aria-label="Buscar produtos por nome"
            placeholder="Buscar produtos"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-32 sm:w-44 rounded-l border border-white px-2 py-1 text-chumbo"
          />
          <button type="submit" className="rounded-r bg-amarelo px-3 py-1 text-roxo">
            Buscar
          </button>
        </form>
        <Link to="/carrinho">Carrinho {totalItens > 0 && `(${totalItens})`}</Link>

        {token ? (
          <>
            <Link to="/meus-pedidos">Meus Pedidos</Link>
            <button onClick={sair} className="text-amarelo">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/cadastro">Cadastre-se</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;

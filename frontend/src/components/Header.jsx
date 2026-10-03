import { Link, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';

function Header() {
  const { itens } = useCarrinho();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);

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
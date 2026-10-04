import { useLocation, Link } from 'react-router-dom';

function Confirmacao() {
  const { state } = useLocation();

  if (!state?.pedidoId) {
    return <p className="p-8">Nenhum pedido recente. <Link to="/" className="text-roxo underline">Voltar</Link></p>;
  }

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-roxo text-2xl font-bold mb-2">Pedido confirmado!</h1>
      <p className="text-gray-600 mb-6">Número do pedido: #{state.pedidoId}</p>
      <Link to="/" className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg inline-block">
        Voltar à loja
      </Link>
    </div>
  );
}

export default Confirmacao;
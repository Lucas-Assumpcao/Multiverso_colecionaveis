import { useSearchParams, Link } from 'react-router-dom';

function Confirmacao() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('external_reference');
  const status = searchParams.get('status');

  if (!pedidoId) {
    return <p className="p-8">Nenhum pedido recente. <Link to="/" className="text-roxo underline">Voltar</Link></p>;
  }

  const titulo = status === 'approved'
    ? 'Pagamento aprovado!'
    : status === 'rejected' || status === 'failure'
      ? 'Pagamento não aprovado'
      : 'Pedido registrado, aguardando confirmação do pagamento';

  return (
    <div className="p-8 max-w-md mx-auto text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-roxo text-2xl font-bold mb-2">{titulo}</h1>
      <p className="text-gray-600 mb-6">Pedido #{pedidoId}</p>
      <Link to="/meus-pedidos" className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg inline-block">
        Ver meus pedidos
      </Link>
    </div>
  );
}

export default Confirmacao;

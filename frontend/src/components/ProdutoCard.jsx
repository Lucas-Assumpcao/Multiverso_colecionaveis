import { Link } from 'react-router-dom';

function ProdutoCard({ produto }) {
  return (
    <Link to={`/produtos/${produto.id}`} className="border border-gray-300 rounded-lg p-4 block hover:shadow-md">
      <h2 className="text-lg font-bold">{produto.nome}</h2>
      <p className="text-gray-600">{produto.descricao}</p>
      <p className="text-xl font-bold">R$ {Number(produto.preco).toFixed(2)}</p>
    </Link>
  );
}

export default ProdutoCard;
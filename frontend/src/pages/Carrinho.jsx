import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';

function Carrinho() {
  const { itens, remover, atualizarQuantidade, total } = useCarrinho();

  if (itens.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
        <Link to="/" className="text-roxo underline">Voltar às categorias</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Carrinho</h1>

      <div className="flex flex-col gap-4">
        {itens.map((item) => (
          <div key={item.produto_id} className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-bold">{item.nome}</p>
              <p className="text-sm text-gray-500">R$ {item.preco.toFixed(2)} cada</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number" min="1" value={item.quantidade}
                onChange={(e) => atualizarQuantidade(item.produto_id, Number(e.target.value))}
                className="w-16 border rounded p-1 text-center"
              />
              <button onClick={() => remover(item.produto_id)} className="text-vermelho text-sm">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
        <Link to="/endereco" className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg">
          Fechar pedido
        </Link>
      </div>
    </div>
  );
}

export default Carrinho;
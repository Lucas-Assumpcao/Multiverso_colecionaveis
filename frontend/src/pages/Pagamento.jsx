import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';
import { criar } from '../services/pedidoService';
import { criarPagamento } from '../services/pedidoService';

function Pagamento() {
  const { state } = useLocation();
  const { itens, total, limpar } = useCarrinho();
  const [metodo, setMetodo] = useState('pix');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  if (!state?.enderecoId) {
    return <p className="p-8">Endereço não informado. <a href="/endereco" className="text-roxo underline">Voltar</a></p>;
  }

 async function handleConfirmar() {
  setErro(null);
  setCarregando(true);
  try {
    const resultado = await criar({
      endereco_id: state.enderecoId,
      valor_frete: state.valorFrete,
      itens: itens.map((i) => ({ produto_id: i.produto_id, quantidade: i.quantidade })),
    });

    const pagamento = await criarPagamento(resultado.id);
    limpar();
    window.location.href = pagamento.init_point; // sai do React, vai pro checkout do Mercado Pago

  } catch (e) {
    setErro(e);
  } finally {
    setCarregando(false);
  }
}

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Pagamento</h1>

      <div className="border rounded-lg p-4 mb-4">
        {itens.map((i) => (
          <div key={i.produto_id} className="flex justify-between text-sm py-1">
            <span>{i.quantidade}x {i.nome}</span>
            <span>R$ {(i.preco * i.quantidade).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm py-1 text-gray-500">
          <span>Frete</span>
          <span>R$ {state.valorFrete.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold pt-2 border-t mt-2">
          <span>Total</span>
          <span>R$ {(total + state.valorFrete).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {['pix', 'cartao', 'boleto'].map((m) => (
          <label key={m} className="flex items-center gap-2">
            <input type="radio" name="metodo" value={m} checked={metodo === m}
              onChange={() => setMetodo(m)} />
            {m === 'pix' ? 'Pix' : m === 'cartao' ? 'Cartão' : 'Boleto'}
          </label>
        ))}
      </div>

      {erro && <p className="text-vermelho text-sm mb-2">{erro.message}</p>}
      <button
        onClick={handleConfirmar}
        disabled={carregando}
        className="bg-amarelo text-roxo font-bold py-3 rounded-lg w-full disabled:opacity-50"
      >
        {carregando ? 'Processando...' : 'Confirmar pedido'}
      </button>
    </div>
  );
}

export default Pagamento;
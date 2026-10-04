import { useState, useEffect } from 'react';
import { listarPedidos, atualizarStatusPedido } from '../services/adminService';

const statusOpcoes = ['aguardando_pagamento', 'pago', 'enviado', 'entregue', 'cancelado'];

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarPedidos()
      .then(setPedidos)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }, []);

  function recarregar() {
    setCarregando(true);
    setErro(null);
    listarPedidos()
      .then(setPedidos)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }

  async function handleStatus(id, status) {
    try {
      await atualizarStatusPedido(id, status);
      recarregar();
    } catch (e) {
      alert(e.message);
    }
  }

  if (carregando) return <p className="p-8">Carregando...</p>;
  if (erro) return <p className="p-8">Erro: {erro.message}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Pedidos</h1>
      <div className="flex flex-col gap-2">
        {pedidos.map((p) => (
          <div key={p.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-bold">Pedido #{p.id} — {p.cliente_nome}</p>
              <p className="text-sm text-gray-500">
                R$ {Number(p.valor_total).toFixed(2)} · {new Date(p.data_pedido).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <select
              value={p.status}
              onChange={(e) => handleStatus(p.id, e.target.value)}
              className="border rounded-lg p-2 text-sm"
            >
              {statusOpcoes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPedidos;
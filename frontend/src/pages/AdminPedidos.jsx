import { useState, useEffect } from 'react';
import { listarPedidos, atualizarStatusPedido } from '../services/adminService';
import Container from '../components/ui/Container';

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

  if (carregando) return <Container className="py-6 sm:py-10">Carregando...</Container>;
  if (erro) return <Container className="py-6 sm:py-10">Erro: {erro.message}</Container>;

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
      <h1 className="text-roxo text-3xl font-bold mb-6">Pedidos</h1>
      <div className="flex flex-col gap-2">
        {pedidos.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 rounded-card border border-borda p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">Pedido #{p.id} — {p.cliente_nome}</p>
              <p className="text-sm text-gray-500">
                R$ {Number(p.valor_total).toFixed(2)} · {new Date(p.data_pedido).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <select
              value={p.status}
              onChange={(e) => handleStatus(p.id, e.target.value)}
              className="w-full rounded-lg border border-borda p-2 text-sm sm:w-auto"
            >
              {statusOpcoes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
      </div>
    </Container>
  );
}

export default AdminPedidos;
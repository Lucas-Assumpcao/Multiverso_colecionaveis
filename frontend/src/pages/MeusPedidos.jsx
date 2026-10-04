import { useState, useEffect } from 'react';
import { listar } from '../services/pedidoService';

const statusLabel = {
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listar()
      .then(setPedidos)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="p-8">Carregando pedidos...</p>;
  if (erro) return <p className="p-8">Erro: {erro.message}</p>;
  if (pedidos.length === 0) return <p className="p-8">Você ainda não fez nenhum pedido.</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Meus Pedidos</h1>
      <div className="flex flex-col gap-3">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-bold">Pedido #{pedido.id}</p>
              <p className="text-sm text-gray-500">
                {new Date(pedido.data_pedido).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">R$ {Number(pedido.valor_total).toFixed(2)}</p>
              <p className="text-sm text-gray-500">{statusLabel[pedido.status]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MeusPedidos;
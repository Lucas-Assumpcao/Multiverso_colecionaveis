import { useState, useEffect } from 'react';
import { listar } from '../services/pedidoService';
import Container from '../components/ui/Container';

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

  if (carregando) return <Container className="py-6 sm:py-10">Carregando pedidos...</Container>;
  if (erro) return <Container className="py-6 sm:py-10">Erro: {erro.message}</Container>;
  if (pedidos.length === 0) return <Container className="py-6 sm:py-10">Você ainda não fez nenhum pedido.</Container>;

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
      <h1 className="text-roxo text-3xl font-bold mb-6">Meus Pedidos</h1>
      <div className="flex flex-col gap-3">
        {pedidos.map((pedido) => (
          <div key={pedido.id} className="flex flex-col gap-3 rounded-card border border-borda p-4 sm:flex-row sm:items-center sm:justify-between">
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
    </Container>
  );
}

export default MeusPedidos;
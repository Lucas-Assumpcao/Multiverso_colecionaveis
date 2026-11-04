import { useEffect, useMemo, useState } from 'react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Field from '../components/ui/Field';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import usePageTitle from '../hooks/usePageTitle';
import { atualizarStatusPedido, listarPedidos } from '../services/adminService';

const statusOpcoes = [
  { value: 'aguardando_pagamento', label: 'Aguardando pagamento', variant: 'warning' },
  { value: 'pago', label: 'Pago', variant: 'success' },
  { value: 'enviado', label: 'Enviado', variant: 'neutral' },
  { value: 'entregue', label: 'Entregue', variant: 'success' },
  { value: 'cancelado', label: 'Cancelado', variant: 'danger' },
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(valor) {
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? 'Data indisponível'
    : data.toLocaleDateString('pt-BR');
}

function EsqueletoPedidos() {
  return (
    <div aria-label="Carregando pedidos" aria-busy="true">
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} aria-hidden="true" className="rounded-card border border-borda bg-white p-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="mt-3 h-4 w-2/3" />
            <Skeleton className="mt-4 h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-card border border-borda bg-white md:block">
        <table className="w-full">
          <caption className="sr-only">Carregando tabela de pedidos</caption>
          <thead className="bg-lilas/40">
            <tr>{Array.from({ length: 5 }, (_, i) => <th key={i}><Skeleton className="m-3 h-4 w-20" /></th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }, (_, row) => (
              <tr key={row}>{Array.from({ length: 5 }, (_, col) => <td key={col}><Skeleton className="m-3 h-5 w-24" /></td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [busca, setBusca] = useState('');
  const [atualizando, setAtualizando] = useState({});
  const [anuncio, setAnuncio] = useState('');
  const toast = useToast();
  usePageTitle('Admin — Pedidos');

  useEffect(() => {
    let ativo = true;
    listarPedidos()
      .then((lista) => {
        if (ativo) setPedidos(lista);
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => { ativo = false; };
  }, []);

  async function recarregar() {
    setCarregando(true);
    setErro(null);
    try {
      setPedidos(await listarPedidos());
    } catch (erroCarregamento) {
      setErro(erroCarregamento);
    } finally {
      setCarregando(false);
    }
  }

  async function alterarStatus(pedido, novoStatus) {
    if (pedido.status === novoStatus || atualizando[pedido.id]) return;
    const statusAnterior = pedido.status;
    const rotulo = statusOpcoes.find((item) => item.value === novoStatus)?.label || novoStatus;
    setAtualizando((atual) => ({ ...atual, [pedido.id]: true }));
    setPedidos((atuais) => atuais.map((item) => (
      item.id === pedido.id ? { ...item, status: novoStatus } : item
    )));
    setAnuncio(`Pedido ${pedido.id}: status alterado para ${rotulo}.`);
    try {
      await atualizarStatusPedido(pedido.id, novoStatus);
      toast.success(`Pedido #${pedido.id}: status atualizado para ${rotulo}.`);
    } catch (erroAtualizacao) {
      setPedidos((atuais) => atuais.map((item) => (
        item.id === pedido.id ? { ...item, status: statusAnterior } : item
      )));
      setAnuncio(`Falha ao atualizar pedido ${pedido.id}. Status anterior restaurado.`);
      toast.error(erroAtualizacao.message || 'Não foi possível atualizar o status do pedido.');
    } finally {
      setAtualizando((atual) => ({ ...atual, [pedido.id]: false }));
    }
  }

  const contagens = useMemo(() => statusOpcoes.reduce((resultado, status) => ({
    ...resultado,
    [status.value]: pedidos.filter((pedido) => pedido.status === status.value).length,
  }), { todos: pedidos.length }), [pedidos]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return [...pedidos]
      .filter((pedido) => filtroStatus === 'todos' || pedido.status === filtroStatus)
      .filter((pedido) => !termo
        || String(pedido.id).includes(termo)
        || (pedido.cliente_nome || '').toLocaleLowerCase('pt-BR').includes(termo))
      .sort((a, b) => new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime());
  }, [busca, filtroStatus, pedidos]);

  function campoStatus(pedido) {
    return (
      <Field
        as="select"
        id={`status-pedido-${pedido.id}`}
        label={`Status do pedido #${pedido.id}`}
        labelClassName="sr-only"
        className="min-w-52"
        inputClassName="py-2 text-sm"
        value={pedido.status}
        disabled={Boolean(atualizando[pedido.id])}
        onChange={(event) => alterarStatus(pedido, event.target.value)}
      >
        {statusOpcoes.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </Field>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mb-6">
        <p className="font-semibold uppercase tracking-widest text-roxo-claro">Operação</p>
        <h1 className="mt-2 text-3xl font-extrabold text-roxo">Pedidos</h1>
      </div>

      <div aria-live="polite" className="sr-only">{anuncio}</div>

      {!carregando && !erro && pedidos.length > 0 && (
        <div className="mb-5 flex gap-2 overflow-x-auto py-1" role="group" aria-label="Filtrar pedidos por status">
          <button
            type="button"
            aria-pressed={filtroStatus === 'todos'}
            onClick={() => setFiltroStatus('todos')}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
              filtroStatus === 'todos' ? 'border-roxo bg-roxo text-white' : 'border-borda bg-white text-roxo'
            }`}
          >
            Todos ({contagens.todos})
          </button>
          {statusOpcoes.map((status) => (
            <button
              type="button"
              key={status.value}
              aria-pressed={filtroStatus === status.value}
              onClick={() => setFiltroStatus(status.value)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                filtroStatus === status.value ? 'border-roxo bg-roxo text-white' : 'border-borda bg-white text-roxo'
              }`}
            >
              {status.label} ({contagens[status.value]})
            </button>
          ))}
        </div>
      )}

      {!carregando && !erro && pedidos.length > 0 && (
        <Field
          id="buscar-pedido-admin"
          label="Buscar por número do pedido ou cliente"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Número ou nome do cliente"
          className="mb-5 max-w-lg"
        />
      )}

      {carregando ? (
        <EsqueletoPedidos />
      ) : erro ? (
        <EmptyState
          title="Não foi possível carregar os pedidos"
          text={erro.message || 'Tente novamente em instantes.'}
          action={<Button onClick={recarregar}>Tentar de novo</Button>}
        />
      ) : filtrados.length === 0 ? (
        <EmptyState
          title={pedidos.length === 0 ? 'Nenhum pedido ainda' : 'Nenhum pedido encontrado'}
          text={pedidos.length === 0
            ? 'Os pedidos dos clientes aparecerão nesta lista.'
            : 'Altere os filtros ou a busca para ver outros pedidos.'}
        />
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filtrados.map((pedido) => {
              const status = statusOpcoes.find((item) => item.value === pedido.status);
              return (
                <article key={pedido.id} className="rounded-card border border-borda bg-white p-4 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-roxo">Pedido #{pedido.id}</h2>
                      <p className="mt-1 text-sm text-suave">{pedido.cliente_nome || 'Cliente'}</p>
                      <p className="mt-1 text-sm text-suave">{formatarData(pedido.data_pedido)}</p>
                    </div>
                    <p className="font-bold text-chumbo">{formatarPreco(pedido.valor_total)}</p>
                  </div>
                  <div className="mt-3">
                    <Badge variant={status?.variant || 'neutral'}>{status?.label || pedido.status}</Badge>
                  </div>
                  <div className="mt-4">{campoStatus(pedido)}</div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-hidden rounded-card border border-borda bg-white shadow-card md:block">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Pedidos, clientes, totais e status atualizáveis</caption>
                <thead className="sticky top-0 z-10 bg-lilas/40 text-sm text-roxo">
                  <tr>
                    <th scope="col" className="px-4 py-3">Pedido</th>
                    <th scope="col" className="px-4 py-3">Cliente</th>
                    <th scope="col" className="px-4 py-3">Data</th>
                    <th scope="col" className="px-4 py-3">Total</th>
                    <th scope="col" className="px-4 py-3">Status atual</th>
                    <th scope="col" className="px-4 py-3">Alterar status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borda">
                  {filtrados.map((pedido) => {
                    const status = statusOpcoes.find((item) => item.value === pedido.status);
                    return (
                      <tr key={pedido.id}>
                        <th scope="row" className="px-4 py-3 font-semibold text-roxo">#{pedido.id}</th>
                        <td className="px-4 py-3">{pedido.cliente_nome || 'Cliente'}</td>
                        <td className="px-4 py-3 text-sm text-suave">{formatarData(pedido.data_pedido)}</td>
                        <td className="px-4 py-3 font-semibold">{formatarPreco(pedido.valor_total)}</td>
                        <td className="px-4 py-3"><Badge variant={status?.variant || 'neutral'}>{status?.label || pedido.status}</Badge></td>
                        <td className="px-4 py-3">{campoStatus(pedido)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default AdminPedidos;

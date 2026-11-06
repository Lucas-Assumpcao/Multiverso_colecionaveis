import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { listarTodos } from '../services/produtoService';
import { listarPedidos } from '../services/adminService';
import usePageTitle from '../hooks/usePageTitle';

const statusPedido = {
  aguardando_pagamento: { rotulo: 'Aguardando pagamento', variante: 'warning' },
  pago: { rotulo: 'Pago', variante: 'success' },
  enviado: { rotulo: 'Enviado', variante: 'neutral' },
  entregue: { rotulo: 'Entregue', variante: 'success' },
  cancelado: { rotulo: 'Cancelado', variante: 'danger' },
};

const statusOrdem = [
  'aguardando_pagamento',
  'pago',
  'enviado',
  'entregue',
  'cancelado',
];

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function SkeletonPainel() {
  return (
    <div aria-label="Carregando indicadores" aria-busy="true" className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="rounded-card border border-borda bg-white p-5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-4 h-8 w-1/3" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-card" />
        <Skeleton className="h-64 rounded-card" />
      </div>
    </div>
  );
}

function AdminPainel() {
  const [dados, setDados] = useState({ pedidos: [], produtos: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  usePageTitle('Admin — Painel');

  async function carregarDados() {
    const [pedidos, produtos] = await Promise.all([listarPedidos(), listarTodos()]);
    return { pedidos, produtos };
  }

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      setDados(await carregarDados());
    } catch (erroCarregamento) {
      setErro(erroCarregamento);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;
    carregarDados()
      .then((resultado) => {
        if (ativo) setDados(resultado);
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => { ativo = false; };
  }, []);

  const indicadores = useMemo(() => {
    const { pedidos, produtos } = dados;
    const porStatus = statusOrdem.reduce((contagem, status) => ({
      ...contagem,
      [status]: pedidos.filter((pedido) => pedido.status === status).length,
    }), {});
    const receita = pedidos
      .filter((pedido) => ['pago', 'enviado', 'entregue'].includes(pedido.status))
      .reduce((soma, pedido) => soma + Number(pedido.valor_total || 0), 0);

    return {
      totalPedidos: pedidos.length,
      aguardando: porStatus.aguardando_pagamento,
      receita,
      produtos: produtos.length,
      esgotados: produtos.filter((produto) => Number(produto.estoque) === 0).length,
      estoqueBaixo: produtos.filter((produto) => Number(produto.estoque) >= 1
        && Number(produto.estoque) <= 5).length,
      porStatus,
    };
  }, [dados]);

  if (carregando) {
    return (
      <Container className="py-6 sm:py-10">
        <h1 className="mb-6 text-3xl font-extrabold text-roxo">Painel administrativo</h1>
        <SkeletonPainel />
      </Container>
    );
  }

  if (erro) {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          headingLevel={1}
          title="Não foi possível carregar o painel"
          text={erro.message || 'Tente novamente em instantes.'}
          action={<Button onClick={carregar}>Tentar de novo</Button>}
        />
      </Container>
    );
  }

  const metricas = [
    { titulo: 'Total de pedidos', valor: indicadores.totalPedidos },
    { titulo: 'Aguardando pagamento', valor: indicadores.aguardando },
    { titulo: 'Receita confirmada', valor: formatarPreco(indicadores.receita) },
    { titulo: 'Produtos cadastrados', valor: indicadores.produtos },
    { titulo: 'Produtos esgotados', valor: indicadores.esgotados },
    { titulo: 'Estoque baixo', valor: indicadores.estoqueBaixo },
  ];
  const maiorContagem = Math.max(1, ...Object.values(indicadores.porStatus));
  const graficoDescricao = statusOrdem
    .map((status) => `${statusPedido[status].rotulo}: ${indicadores.porStatus[status]}`)
    .join('; ');
  const pedidosRecentes = dados.pedidos.slice(0, 5);
  const estoqueBaixo = dados.produtos
    .filter((produto) => Number(produto.estoque) >= 1 && Number(produto.estoque) <= 5)
    .sort((a, b) => Number(a.estoque) - Number(b.estoque))
    .slice(0, 5);

  return (
    <Container className="py-6 sm:py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold uppercase tracking-widest text-roxo-claro">Visão geral</p>
          <h1 className="mt-2 text-3xl font-extrabold text-roxo">Painel administrativo</h1>
        </div>
        <Link to="/" className="font-semibold text-roxo underline lg:hidden">Ver loja</Link>
      </div>

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricas.map((metrica) => (
          <article key={metrica.titulo} className="rounded-card border border-borda bg-white p-5 shadow-card">
            <h2 className="text-sm font-semibold text-suave">{metrica.titulo}</h2>
            <p className="mt-3 break-words text-2xl font-extrabold text-roxo">{metrica.valor}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-card border border-borda bg-white p-5 shadow-card">
          <h2 className="text-xl font-bold text-roxo">Pedidos por status</h2>
          <div
            role="img"
            aria-label={`Pedidos por status. ${graficoDescricao}.`}
            className="mt-5 space-y-4"
          >
            {statusOrdem.map((status) => {
              const quantidade = indicadores.porStatus[status];
              return (
                <div key={status} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_2rem] items-center gap-3">
                  <span className="text-sm text-chumbo">{statusPedido[status].rotulo}</span>
                  <div className="h-3 overflow-hidden rounded-full bg-lilas/50">
                    <div
                      className="h-full rounded-full bg-roxo"
                      style={{ width: `${(quantidade / maiorContagem) * 100}%` }}
                    />
                  </div>
                  <span className="text-right text-sm font-bold text-roxo">{quantidade}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-card border border-borda bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-roxo">Pedidos recentes</h2>
            <Link to="/admin/pedidos" className="shrink-0 text-sm font-semibold text-roxo underline">
              Ver pedidos
            </Link>
          </div>
          {pedidosRecentes.length === 0 ? (
            <p className="mt-5 text-sm text-suave">Ainda não há pedidos cadastrados.</p>
          ) : (
            <ul className="mt-4 divide-y divide-borda">
              {pedidosRecentes.map((pedido) => (
                <li key={pedido.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                  <div>
                    <p className="font-semibold text-roxo">Pedido #{pedido.id}</p>
                    <p className="text-sm text-suave">{pedido.cliente_nome || 'Cliente'}</p>
                  </div>
                  <Badge variant={statusPedido[pedido.status]?.variante || 'neutral'}>
                    {statusPedido[pedido.status]?.rotulo || pedido.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-card border border-borda bg-white p-5 shadow-card xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-roxo">Estoque baixo</h2>
            <Link to="/admin/produtos" className="shrink-0 text-sm font-semibold text-roxo underline">
              Gerenciar produtos
            </Link>
          </div>
          {estoqueBaixo.length === 0 ? (
            <p className="mt-5 text-sm text-suave">Nenhum produto com estoque entre 1 e 5 unidades.</p>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {estoqueBaixo.map((produto) => (
                <li key={produto.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F7FB] p-3">
                  <p className="min-w-0 truncate font-semibold text-chumbo">{produto.nome}</p>
                  <Link
                    to={`/admin/produtos/form?id=${produto.id}`}
                    className="shrink-0 text-sm font-semibold text-roxo underline"
                  >
                    {produto.estoque} un. · Editar
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}

export default AdminPainel;

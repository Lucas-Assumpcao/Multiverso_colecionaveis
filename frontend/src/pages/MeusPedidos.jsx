import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import { buscarPorId, criarPagamento, listar } from '../services/pedidoService';

const statusPedido = {
  aguardando_pagamento: { rotulo: 'Aguardando pagamento', variante: 'warning' },
  pago: { rotulo: 'Pago', variante: 'success' },
  enviado: { rotulo: 'Enviado', variante: 'neutral' },
  entregue: { rotulo: 'Entregue', variante: 'success' },
  cancelado: { rotulo: 'Cancelado', variante: 'danger' },
};

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(valor) {
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? 'Data indisponível'
    : data.toLocaleDateString('pt-BR');
}

function EsqueletoPedido() {
  return (
    <div aria-hidden="true" className="rounded-card border border-borda bg-white p-4 shadow-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2 sm:text-right">
          <Skeleton className="h-5 w-28 sm:ml-auto" />
          <Skeleton className="h-6 w-36 sm:ml-auto" />
        </div>
      </div>
    </div>
  );
}

function EsqueletoItens() {
  return (
    <ul aria-label="Carregando itens do pedido" className="mt-4 space-y-3" aria-busy="true">
      {Array.from({ length: 2 }, (_, index) => (
        <li key={index} aria-hidden="true" className="flex items-center gap-3">
          <Skeleton className="size-12 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}

function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [pedidoAberto, setPedidoAberto] = useState(null);
  const [detalhes, setDetalhes] = useState({});
  const [pagandoId, setPagandoId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    let ativo = true;
    listar()
      .then((resultado) => {
        if (ativo) setPedidos(resultado);
      })
      .catch((erroRequisicao) => {
        if (ativo) setErro(erroRequisicao);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => { ativo = false; };
  }, []);

  async function carregarDetalhes(pedidoId) {
    setDetalhes((atuais) => ({
      ...atuais,
      [pedidoId]: { estado: 'carregando', pedido: null, erro: null },
    }));
    try {
      const pedido = await buscarPorId(pedidoId);
      setDetalhes((atuais) => ({
        ...atuais,
        [pedidoId]: { estado: 'pronto', pedido, erro: null },
      }));
    } catch (erroRequisicao) {
      setDetalhes((atuais) => ({
        ...atuais,
        [pedidoId]: { estado: 'erro', pedido: null, erro: erroRequisicao },
      }));
    }
  }

  function alternarItens(pedidoId) {
    if (pedidoAberto === pedidoId) {
      setPedidoAberto(null);
      return;
    }
    setPedidoAberto(pedidoId);
    if (!detalhes[pedidoId] || detalhes[pedidoId].estado === 'erro') {
      carregarDetalhes(pedidoId);
    }
  }

  async function pagarAgora(pedidoId) {
    if (pagandoId !== null) return;
    setPagandoId(pedidoId);
    try {
      const pagamento = await criarPagamento(pedidoId);
      if (!pagamento.init_point) {
        throw new Error('Não foi possível iniciar o pagamento. Tente novamente.');
      }
      window.location.assign(pagamento.init_point);
    } catch (erroRequisicao) {
      toast.error(erroRequisicao.message || 'Não foi possível iniciar o pagamento.');
    } finally {
      setPagandoId(null);
    }
  }

  async function recarregarPedidos() {
    setCarregando(true);
    setErro(null);
    try {
      setPedidos(await listar());
    } catch (erroRequisicao) {
      setErro(erroRequisicao);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-extrabold text-roxo">Meus Pedidos</h1>

        {carregando ? (
          <div aria-label="Carregando seus pedidos" aria-busy="true" className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => <EsqueletoPedido key={index} />)}
          </div>
        ) : erro ? (
          <EmptyState
            title="Não foi possível carregar seus pedidos"
            text={erro.message || 'Tente novamente em instantes.'}
            action={<Button onClick={recarregarPedidos}>Tentar de novo</Button>}
          />
        ) : pedidos.length === 0 ? (
          <EmptyState
            title="Nenhum pedido ainda"
            text="Quando você fechar um pedido, poderá acompanhar tudo por aqui."
            action={<Button to="/">Voltar à loja</Button>}
          />
        ) : (
          <ul className="space-y-4">
            {pedidos.map((pedido) => {
              const status = statusPedido[pedido.status]
                || { rotulo: pedido.status, variante: 'neutral' };
              const aberto = pedidoAberto === pedido.id;
              const detalhe = detalhes[pedido.id];
              const painelId = `pedido-itens-${pedido.id}`;

              return (
                <li
                  key={pedido.id}
                  className="rounded-card border border-borda bg-white p-4 shadow-card sm:p-5"
                >
                  <article>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="font-bold text-roxo">Pedido #{pedido.id}</h2>
                        <p className="mt-1 text-sm text-suave">{formatarData(pedido.data_pedido)}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                        <p className="font-bold text-chumbo">{formatarPreco(pedido.valor_total)}</p>
                        <Badge variant={status.variante}>{status.rotulo}</Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 border-t border-borda pt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        aria-expanded={aberto}
                        aria-controls={painelId}
                        onClick={() => alternarItens(pedido.id)}
                      >
                        {aberto ? 'Ocultar itens' : 'Ver itens'}
                      </Button>
                      {pedido.status === 'aguardando_pagamento' && (
                        <Button
                          type="button"
                          size="sm"
                          loading={pagandoId === pedido.id}
                          loadingText="Abrindo pagamento..."
                          disabled={pagandoId !== null && pagandoId !== pedido.id}
                          onClick={() => pagarAgora(pedido.id)}
                        >
                          Pagar agora
                        </Button>
                      )}
                    </div>

                    <div id={painelId} hidden={!aberto} className="border-t border-borda">
                      {aberto && detalhe?.estado === 'carregando' && <EsqueletoItens />}
                      {aberto && detalhe?.estado === 'erro' && (
                        <div role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-vermelho-escuro">
                          <p>{detalhe.erro.message || 'Não foi possível carregar os itens.'}</p>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="mt-3"
                            onClick={() => carregarDetalhes(pedido.id)}
                          >
                            Tentar de novo
                          </Button>
                        </div>
                      )}
                      {aberto && detalhe?.estado === 'pronto' && (
                        <ul className="mt-4 divide-y divide-borda">
                          {(detalhe.pedido.itens || []).map((item, index) => {
                            const subtotal = Number(item.preco_unitario) * Number(item.quantidade);
                            return (
                              <li
                                key={`${item.produto_id || item.nome}-${index}`}
                                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0"
                              >
                                <div>
                                  <p className="font-semibold text-roxo">{item.nome}</p>
                                  <p className="text-sm text-suave">
                                    {item.quantidade} × {formatarPreco(item.preco_unitario)}
                                  </p>
                                </div>
                                <p className="font-semibold text-chumbo">{formatarPreco(subtotal)}</p>
                              </li>
                            );
                          })}
                          {detalhe.pedido.itens?.length === 0 && (
                            <li className="py-4 text-sm text-suave">Este pedido não possui itens disponíveis.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}

        <Link to="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-roxo underline">
          Voltar à loja
        </Link>
      </div>
    </Container>
  );
}

export default MeusPedidos;

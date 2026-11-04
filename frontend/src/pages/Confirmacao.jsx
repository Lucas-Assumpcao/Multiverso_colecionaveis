import { AlertCircle, CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CheckoutEtapas from '../components/CheckoutEtapas';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import { useToast } from '../hooks/useToast';
import { criarPagamento } from '../services/pedidoService';

function Confirmacao() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get('external_reference');
  const status = searchParams.get('status');
  const [carregando, setCarregando] = useState(false);
  const toast = useToast();
  const temToken = Boolean(localStorage.getItem('token'));

  if (!pedidoId || !temToken) {
    const destinoPedidos = temToken
      ? '/meus-pedidos'
      : '/login';
    const estadoLogin = temToken ? undefined : { from: '/meus-pedidos' };

    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title={!temToken ? 'Entre na sua conta para consultar seus pedidos' : 'Não encontramos o pedido'}
          text={!pedidoId
            ? 'Não recebemos a referência do pedido. Consulte seus pedidos ou volte à loja.'
            : 'Entre na sua conta para acompanhar a confirmação do pagamento.'}
          action={(
            <div className="flex flex-wrap justify-center gap-3">
              <Button to={destinoPedidos} state={estadoLogin} variant="secondary">
                Ver meus pedidos
              </Button>
              <Button to="/">Voltar à loja</Button>
            </div>
          )}
        />
      </Container>
    );
  }

  const aprovado = status === 'approved';
  const pendente = status === 'pending';
  const permiteTentarNovamente = pendente || status === 'rejected';
  const titulo = aprovado
    ? 'Pagamento aprovado!'
    : pendente
      ? 'Pagamento aguardando confirmação'
      : 'Pagamento não concluído';

  async function pagarNovamente() {
    if (carregando) return;
    setCarregando(true);
    try {
      const pagamento = await criarPagamento(pedidoId);
      if (!pagamento.init_point) {
        throw new Error('Não foi possível iniciar o pagamento novamente.');
      }
      window.location.assign(pagamento.init_point);
    } catch (erro) {
      toast.error(erro.message || 'Não foi possível iniciar o pagamento novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-xl rounded-card border border-borda bg-white p-6 text-center shadow-card sm:p-8">
        <CheckoutEtapas atual={4} />
        {aprovado
          ? <CircleCheck aria-hidden="true" className="mx-auto mb-4 size-14 text-emerald-600" />
          : <AlertCircle aria-hidden="true" className="mx-auto mb-4 size-14 text-roxo-claro" />}
        <h1 className="text-2xl font-extrabold text-roxo">{titulo}</h1>
        <p className="mt-3 font-semibold text-chumbo">Pedido #{pedidoId}</p>
        {pendente && (
          <p className="mt-4 text-suave">
            O Mercado Pago ainda está confirmando. O status do pedido é atualizado quando a confirmação chegar.
          </p>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {permiteTentarNovamente && (
            <Button
              onClick={pagarNovamente}
              loading={carregando}
              loadingText="Abrindo pagamento..."
            >
              Pagar novamente
            </Button>
          )}
          <Button to="/meus-pedidos" variant="secondary">Ver meus pedidos</Button>
          <Button to="/" variant={permiteTentarNovamente ? 'ghost' : 'primary'}>
            Voltar à loja
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default Confirmacao;

import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CheckoutEtapas from '../components/CheckoutEtapas';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import { FRETE_FIXO } from '../config';
import { useCarrinho } from '../context/useCarrinho';
import useCheckoutGuard from '../hooks/useCheckoutGuard';
import { invalidarProdutos } from '../hooks/useProdutos';
import { useToast } from '../hooks/useToast';
import { criar, criarPagamento } from '../services/pedidoService';

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Pagamento() {
  const { state } = useLocation();
  const { itens, total, limpar } = useCarrinho();
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const permitido = useCheckoutGuard({
    exigeCarrinho: true,
    enderecoId: state?.enderecoId,
  });
  const toast = useToast();

  if (!permitido) return null;

  const endereco = state?.endereco;
  const enderecoLinha1 = endereco
    ? `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` — ${endereco.complemento}` : ''}`
    : 'Endereço confirmado';
  const enderecoLinha2 = endereco
    ? `${endereco.bairro}, ${endereco.cidade} — ${endereco.estado}, ${endereco.cep}`
    : `Endereço #${state.enderecoId}`;

  async function handleConfirmar() {
    if (carregando) return;
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await criar({
        endereco_id: state.enderecoId,
        itens: itens.map((item) => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
        })),
      });
      invalidarProdutos();

      const pagamento = await criarPagamento(resultado.id);
      if (!pagamento.init_point) {
        throw new Error('Não foi possível iniciar o pagamento. Tente novamente.');
      }
      limpar();
      window.location.assign(pagamento.init_point);
    } catch (erroRequisicao) {
      setErro(erroRequisicao);
      if (erroRequisicao.status !== 409) {
        toast.error(erroRequisicao.message || 'Não foi possível iniciar o pagamento.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <CheckoutEtapas atual={3} />
        <h1 className="mb-6 text-3xl font-extrabold text-roxo">Revise seu pedido</h1>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section aria-labelledby="resumo-itens" className="space-y-4">
            <div className="rounded-card border border-borda bg-white p-5 shadow-card">
              <h2 id="resumo-itens" className="mb-4 text-xl font-bold text-roxo">
                Itens da coleção
              </h2>
              <ul className="divide-y divide-borda">
                {itens.map((item) => (
                  <li key={item.produto_id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    {item.imagem_url
                      ? (
                        <img
                          src={item.imagem_url}
                          alt=""
                          width={64}
                          height={64}
                          decoding="async"
                          className="size-16 shrink-0 rounded-lg bg-lilas/30 object-contain p-1"
                        />
                      )
                      : (
                        <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-lilas/30">
                          <ImageOff aria-hidden="true" className="size-6 text-roxo-claro" />
                        </div>
                      )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-roxo">{item.nome}</p>
                      <p className="text-sm text-suave">{item.quantidade} × {formatarPreco(item.preco)}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-chumbo">
                      {formatarPreco(item.preco * item.quantidade)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-card border border-borda bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-roxo">Endereço de entrega</h2>
                <Link to="/endereco" className="shrink-0 font-semibold text-roxo underline">
                  Alterar
                </Link>
              </div>
              <p className="mt-3 font-semibold text-chumbo">{enderecoLinha1}</p>
              <p className="mt-1 text-sm text-suave">{enderecoLinha2}</p>
            </div>
          </section>

          <aside className="h-fit rounded-card border border-borda bg-white p-5 shadow-card lg:sticky lg:top-32">
            <h2 className="text-xl font-bold text-roxo">Resumo do pedido</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-suave">Subtotal</span>
                <span className="font-semibold">{formatarPreco(total)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-suave">Frete</span>
                <span className="font-semibold">{formatarPreco(FRETE_FIXO)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-borda pt-3 text-base font-bold text-roxo">
                <span>Total</span>
                <span>{formatarPreco(total + FRETE_FIXO)}</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-suave">
              Você será levado ao Mercado Pago (ambiente de testes). Lá você escolhe Pix, cartão ou boleto.
            </p>

            {erro && (
              <div
                role="alert"
                className="mt-4 rounded-lg border border-vermelho-escuro/30 bg-red-50 p-3 text-sm text-vermelho-escuro"
              >
                <p>{erro.message || 'Não foi possível iniciar o pagamento.'}</p>
                {erro.status === 409 && (
                  <Link to="/carrinho" className="mt-2 inline-block font-bold underline">
                    Ajustar carrinho
                  </Link>
                )}
              </div>
            )}

            <Button
              onClick={handleConfirmar}
              loading={carregando}
              loadingText="Processando..."
              size="lg"
              className="mt-5 w-full"
            >
              Ir para o pagamento
            </Button>
            <Link to="/carrinho" className="mt-4 block text-center text-sm font-semibold text-roxo underline">
              Voltar ao carrinho
            </Link>
          </aside>
        </div>
      </div>
    </Container>
  );
}

export default Pagamento;

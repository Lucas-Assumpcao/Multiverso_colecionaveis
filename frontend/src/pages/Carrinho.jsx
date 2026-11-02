import { useState } from 'react';
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import { FRETE_FIXO } from '../config';
import { useCarrinho } from '../context/useCarrinho';
import { useToast } from '../hooks/useToast';

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function Carrinho() {
  const { itens, remover, atualizarQuantidade, limpar, total } = useCarrinho();
  const navigate = useNavigate();
  const toast = useToast();
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const temToken = Boolean(localStorage.getItem('token'));

  function fecharPedido() {
    if (!temToken) {
      toast.info('Entre na sua conta para fechar o pedido.');
      navigate('/login', { state: { from: '/endereco' } });
      return;
    }
    navigate('/endereco');
  }

  function mudarQuantidade(item, delta) {
    const resultado = atualizarQuantidade(item.produto_id, item.quantidade + delta);
    if (!resultado.ok && delta > 0) {
      toast.info('Você já separou todo o estoque disponível desse item.');
    }
  }

  if (itens.length === 0) {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title="Sua coleção ainda está vazia"
          text="Encontre seus próximos colecionáveis favoritos e comece a montar sua coleção."
          action={<Button to="/">Explorar a loja</Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-semibold uppercase tracking-widest text-roxo-claro">Sua seleção</p>
          <h1 className="mt-2 text-3xl font-extrabold text-roxo">Carrinho</h1>
        </div>
        <Button variant="ghost" onClick={() => setConfirmacaoAberta(true)}>
          Limpar carrinho
        </Button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-label="Itens do carrinho" className="space-y-4">
          {itens.map((item) => {
            const estoqueConhecido = item.estoque !== null && item.estoque !== undefined;
            const atingiuEstoque = estoqueConhecido && item.quantidade >= Number(item.estoque);

            return (
              <article
                key={item.produto_id}
                className="grid gap-4 rounded-card border border-borda bg-white p-4 shadow-card sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:items-center"
              >
                <Link
                  to={`/produtos/${item.produto_id}`}
                  aria-label={`Ver ${item.nome}`}
                  className="flex size-24 items-center justify-center rounded-xl bg-lilas/30 sm:size-24"
                >
                  {item.imagem_url
                    ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="size-full rounded-xl object-contain p-2"
                      />
                    )
                    : <ImageOff aria-hidden="true" className="size-8 text-roxo-claro" />}
                </Link>

                <div className="min-w-0">
                  <Link
                    to={`/produtos/${item.produto_id}`}
                    className="font-bold text-roxo hover:underline"
                  >
                    {item.nome}
                  </Link>
                  <p className="mt-1 text-sm text-suave">
                    {formatarPreco(item.preco)} cada
                  </p>
                  <p className="mt-2 font-semibold text-chumbo">
                    Subtotal: {formatarPreco(item.preco * item.quantidade)}
                  </p>
                  {atingiuEstoque && (
                    <p className="mt-2">
                      <Badge variant="warning">Restam {item.estoque} — limite da seleção</Badge>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="inline-flex items-center rounded-lg border border-borda">
                    <button
                      type="button"
                      aria-label={`Diminuir quantidade de ${item.nome}`}
                      disabled={item.quantidade <= 1}
                      onClick={() => mudarQuantidade(item, -1)}
                      className="rounded-l-lg p-2 text-roxo hover:bg-lilas/30 disabled:opacity-40"
                    >
                      <Minus aria-hidden="true" className="size-4" />
                    </button>
                    <output
                      aria-live="polite"
                      aria-label={`Quantidade de ${item.nome}: ${item.quantidade}`}
                      className="min-w-9 text-center text-sm font-semibold"
                    >
                      {item.quantidade}
                    </output>
                    <button
                      type="button"
                      aria-label={`Aumentar quantidade de ${item.nome}`}
                      disabled={atingiuEstoque}
                      onClick={() => mudarQuantidade(item, 1)}
                      className="rounded-r-lg p-2 text-roxo hover:bg-lilas/30 disabled:opacity-40"
                    >
                      <Plus aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remover ${item.nome} do carrinho`}
                    onClick={() => remover(item.produto_id)}
                    className="rounded-lg p-2 text-vermelho-escuro transition-colors hover:bg-red-50"
                  >
                    <Trash2 aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </article>
            );
          })}
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
          <Button onClick={fecharPedido} size="lg" className="mt-6 w-full">
            Fechar pedido
          </Button>
          <Link to="/" className="mt-4 block text-center text-sm font-semibold text-roxo underline">
            Continuar comprando
          </Link>
          <p className="mt-5 text-center text-sm text-suave">
            Pix, cartão ou boleto: você escolhe no Mercado Pago.
          </p>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmacaoAberta}
        onCancel={() => setConfirmacaoAberta(false)}
        onConfirm={() => {
          limpar();
          setConfirmacaoAberta(false);
        }}
        title="Limpar carrinho?"
        description="Todos os itens serão removidos da sua seleção. Esta ação não pode ser desfeita."
        confirmLabel="Limpar carrinho"
        variant="danger"
      />
    </Container>
  );
}

export default Carrinho;

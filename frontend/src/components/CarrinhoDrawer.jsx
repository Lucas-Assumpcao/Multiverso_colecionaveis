import { useEffect, useRef } from 'react';
import { ImageOff, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { FRETE_FIXO } from '../config';
import { useCarrinho } from '../context/useCarrinho';
import { useCarrinhoDrawer } from '../hooks/useCarrinhoDrawer';
import { useToast } from '../hooks/useToast';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';

const MENSAGEM_LIMITE = 'Você já separou todo o estoque disponível desse item.';

function CarrinhoDrawer() {
  const { aberto, fechar, elementoAcionador } = useCarrinhoDrawer();
  const { itens, total, remover, atualizarQuantidade } = useCarrinho();
  const toast = useToast();
  const painelRef = useRef(null);

  useEffect(() => {
    if (!aberto) {
      if (elementoAcionador.current?.isConnected) {
        elementoAcionador.current.focus();
      }
      return undefined;
    }

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    painelRef.current?.focus();

    function lidarComTeclado(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        fechar();
        return;
      }

      if (event.key !== 'Tab' || !painelRef.current) return;
      const focaveis = painelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focaveis.length === 0) {
        event.preventDefault();
        painelRef.current.focus();
        return;
      }

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (event.shiftKey && (
        document.activeElement === primeiro
        || document.activeElement === painelRef.current
      )) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && (
        document.activeElement === ultimo
        || document.activeElement === painelRef.current
      )) {
        event.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener('keydown', lidarComTeclado);
    return () => {
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener('keydown', lidarComTeclado);
    };
  }, [aberto, elementoAcionador, fechar]);

  function mudarQuantidade(item, delta) {
    const resultado = atualizarQuantidade(item.produto_id, item.quantidade + delta);
    if (!resultado.ok && delta > 0) toast.info(MENSAGEM_LIMITE);
  }

  return (
    <div
      aria-hidden={!aberto}
      inert={!aberto}
      className={`fixed inset-0 z-[60] ${aberto ? '' : 'pointer-events-none'}`}
    >
      <button
        type="button"
        aria-label="Fechar carrinho"
        tabIndex={-1}
        onClick={fechar}
        className={`absolute inset-0 h-full w-full bg-black/50 transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-white text-chumbo shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-borda px-5 py-4">
          <div className="flex items-center gap-2 text-roxo">
            <ShoppingBag aria-hidden="true" className="size-5" />
            <h2 className="text-xl font-bold">Seu carrinho</h2>
          </div>
          <button
            type="button"
            aria-label="Fechar carrinho"
            onClick={fechar}
            className="rounded-full p-2 text-roxo transition-colors hover:bg-lilas/40"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        {itens.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-4">
            <EmptyState
              icon={ShoppingBag}
              title="Seu carrinho está vazio"
              text="Encontre seus próximos colecionáveis favoritos."
              action={<Button to="/" onClick={fechar}>Explorar a loja</Button>}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {itens.map((item) => (
                <article
                  key={item.produto_id}
                  className="flex gap-3 border-b border-borda pb-4"
                >
                  {item.imagem_url
                    ? (
                      <img
                        src={item.imagem_url}
                        alt=""
                        className="size-20 shrink-0 rounded-lg bg-lilas/30 object-contain p-1"
                      />
                    )
                    : (
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-lilas/30 text-roxo-claro">
                        <ImageOff aria-hidden="true" className="size-8" />
                      </div>
                    )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="break-words font-semibold text-roxo">{item.nome}</h3>
                      <button
                        type="button"
                        aria-label={`Remover ${item.nome} do carrinho`}
                        onClick={() => remover(item.produto_id)}
                        className="shrink-0 rounded p-1 text-vermelho-escuro transition-colors hover:bg-red-50"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-suave">R$ {item.preco.toFixed(2)} cada</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-lg border border-borda">
                        <button
                          type="button"
                          aria-label={`Diminuir quantidade de ${item.nome}`}
                          disabled={item.quantidade <= 1}
                          onClick={() => mudarQuantidade(item, -1)}
                          className="rounded-l-lg p-2 text-roxo transition-colors hover:bg-lilas/40 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus aria-hidden="true" className="size-4" />
                        </button>
                        <span
                          aria-label={`Quantidade: ${item.quantidade}`}
                          className="min-w-8 text-center text-sm font-semibold"
                        >
                          {item.quantidade}
                        </span>
                        <button
                          type="button"
                          aria-label={`Aumentar quantidade de ${item.nome}`}
                          onClick={() => mudarQuantidade(item, 1)}
                          className="rounded-r-lg p-2 text-roxo transition-colors hover:bg-lilas/40"
                        >
                          <Plus aria-hidden="true" className="size-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-roxo">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="space-y-4 border-t border-borda p-5">
              <div className="flex items-center justify-between text-lg font-bold text-roxo">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <p className="text-sm text-suave">
                Frete fixo de R$ {FRETE_FIXO.toFixed(2).replace('.', ',')}, somado no pagamento.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  to="/carrinho"
                  variant="secondary"
                  onClick={fechar}
                  className="w-full"
                >
                  Ver carrinho
                </Button>
                <Button to="/endereco" onClick={fechar} className="w-full">
                  Fechar pedido
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default CarrinhoDrawer;

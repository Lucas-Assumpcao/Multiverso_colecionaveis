import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { useCarrinho } from '../context/useCarrinho';
import Container from '../components/ui/Container';
import { useToast } from '../hooks/useToast';

function Carrinho() {
  const { itens, remover, atualizarQuantidade, total } = useCarrinho();
  const toast = useToast();

  function mudarQuantidade(produtoId, quantidade, estoque) {
    const resultado = atualizarQuantidade(produtoId, quantidade);
    if (!resultado.ok && estoque !== null && quantidade > estoque) {
      toast.info('Você já separou todo o estoque disponível desse item.');
    }
  }

  if (itens.length === 0) {
    return (
      <Container className="py-6 text-center sm:py-10">
        <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
        <Link to="/" className="text-roxo underline">Voltar às categorias</Link>
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
      <h1 className="text-roxo text-3xl font-bold mb-6">Carrinho</h1>

      <div className="flex flex-col gap-4">
        {itens.map((item) => (
          <div key={item.produto_id} className="flex flex-col gap-3 border-b border-borda pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {item.imagem_url
                ? (
                  <img
                    src={item.imagem_url}
                    alt=""
                    className="size-16 shrink-0 rounded-lg bg-lilas/30 object-contain p-1"
                  />
                )
                : (
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-lilas/30 text-roxo-claro">
                    <ImageOff aria-hidden="true" className="size-7" />
                  </div>
                )}
              <div className="min-w-0">
              <p className="font-bold">{item.nome}</p>
              <p className="text-sm text-gray-500">
                {Number(item.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} cada
              </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={item.estoque ?? undefined}
                value={item.quantidade}
                aria-label={`Quantidade de ${item.nome}`}
                onChange={(e) => mudarQuantidade(
                  item.produto_id,
                  Number(e.target.value),
                  item.estoque,
                )}
                className="w-16 border rounded p-1 text-center"
              />
              <button type="button" onClick={() => remover(item.produto_id)} className="text-vermelho text-sm">
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xl font-bold">
          Total: {Number(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <Link to="/endereco" className="bg-amarelo text-roxo font-bold px-6 py-3 rounded-lg">
          Fechar pedido
        </Link>
        </div>
      </div>
    </Container>
  );
}

export default Carrinho;
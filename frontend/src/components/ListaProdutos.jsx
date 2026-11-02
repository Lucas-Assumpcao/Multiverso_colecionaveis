import { useRef } from 'react';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { ProdutoCardSkeleton } from './ui/Skeleton';
import ProdutoCard from './ProdutoCard';

function ListaProdutos({
  produtos,
  carregando,
  erro,
  onTentarNovamente,
  vazioTitulo = 'Nenhum produto encontrado',
  vazioTexto,
  vazioAcao,
}) {
  const listaRef = useRef(null);
  const quantidade = produtos.length;

  if (erro) {
    return (
      <EmptyState
        title="Não foi possível carregar os produtos"
        text="Tente novamente em instantes."
        action={(
          <Button variant="secondary" onClick={onTentarNovamente}>
            Tentar de novo
          </Button>
        )}
      />
    );
  }

  if (carregando) {
    return (
      <div
        aria-busy="true"
        aria-label="Carregando produtos"
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      >
        {Array.from({ length: 8 }, (_, indice) => (
          <ProdutoCardSkeleton key={indice} />
        ))}
      </div>
    );
  }

  return (
    <section ref={listaRef} aria-label="Lista de produtos" className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className="text-sm font-semibold text-suave">
          {quantidade} {quantidade === 1 ? 'produto' : 'produtos'}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="ordem-produtos" className="text-sm font-medium text-chumbo">
            Ordenar por
          </label>
          <select
            id="ordem-produtos"
            className="min-h-10 rounded-lg border border-borda bg-white px-3 text-sm text-chumbo"
            defaultValue="padrao"
          >
            <option value="padrao">Padrão</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="nome">Nome A–Z</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm text-chumbo">
            <input type="checkbox" className="size-4 accent-roxo" />
            Só disponíveis
          </label>
        </div>
      </div>

      {quantidade === 0 ? (
        <EmptyState title={vazioTitulo} text={vazioTexto} action={vazioAcao} />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {produtos.map((produto, indice) => (
            <ProdutoCard key={produto.id} produto={produto} indice={indice} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ListaProdutos;

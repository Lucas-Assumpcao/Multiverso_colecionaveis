import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { ProdutoCardSkeleton } from './ui/Skeleton';
import ProdutoCard from './ProdutoCard';

function ListaProdutos({
  produtos,
  carregando,
  erro,
  onTentarNovamente,
  tituloRef,
  vazioTitulo = 'Nenhum produto encontrado',
  vazioTexto,
  vazioAcao,
}) {
  const listaRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const ordensValidas = ['padrao', 'menor-preco', 'maior-preco', 'nome'];
  const ordemSolicitada = searchParams.get('ordem');
  const ordem = ordensValidas.includes(ordemSolicitada) ? ordemSolicitada : 'padrao';
  const somenteDisponiveis = searchParams.get('disp') === '1';

  function atualizarParametro(chave, valor) {
    const parametros = new URLSearchParams(searchParams);
    if (valor) parametros.set(chave, valor);
    else parametros.delete(chave);
    parametros.delete('pagina');
    setSearchParams(parametros);
  }

  function irParaPagina(proximaPagina) {
    const parametros = new URLSearchParams(searchParams);
    if (proximaPagina === 1) parametros.delete('pagina');
    else parametros.set('pagina', String(proximaPagina));
    setSearchParams(parametros);
  }

  function paginasVisiveis() {
    if (paginaTotal <= 7) {
      return Array.from({ length: paginaTotal }, (_, indice) => indice + 1);
    }
    if (pagina <= 3) return [1, 2, 3, 4, '...', paginaTotal];
    if (pagina >= paginaTotal - 2) {
      return [1, '...', paginaTotal - 3, paginaTotal - 2, paginaTotal - 1, paginaTotal];
    }
    return [1, '...', pagina - 1, pagina, pagina + 1, '...', paginaTotal];
  }

  const filtrados = somenteDisponiveis
    ? produtos.filter((produto) => Number(produto.estoque) > 0)
    : produtos;
  const ordenados = [...filtrados];
  if (ordem === 'menor-preco') {
    ordenados.sort((a, b) => Number(a.preco) - Number(b.preco));
  } else if (ordem === 'maior-preco') {
    ordenados.sort((a, b) => Number(b.preco) - Number(a.preco));
  } else if (ordem === 'nome') {
    ordenados.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }));
  }
  const quantidade = ordenados.length;
  const paginaTotal = Math.ceil(quantidade / 12);
  const paginaSolicitada = Number(searchParams.get('pagina'));
  const paginaValida = Number.isInteger(paginaSolicitada) && paginaSolicitada > 0
    ? paginaSolicitada
    : 1;
  const pagina = paginaTotal > 0 ? Math.min(paginaValida, paginaTotal) : 1;
  const paginaAnteriorRef = useRef(pagina);
  const produtosPagina = ordenados.slice((pagina - 1) * 12, pagina * 12);

  useEffect(() => {
    if (paginaAnteriorRef.current === pagina) return;
    paginaAnteriorRef.current = pagina;
    tituloRef?.current?.focus({ preventScroll: true });
    listaRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [pagina, tituloRef]);

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
            value={ordem}
            onChange={(event) => atualizarParametro('ordem', event.target.value)}
          >
            <option value="padrao">Padrão</option>
            <option value="menor-preco">Menor preço</option>
            <option value="maior-preco">Maior preço</option>
            <option value="nome">Nome A–Z</option>
          </select>
          <label htmlFor="somente-disponiveis" className="inline-flex items-center gap-2 text-sm text-chumbo">
            <input
              id="somente-disponiveis"
              type="checkbox"
              checked={somenteDisponiveis}
              onChange={(event) => atualizarParametro('disp', event.target.checked ? '1' : '')}
              className="size-4 accent-roxo"
            />
            Só disponíveis
          </label>
        </div>
      </div>

      {quantidade === 0 ? (
        <EmptyState title={vazioTitulo} text={vazioTexto} action={vazioAcao} />
      ) : (
        <div
          key={`${ordem}-${somenteDisponiveis}-${pagina}`}
          className="animate-fade-up grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {produtosPagina.map((produto, indice) => (
            <ProdutoCard key={produto.id} produto={produto} indice={indice} />
          ))}
        </div>
      )}

      {paginaTotal > 1 && (
        <nav aria-label="Paginação" className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={pagina <= 1}
            onClick={() => irParaPagina(pagina - 1)}
          >
            Anterior
          </Button>
          {paginasVisiveis().map((numero, indice) => (
            numero === '...'
              ? <span key={`reticencias-${indice}`} aria-hidden="true" className="px-1 text-suave">…</span>
              : (
                <Button
                  key={numero}
                  variant={numero === pagina ? 'primary' : 'secondary'}
                  size="sm"
                  aria-label={`Página ${numero}`}
                  aria-current={numero === pagina ? 'page' : undefined}
                  onClick={() => irParaPagina(numero)}
                >
                  {numero}
                </Button>
              )
          ))}
          <Button
            variant="secondary"
            size="sm"
            disabled={pagina >= paginaTotal}
            onClick={() => irParaPagina(pagina + 1)}
          >
            Próxima
          </Button>
        </nav>
      )}
    </section>
  );
}

export default ListaProdutos;

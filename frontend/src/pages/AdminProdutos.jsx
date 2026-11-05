import { useEffect, useMemo, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Field from '../components/ui/Field';
import Skeleton from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';
import { invalidarCategorias, useCategorias } from '../hooks/useCategorias';
import { invalidarProdutos } from '../hooks/useProdutos';
import usePageTitle from '../hooks/usePageTitle';
import { removerProduto } from '../services/adminService';
import { listarTodos } from '../services/produtoService';

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function estoqueBadge(estoque) {
  const quantidade = Number(estoque);
  if (quantidade === 0) return { variant: 'neutral', label: 'Esgotado' };
  if (quantidade <= 5) return { variant: 'danger', label: `${quantidade} un.` };
  return { variant: 'success', label: `${quantidade} un.` };
}

function EsqueletoProdutos() {
  return (
    <div aria-label="Carregando produtos" aria-busy="true" className="space-y-3">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} aria-hidden="true" className="rounded-card border border-borda bg-white p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [ordem, setOrdem] = useState('nome');
  const [soEstoqueBaixo, setSoEstoqueBaixo] = useState(false);
  const [produtoRemocao, setProdutoRemocao] = useState(null);
  const [removendo, setRemovendo] = useState(false);
  const toast = useToast();
  const { categorias, erro: erroCategorias } = useCategorias();
  usePageTitle('Admin — Produtos');

  async function carregarProdutos() {
    const lista = await listarTodos();
    setProdutos(lista);
  }

  useEffect(() => {
    let ativo = true;
    listarTodos()
      .then((lista) => {
        if (ativo) setProdutos(lista);
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => { ativo = false; };
  }, []);

  async function tentarNovamente() {
    setCarregando(true);
    setErro(null);
    try {
      await carregarProdutos();
    } catch (erroCarregamento) {
      setErro(erroCarregamento);
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarRemocao() {
    if (!produtoRemocao || removendo) return;
    setRemovendo(true);
    try {
      await removerProduto(produtoRemocao.id);
      invalidarProdutos();
      setProdutos((atuais) => atuais.filter((produto) => produto.id !== produtoRemocao.id));
      toast.success('Produto removido.');
    } catch {
      toast.error('Não foi possível remover. Se o produto já aparece em pedidos, zere o estoque em vez de removê-lo.');
    } finally {
      setRemovendo(false);
      setProdutoRemocao(null);
    }
  }

  const categoriaPorId = useMemo(
    () => new Map(categorias.map((item) => [String(item.id), item.nome])),
    [categorias],
  );
  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    return produtos
      .filter((produto) => !termo || produto.nome.toLocaleLowerCase('pt-BR').includes(termo))
      .filter((produto) => !categoria || String(produto.categoria_id) === categoria)
      .filter((produto) => !soEstoqueBaixo
        || (Number(produto.estoque) >= 1 && Number(produto.estoque) <= 5))
      .sort((a, b) => {
        if (ordem === 'preco') return Number(a.preco) - Number(b.preco);
        if (ordem === 'estoque') return Number(a.estoque) - Number(b.estoque);
        return a.nome.localeCompare(b.nome, 'pt-BR');
      });
  }, [busca, categoria, ordem, produtos, soEstoqueBaixo]);

  return (
    <Container className="py-6 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-semibold uppercase tracking-widest text-roxo-claro">Catálogo</p>
          <h1 className="mt-2 text-3xl font-extrabold text-roxo">Produtos</h1>
        </div>
        <Button to="/admin/produtos/form">Novo produto</Button>
      </div>

      <section aria-label="Filtros de produtos" className="mb-6 grid gap-4 rounded-card border border-borda bg-white p-4 shadow-card md:grid-cols-2 xl:grid-cols-[minmax(14rem,1fr)_minmax(12rem,0.8fr)_minmax(10rem,0.7fr)_auto]">
        <Field
          id="buscar-produto-admin"
          label="Buscar por nome"
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Ex.: Goku"
        />
        <Field
          as="select"
          id="filtrar-categoria-admin"
          label="Categoria"
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
        </Field>
        <Field
          as="select"
          id="ordenar-produtos-admin"
          label="Ordenar por"
          value={ordem}
          onChange={(event) => setOrdem(event.target.value)}
        >
          <option value="nome">Nome A–Z</option>
          <option value="preco">Menor preço</option>
          <option value="estoque">Menor estoque</option>
        </Field>
        <label className="flex min-h-11 items-center gap-3 self-end rounded-lg border border-borda px-3 py-2 text-sm font-semibold text-chumbo">
          <input
            type="checkbox"
            checked={soEstoqueBaixo}
            onChange={(event) => setSoEstoqueBaixo(event.target.checked)}
            className="size-4 accent-roxo focus-visible:outline"
          />
          Só estoque baixo
        </label>
      </section>
      {erroCategorias && (
        <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-vermelho-escuro/30 bg-red-50 p-4 text-sm text-vermelho-escuro">
          <p>Não foi possível carregar as categorias do filtro.</p>
          <Button variant="secondary" size="sm" onClick={invalidarCategorias}>
            Tentar de novo
          </Button>
        </div>
      )}

      {carregando ? (
        <EsqueletoProdutos />
      ) : erro ? (
        <EmptyState
          title="Não foi possível carregar os produtos"
          text={erro.message || 'Tente novamente em instantes.'}
          action={<Button onClick={tentarNovamente}>Tentar de novo</Button>}
        />
      ) : filtrados.length === 0 ? (
        <EmptyState
          title={produtos.length ? 'Nenhum produto encontrado' : 'Ainda não há produtos'}
          text={produtos.length
            ? 'Ajuste os filtros para encontrar outros itens.'
            : 'Cadastre o primeiro produto para começar a montar o catálogo.'}
          action={produtos.length === 0
            ? <Button to="/admin/produtos/form">Cadastrar produto</Button>
            : undefined}
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-suave" aria-live="polite">
            {filtrados.length} {filtrados.length === 1 ? 'produto' : 'produtos'}
          </p>

          <div className="space-y-3 md:hidden">
            {filtrados.map((produto) => {
              const estoque = estoqueBadge(produto.estoque);
              return (
                <article key={produto.id} className="rounded-card border border-borda bg-white p-4 shadow-card">
                  <div className="flex gap-3">
                    {produto.imagem_url
                      ? <img src={produto.imagem_url} alt="" className="size-16 shrink-0 rounded-lg bg-lilas/30 object-contain p-1" />
                      : <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-lilas/30"><ImageOff aria-hidden="true" className="size-6 text-roxo-claro" /></div>}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-roxo">{produto.nome}</h2>
                      <p className="mt-1 text-sm text-suave">{categoriaPorId.get(String(produto.categoria_id)) || `Categoria ${produto.categoria_id}`}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-chumbo">{formatarPreco(produto.preco)}</span>
                        <Badge variant={estoque.variant}>{estoque.label}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-4 border-t border-borda pt-3">
                    <Link to={`/admin/produtos/form?id=${produto.id}`} className="inline-flex min-h-11 items-center font-semibold text-roxo underline">Editar</Link>
                    <button type="button" onClick={() => setProdutoRemocao(produto)} className="min-h-11 font-semibold text-vermelho-escuro underline">
                      Remover
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-hidden rounded-card border border-borda bg-white shadow-card md:block">
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Produtos cadastrados e ações disponíveis</caption>
                <thead className="sticky top-0 z-10 bg-lilas/40 text-sm text-roxo">
                  <tr>
                    <th scope="col" className="px-4 py-3">Produto</th>
                    <th scope="col" className="px-4 py-3">Categoria</th>
                    <th scope="col" className="px-4 py-3">Preço</th>
                    <th scope="col" className="px-4 py-3">Estoque</th>
                    <th scope="col" className="px-4 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-borda">
                  {filtrados.map((produto) => {
                    const estoque = estoqueBadge(produto.estoque);
                    return (
                      <tr key={produto.id} className="align-middle">
                        <th scope="row" className="px-4 py-3 font-semibold text-chumbo">
                          <div className="flex items-center gap-3">
                            {produto.imagem_url
                              ? <img src={produto.imagem_url} alt="" className="size-12 rounded-lg bg-lilas/30 object-contain p-1" />
                              : <div className="flex size-12 items-center justify-center rounded-lg bg-lilas/30"><ImageOff aria-hidden="true" className="size-5 text-roxo-claro" /></div>}
                            <span>{produto.nome}</span>
                          </div>
                        </th>
                        <td className="px-4 py-3 text-sm text-suave">
                          {categoriaPorId.get(String(produto.categoria_id)) || `Categoria ${produto.categoria_id}`}
                        </td>
                        <td className="px-4 py-3 text-sm">{formatarPreco(produto.preco)}</td>
                        <td className="px-4 py-3"><Badge variant={estoque.variant}>{estoque.label}</Badge></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <Link to={`/admin/produtos/form?id=${produto.id}`} className="inline-flex min-h-11 items-center font-semibold text-roxo underline">Editar</Link>
                            <button type="button" onClick={() => setProdutoRemocao(produto)} className="min-h-11 font-semibold text-vermelho-escuro underline">
                              Remover
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={Boolean(produtoRemocao)}
        onCancel={() => {
          if (!removendo) setProdutoRemocao(null);
        }}
        onConfirm={confirmarRemocao}
        title="Remover produto?"
        description={produtoRemocao
          ? `O produto “${produtoRemocao.nome}” será removido do catálogo. Se já aparece em pedidos, zere o estoque em vez de removê-lo.`
          : ''}
        confirmLabel={removendo ? 'Removendo...' : 'Remover'}
        variant="danger"
      />
    </Container>
  );
}

export default AdminProdutos;

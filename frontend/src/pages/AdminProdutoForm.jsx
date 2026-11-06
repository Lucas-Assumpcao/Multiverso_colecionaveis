import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import EmptyState from '../components/ui/EmptyState';
import Field from '../components/ui/Field';
import Skeleton from '../components/ui/Skeleton';
import { useCategorias, invalidarCategorias } from '../hooks/useCategorias';
import { invalidarProdutos } from '../hooks/useProdutos';
import { useToast } from '../hooks/useToast';
import usePageTitle from '../hooks/usePageTitle';
import { atualizarProduto, criarProduto } from '../services/adminService';
import { buscarPorId } from '../services/produtoService';

const formVazio = {
  categoria_id: '',
  nome: '',
  descricao: '',
  preco: '',
  estoque: '',
  imagem_url: '',
};

function validarCampo(campo, valor) {
  if (campo === 'nome' && !valor.trim()) return 'Informe o nome do produto.';
  if (campo === 'categoria_id' && !valor) return 'Selecione uma categoria.';
  if (campo === 'preco' && (!(Number(valor) > 0) || !Number.isFinite(Number(valor)))) {
    return 'O preço deve ser maior que zero.';
  }
  if (campo === 'estoque' && (!Number.isInteger(Number(valor)) || Number(valor) < 0 || valor === '')) {
    return 'O estoque deve ser um número inteiro igual ou maior que zero.';
  }
  return '';
}

function validarFormulario(form) {
  return ['nome', 'categoria_id', 'preco', 'estoque'].reduce((erros, campo) => {
    const erro = validarCampo(campo, form[campo]);
    if (erro) erros[campo] = erro;
    return erros;
  }, {});
}

function EsqueletoFormulario() {
  return (
    <div aria-label="Carregando produto" aria-busy="true" className="space-y-4">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className={`h-14 w-full ${index === 4 ? 'h-48' : ''}`} />
      ))}
    </div>
  );
}

function AdminProdutoForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const toast = useToast();
  const {
    categorias,
    carregando: carregandoCategorias,
    erro: erroCategorias,
  } = useCategorias();
  const [form, setForm] = useState(formVazio);
  const [carregandoProduto, setCarregandoProduto] = useState(Boolean(id));
  const [erroProduto, setErroProduto] = useState(null);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const refsCampos = useRef({});
  usePageTitle(id ? 'Admin — Editar produto' : 'Admin — Novo produto');

  useEffect(() => {
    if (!id) return undefined;
    let ativo = true;
    buscarPorId(id)
      .then((produto) => {
        if (!ativo) return;
        setForm({
          categoria_id: String(produto.categoria_id),
          nome: produto.nome || '',
          descricao: produto.descricao || '',
          preco: String(produto.preco ?? ''),
          estoque: String(produto.estoque ?? ''),
          imagem_url: produto.imagem_url || '',
        });
      })
      .catch((erroCarregamento) => {
        if (ativo) setErroProduto(erroCarregamento);
      })
      .finally(() => {
        if (ativo) setCarregandoProduto(false);
      });
    return () => { ativo = false; };
  }, [id]);

  async function recarregarProduto() {
    if (!id) return;
    setCarregandoProduto(true);
    setErroProduto(null);
    try {
      const produto = await buscarPorId(id);
      setForm({
        categoria_id: String(produto.categoria_id),
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        preco: String(produto.preco ?? ''),
        estoque: String(produto.estoque ?? ''),
        imagem_url: produto.imagem_url || '',
      });
    } catch (erroCarregamento) {
      setErroProduto(erroCarregamento);
    } finally {
      setCarregandoProduto(false);
    }
  }

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros((atuais) => ({ ...atuais, [campo]: '' }));
    setErroEnvio(null);
    if (campo === 'imagem_url') setImagemFalhou(false);
  }

  function validarAoSair(campo) {
    setErros((atuais) => ({ ...atuais, [campo]: validarCampo(campo, form[campo]) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (salvando) return;
    setEnviado(true);
    setErroEnvio(null);
    const novosErros = validarFormulario(form);
    setErros(novosErros);
    const primeiroInvalido = ['nome', 'categoria_id', 'preco', 'estoque']
      .find((campo) => novosErros[campo]);
    if (primeiroInvalido) {
      refsCampos.current[primeiroInvalido]?.focus();
      return;
    }

    setSalvando(true);
    try {
      const dados = {
        ...form,
        categoria_id: Number(form.categoria_id),
        nome: form.nome.trim(),
        descricao: form.descricao.trim(),
        preco: Number(form.preco),
        estoque: Number(form.estoque),
        imagem_url: form.imagem_url.trim(),
      };
      if (id) await atualizarProduto(id, dados);
      else await criarProduto(dados);
      invalidarProdutos();
      toast.success(id ? 'Produto atualizado com sucesso.' : 'Produto cadastrado com sucesso.');
      navigate('/admin/produtos');
    } catch (erroRequisicao) {
      setErroEnvio(erroRequisicao.message || 'Não foi possível salvar o produto.');
      toast.error(erroRequisicao.message || 'Não foi possível salvar o produto.');
    } finally {
      setSalvando(false);
    }
  }

  const errosVisiveis = enviado
    ? Object.entries(erros).filter(([, mensagem]) => mensagem)
    : [];

  if (id && carregandoProduto) {
    return (
      <Container className="py-6 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-extrabold text-roxo">
            Editar produto
          </h1>
          <EsqueletoFormulario />
        </div>
      </Container>
    );
  }

  if (id && erroProduto) {
    return (
      <Container className="py-6 sm:py-10">
        <EmptyState
          title="Não foi possível carregar o produto"
          text={erroProduto.message || 'Tente novamente em instantes.'}
          action={(
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={recarregarProduto}>Tentar de novo</Button>
              <Button to="/admin/produtos" variant="secondary">Voltar aos produtos</Button>
            </div>
          )}
        />
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-semibold uppercase tracking-widest text-roxo-claro">Catálogo</p>
            <h1 className="mt-2 text-3xl font-extrabold text-roxo">{id ? 'Editar produto' : 'Novo produto'}</h1>
          </div>
          <Button to="/admin/produtos" variant="ghost">Voltar à lista</Button>
        </div>

        {erroCategorias ? (
          <div className="rounded-card border border-borda bg-white p-5 text-center shadow-card">
            <p role="alert" className="text-vermelho-escuro">Não foi possível carregar as categorias.</p>
            <Button className="mt-4" onClick={invalidarCategorias}>Tentar de novo</Button>
          </div>
        ) : carregandoCategorias ? (
          <div aria-label="Carregando categorias" aria-busy="true" className="space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : (
          <>
            {errosVisiveis.length > 0 && (
              <div role="alert" className="mb-5 rounded-lg border border-vermelho-escuro/30 bg-red-50 p-4 text-sm text-vermelho-escuro">
                <p className="font-semibold">Revise os campos indicados:</p>
                <ul className="mt-2 list-inside list-disc">
                  {errosVisiveis.map(([campo, mensagem]) => (
                    <li key={campo}>{mensagem}</li>
                  ))}
                </ul>
              </div>
            )}
            {erroEnvio && <p role="alert" className="mb-4 text-sm text-vermelho-escuro">{erroEnvio}</p>}

            <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-card border border-borda bg-white p-5 shadow-card sm:p-6">
              <Field
                as="select"
                id="produto-categoria"
                ref={(elemento) => { refsCampos.current.categoria_id = elemento; }}
                label="Categoria"
                value={form.categoria_id}
                onChange={(event) => atualizar('categoria_id', event.target.value)}
                onBlur={() => validarAoSair('categoria_id')}
                error={erros.categoria_id}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                ))}
              </Field>
              <Field
                id="produto-nome"
                ref={(elemento) => { refsCampos.current.nome = elemento; }}
                label="Nome"
                value={form.nome}
                onChange={(event) => atualizar('nome', event.target.value)}
                onBlur={() => validarAoSair('nome')}
                error={erros.nome}
                required
              />
              <Field
                as="textarea"
                id="produto-descricao"
                label="Descrição"
                rows={4}
                value={form.descricao}
                onChange={(event) => atualizar('descricao', event.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="produto-preco"
                  ref={(elemento) => { refsCampos.current.preco = elemento; }}
                  label="Preço (R$)"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.preco}
                  onChange={(event) => atualizar('preco', event.target.value)}
                  onBlur={() => validarAoSair('preco')}
                  error={erros.preco}
                  required
                />
                <Field
                  id="produto-estoque"
                  ref={(elemento) => { refsCampos.current.estoque = elemento; }}
                  label="Estoque"
                  type="number"
                  min="0"
                  step="1"
                  value={form.estoque}
                  onChange={(event) => atualizar('estoque', event.target.value)}
                  onBlur={() => validarAoSair('estoque')}
                  error={erros.estoque}
                  required
                />
              </div>
              <Field
                id="produto-imagem"
                label="Imagem (opcional)"
                value={form.imagem_url}
                onChange={(event) => atualizar('imagem_url', event.target.value)}
                help="Use um caminho como /produtos/goku.webp"
              />

              <div>
                <h2 className="mb-2 text-sm font-semibold text-chumbo">Pré-visualização</h2>
                <div className="flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-borda bg-[#F8F7FB] p-4">
                  {form.imagem_url && !imagemFalhou
                    ? (
                      <img
                        src={form.imagem_url}
                        alt={form.nome ? `Pré-visualização de ${form.nome}` : 'Pré-visualização da imagem do produto'}
                        width={640}
                        height={640}
                        decoding="async"
                        onError={() => setImagemFalhou(true)}
                        className="aspect-square max-h-64 max-w-full object-contain"
                      />
                    )
                    : (
                      <div className="text-center text-suave">
                        <ImageOff aria-hidden="true" className="mx-auto size-10 text-roxo-claro" />
                        <p className="mt-2 text-sm">
                          {form.imagem_url ? 'Não foi possível carregar a imagem.' : 'Nenhuma imagem selecionada.'}
                        </p>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button to="/admin/produtos" variant="secondary">Cancelar</Button>
                <Button type="submit" loading={salvando} loadingText="Salvando...">
                  Salvar produto
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Container>
  );
}

export default AdminProdutoForm;

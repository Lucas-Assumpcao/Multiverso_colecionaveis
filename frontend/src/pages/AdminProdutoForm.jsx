import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { buscarPorId } from '../services/produtoService';
import { listarCategorias } from '../services/categoriaService';
import { criarProduto, atualizarProduto } from '../services/adminService';

function AdminProdutoForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    categoria_id: '', nome: '', descricao: '', preco: '', estoque: '', imagem_url: '',
  });
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    listarCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    if (id) {
      buscarPorId(id).then((p) => setForm({
        categoria_id: p.categoria_id,
        nome: p.nome,
        descricao: p.descricao || '',
        preco: p.preco,
        estoque: p.estoque,
        imagem_url: p.imagem_url || '',
      }));
    }
  }, [id]);

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const dados = { ...form, preco: Number(form.preco), estoque: Number(form.estoque) };
      if (id) await atualizarProduto(id, dados);
      else await criarProduto(dados);
      navigate('/admin/produtos');
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">{id ? 'Editar' : 'Novo'} produto</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          value={form.categoria_id}
          onChange={(e) => atualizar('categoria_id', e.target.value)}
          className="border rounded-lg p-3" required
        >
          <option value="">Selecione a categoria</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <input
          placeholder="Nome" value={form.nome}
          onChange={(e) => atualizar('nome', e.target.value)}
          className="border rounded-lg p-3" required
        />
        <textarea
          placeholder="Descrição" value={form.descricao}
          onChange={(e) => atualizar('descricao', e.target.value)}
          className="border rounded-lg p-3"
        />
        <div className="flex gap-3">
          <input
            type="number" step="0.01" placeholder="Preço" value={form.preco}
            onChange={(e) => atualizar('preco', e.target.value)}
            className="border rounded-lg p-3 flex-1" required
          />
          <input
            type="number" placeholder="Estoque" value={form.estoque}
            onChange={(e) => atualizar('estoque', e.target.value)}
            className="border rounded-lg p-3 flex-1" required
          />
        </div>
        <input
          placeholder="URL da imagem (opcional)" value={form.imagem_url}
          onChange={(e) => atualizar('imagem_url', e.target.value)}
          className="border rounded-lg p-3"
        />
        {erro && <p className="text-vermelho text-sm">{erro.message}</p>}
        <button
          disabled={carregando}
          className="bg-amarelo text-roxo font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {carregando ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

export default AdminProdutoForm;
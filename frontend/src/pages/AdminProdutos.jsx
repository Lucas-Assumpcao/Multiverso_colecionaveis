import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarTodos } from '../services/produtoService';
import { removerProduto } from '../services/adminService';
import Container from '../components/ui/Container';

function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarTodos()
      .then(setProdutos)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }, []);

  function recarregar() {
    setCarregando(true);
    setErro(null);
    listarTodos()
      .then(setProdutos)
      .catch(setErro)
      .finally(() => setCarregando(false));
  }

  async function handleRemover(id) {
    if (!confirm('Remover este produto?')) return;
    try {
      await removerProduto(id);
      recarregar();
    } catch (e) {
      alert(e.message);
    }
  }

  if (carregando) return <Container className="py-6 sm:py-10">Carregando...</Container>;
  if (erro) return <Container className="py-6 sm:py-10">Erro: {erro.message}</Container>;

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-roxo text-3xl font-bold">Produtos</h1>
        <Link to="/admin/produtos/form" className="bg-amarelo text-roxo font-bold px-4 py-2 rounded-lg">
          + Novo produto
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {produtos.map((p) => (
          <div key={p.id} className="flex flex-col gap-3 rounded-card border border-borda p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold">{p.nome}</p>
              <p className="text-sm text-gray-500">
                R$ {Number(p.preco).toFixed(2)} · estoque: {p.estoque}
              </p>
            </div>
            <div className="flex items-center gap-3 self-end text-sm sm:self-auto">
              <Link to={`/admin/produtos/form?id=${p.id}`} className="text-roxo underline">Editar</Link>
              <button type="button" onClick={() => handleRemover(p.id)} className="text-vermelho">Remover</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </Container>
  );
}

export default AdminProdutos;
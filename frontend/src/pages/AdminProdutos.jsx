import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listarTodos } from '../services/produtoService';
import { removerProduto } from '../services/adminService';

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

  if (carregando) return <p className="p-8">Carregando...</p>;
  if (erro) return <p className="p-8">Erro: {erro.message}</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-roxo text-3xl font-bold">Produtos</h1>
        <Link to="/admin/produtos/form" className="bg-amarelo text-roxo font-bold px-4 py-2 rounded-lg">
          + Novo produto
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        {produtos.map((p) => (
          <div key={p.id} className="border rounded-lg p-3 flex justify-between items-center">
            <div>
              <p className="font-bold">{p.nome}</p>
              <p className="text-sm text-gray-500">
                R$ {Number(p.preco).toFixed(2)} · estoque: {p.estoque}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link to={`/admin/produtos/form?id=${p.id}`} className="text-roxo underline">Editar</Link>
              <button onClick={() => handleRemover(p.id)} className="text-vermelho">Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminProdutos;
import API_URL from './api';

export async function listarPorCategoria(categoriaId) {
  const resposta = await fetch(`${API_URL}/produtos/categoria/${categoriaId}`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return resposta.json();
}

export async function buscarPorId(id) {
  const resposta = await fetch(`${API_URL}/produtos/${id}`);

  if (resposta.status === 404) {
    throw new Error('Produto não encontrado');
  }
  if (!resposta.ok) {
    throw new Error('Erro ao buscar produto');
  }

  return resposta.json();
}

export async function listarTodos() {
  const resposta = await fetch(`${API_URL}/produtos`);
  if (!resposta.ok) throw new Error('Erro ao buscar produtos');
  return resposta.json();
}
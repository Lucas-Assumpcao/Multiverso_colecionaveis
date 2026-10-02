import API_URL from './api';

export async function listarPorCategoria(categoriaId) {
  const resposta = await fetch(`${API_URL}/produtos/categoria/${categoriaId}`);

  if (!resposta.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return resposta.json();
}
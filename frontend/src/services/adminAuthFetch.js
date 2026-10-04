import API_URL from './api';

export async function adminAuthFetch(caminho, opcoes = {}) {
  const token = localStorage.getItem('adminToken');
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...opcoes.headers,
    },
  });
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.mensagem || 'Erro na requisição');
  return corpo;
}
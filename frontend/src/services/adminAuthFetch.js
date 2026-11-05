import API_URL from './api';

export const ADMIN_SESSION_EXPIRED_EVENT = 'admin-session-expired';

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
  const corpo = await resposta.json().catch(() => ({}));
  if (resposta.status === 401 || resposta.status === 403) {
    localStorage.removeItem('adminToken');
    window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
    const erro = new Error(corpo.mensagem || 'Sessão expirada. Entre de novo.');
    erro.status = resposta.status;
    throw erro;
  }
  if (!resposta.ok) {
    const erro = new Error(corpo.mensagem || 'Erro na requisição');
    erro.status = resposta.status;
    throw erro;
  }
  return corpo;
}
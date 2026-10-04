import API_URL from './api';
import { adminAuthFetch } from './adminAuthFetch';

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.mensagem || 'Erro ao fazer login');
  return corpo;
}

export async function criarProduto(dados) {
  return adminAuthFetch('/produtos', { method: 'POST', body: JSON.stringify(dados) });
}

export async function atualizarProduto(id, dados) {
  return adminAuthFetch(`/produtos/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
}

export async function removerProduto(id) {
  return adminAuthFetch(`/produtos/${id}`, { method: 'DELETE' });
}

export async function listarPedidos() {
  return adminAuthFetch('/admin/pedidos');
}

export async function atualizarStatusPedido(id, status) {
  return adminAuthFetch(`/admin/pedidos/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
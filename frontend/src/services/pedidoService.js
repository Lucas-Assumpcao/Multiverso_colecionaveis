import { authFetch } from './authFetch';

export async function criar(dados) {
  return authFetch('/pedidos', { method: 'POST', body: JSON.stringify(dados) });
}
export async function listar() {
  return authFetch('/pedidos');
}
import { authFetch } from './authFetch';

export async function criar(dados) {
  return authFetch('/enderecos', { method: 'POST', body: JSON.stringify(dados) });
}

export async function consultarCep(cep, { signal } = {}) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
  if (!resposta.ok) throw new Error('Falha ao consultar o CEP');
  const dados = await resposta.json();
  if (dados.erro) throw new Error('CEP não encontrado');
  return dados;
}
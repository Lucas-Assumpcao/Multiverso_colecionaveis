import { authFetch } from './authFetch';

export async function criar(dados) {
  return authFetch('/enderecos', { method: 'POST', body: JSON.stringify(dados) });
}

export async function consultarCep(cep) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const dados = await resposta.json();
  if (dados.erro) throw new Error('CEP não encontrado');
  return dados;
}
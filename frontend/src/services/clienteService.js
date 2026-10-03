import API_URL from './api';

export async function cadastrar(dados) {
  const resposta = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.mensagem || 'Erro ao cadastrar');
  return corpo;
}

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });

  const corpo = await resposta.json();
  if (!resposta.ok) throw new Error(corpo.mensagem || 'Erro ao fazer login');
  return corpo;
}
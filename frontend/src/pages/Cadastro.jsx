import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrar } from '../services/clienteService';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await cadastrar({ nome, email, senha });
      navigate('/login');
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Cadastro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text" placeholder="Nome" value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border rounded-lg p-3" required
        />
        <input
          type="email" placeholder="E-mail" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-3" required
        />
        <input
          type="password" placeholder="Senha" value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="border rounded-lg p-3" required
        />
        {erro && <p className="text-vermelho text-sm">{erro.message}</p>}
        <button
          type="submit" disabled={carregando}
          className="bg-amarelo text-roxo font-bold py-3 rounded-lg disabled:opacity-50"
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Já tem conta? <Link to="/login" className="text-roxo underline">Entrar</Link>
      </p>
    </div>
  );
}

export default Cadastro;
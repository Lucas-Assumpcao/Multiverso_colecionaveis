import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/clienteService';

function Login() {
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
      const resultado = await login(email, senha);
      localStorage.setItem('token', resultado.token);
      navigate('/');
    } catch (err) {
      setErro(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-8 max-w-sm mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Não tem conta? <Link to="/cadastro" className="text-roxo underline">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/clienteService';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import Container from '../components/ui/Container';
import { useToast } from '../hooks/useToast';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      const resultado = await login(email, senha);
      localStorage.setItem('token', resultado.token);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-md">
      <h1 className="text-roxo text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="login-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="login-senha"
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button type="submit" loading={carregando} loadingText="Entrando...">
          Entrar
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Não tem conta? <Link to="/cadastro" className="text-roxo underline">Cadastre-se</Link>
      </p>
      </div>
    </Container>
  );
}

export default Login;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cadastrar } from '../services/clienteService';
import Button from '../components/ui/Button';
import Field from '../components/ui/Field';
import Container from '../components/ui/Container';
import { useToast } from '../hooks/useToast';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      await cadastrar({ nome, email, senha });
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-md">
      <h1 className="text-roxo text-3xl font-bold mb-6">Cadastro</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field
          id="cadastro-nome"
          label="Nome"
          type="text"
          autoComplete="name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <Field
          id="cadastro-email"
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="cadastro-senha"
          label="Senha"
          type="password"
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <Button type="submit" loading={carregando} loadingText="Cadastrando...">
          Cadastrar
        </Button>
      </form>
      <p className="mt-4 text-sm">
        Já tem conta? <Link to="/login" className="text-roxo underline">Entrar</Link>
      </p>
      </div>
    </Container>
  );
}

export default Cadastro;
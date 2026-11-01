import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import { useCategorias } from '../hooks/useCategorias';

function Home() {
  const { categorias, carregando, erro } = useCategorias();

  return (
    <Container className="py-6 sm:py-10">
      <h1 className="text-roxo text-3xl font-bold mb-6">Multiverso Colecionáveis</h1>

      {carregando ? (
        <p>Carregando categorias...</p>
      ) : erro ? (
        <p>Erro ao carregar categorias: {erro.message}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/categoria/${categoria.id}`}
              className="bg-roxo text-amarelo font-bold text-lg rounded-lg p-6 text-center hover:opacity-90"
            >
              {categoria.nome}
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}

export default Home;
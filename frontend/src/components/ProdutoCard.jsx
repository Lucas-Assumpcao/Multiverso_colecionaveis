import { ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';
import { useCarrinhoDrawer } from '../hooks/useCarrinhoDrawer';
import { useToast } from '../hooks/useToast';
import Badge from './ui/Badge';
import Button from './ui/Button';

function ProdutoCard({ produto, indice = 0, headingLevel = 2 }) {
  const { adicionar } = useCarrinho();
  const { abrir: abrirCarrinho } = useCarrinhoDrawer();
  const toast = useToast();
  const estoque = Number(produto.estoque);
  const esgotado = estoque <= 0;
  const atraso = Math.min(Math.max(indice, 0), 7) * 70;
  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  function handleAdicionar(event) {
    const resultado = adicionar(produto);
    if (!resultado.ok) {
      toast.info('Você já separou todo o estoque disponível desse item.');
      return;
    }

    toast.success('Adicionado à coleção');
    abrirCarrinho(event.currentTarget);
  }

  return (
    <article
      style={{ animationDelay: `${atraso}ms` }}
      className="animate-fade-up flex h-full flex-col overflow-hidden rounded-card border border-borda bg-white shadow-card transition-shadow hover:shadow-card-hover"
    >
      <Link to={`/produtos/${produto.id}`} className="group flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-white">
          <div className="flex h-full items-center justify-center text-roxo-claro">
            <ImageOff aria-hidden="true" className="size-10" />
          </div>
          {produto.imagem_url && (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              loading="lazy"
              className="absolute inset-0 size-full object-contain p-4 transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105"
              onError={(event) => { event.currentTarget.style.display = 'none'; }}
            />
          )}
          {estoque === 0 && (
            <Badge variant="neutral" className="absolute left-3 top-3">Esgotado</Badge>
          )}
          {estoque > 0 && estoque <= 5 && (
            <Badge variant="danger" className="absolute left-3 top-3">Últimas unidades</Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <Heading className="line-clamp-2 min-h-12 font-bold text-roxo">{produto.nome}</Heading>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm text-suave">
            {produto.descricao || 'Um novo item para completar sua coleção.'}
          </p>
          <p className="mt-auto pt-4 text-xl font-bold text-roxo">
            {Number(produto.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          disabled={esgotado}
          onClick={handleAdicionar}
          className="w-full"
        >
          Adicionar à coleção
        </Button>
      </div>
    </article>
  );
}

export default ProdutoCard;

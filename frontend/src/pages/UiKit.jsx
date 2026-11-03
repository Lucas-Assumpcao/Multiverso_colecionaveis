import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Field from '../components/ui/Field';
import Skeleton, { ProdutoCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../hooks/useToast';

function UiKit() {
  const toast = useToast();
  const [dialogAberto, setDialogAberto] = useState(false);

  return (
    <Container as="div" className="space-y-12 py-10">
      <header>
        <Badge variant="neutral">Ambiente de desenvolvimento</Badge>
        <h1 className="mt-4 text-3xl font-bold text-roxo">Kit de interface</h1>
        <p className="mt-2 text-suave">
          Componentes e estilos da loja em um só lugar.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-roxo">Botões</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => toast.success('Ação concluída com sucesso.')}>
            Primário
          </Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="danger">Perigo</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="lg">Grande</Button>
          <Button to="/" variant="secondary">Link para início</Button>
          <Button onClick={() => toast.error('Este é um aviso de erro.')}>
            Testar erro
          </Button>
          <Button variant="ghost" onClick={() => toast.info('Este é um aviso informativo.')}>
            Testar informação
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-roxo">Confirmação</h2>
        <Button variant="danger" onClick={() => setDialogAberto(true)}>
          Testar confirmação
        </Button>
        <ConfirmDialog
          open={dialogAberto}
          onCancel={() => setDialogAberto(false)}
          onConfirm={() => {
            setDialogAberto(false);
            toast.success('Ação confirmada.');
          }}
          title="Confirmar ação"
          description="Esta é uma demonstração de confirmação acessível."
          confirmLabel="Confirmar"
          variant="danger"
        />
      </section>

      <section className="max-w-md space-y-4">
        <h2 className="text-xl font-bold text-roxo">Campo</h2>
        <Field
          label="Seu e-mail"
          type="email"
          placeholder="voce@exemplo.com"
          help="Usaremos seu e-mail para falar sobre seu pedido."
        />
        <Field
          label="Campo com erro"
          type="text"
          defaultValue="Valor inválido"
          error="Confira este campo antes de continuar."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-roxo">Selos</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Pago</Badge>
          <Badge variant="warning">Aguardando</Badge>
          <Badge variant="danger">Cancelado</Badge>
          <Badge variant="neutral">Novo</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-roxo">Skeletons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProdutoCardSkeleton />
          <div className="space-y-4 rounded-card border border-borda p-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-borda">
        <EmptyState
          icon={Sparkles}
          title="Sua próxima coleção começa aqui"
          text="Quando houver itens para mostrar, eles aparecem nesta área."
          action={<Button to="/">Explorar a loja</Button>}
        />
      </section>
    </Container>
  );
}

export default UiKit;

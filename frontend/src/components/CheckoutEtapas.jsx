import { Check } from 'lucide-react';

const etapas = ['Carrinho', 'Endereço', 'Pagamento', 'Confirmação'];

function CheckoutEtapas({ atual }) {
  const nomeAtual = etapas[atual - 1];
  const progresso = (atual / etapas.length) * 100;

  return (
    <nav aria-label="Etapas do checkout" className="mb-8">
      <p className="mb-2 text-sm font-semibold text-roxo sm:hidden">
        Passo {atual} de {etapas.length} — {nomeAtual}
      </p>
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-lilas sm:hidden"
        role="progressbar"
        aria-label="Progresso do checkout"
        aria-valuemin={1}
        aria-valuemax={etapas.length}
        aria-valuenow={atual}
      >
        <div
          className="h-full rounded-full bg-roxo transition-[width]"
          style={{ width: `${progresso}%` }}
        />
      </div>

      <ol className="hidden items-center sm:flex">
        {etapas.map((etapa, indice) => {
          const numero = indice + 1;
          const concluida = numero < atual;
          const ativa = numero === atual;

          return (
            <li
              key={etapa}
              aria-current={ativa ? 'step' : undefined}
              className="flex flex-1 items-center last:flex-none"
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  concluida
                    ? 'border-roxo bg-roxo text-white'
                    : ativa
                      ? 'border-roxo bg-amarelo text-roxo'
                      : 'border-borda bg-white text-suave'
                }`}
              >
                {concluida
                  ? <Check aria-hidden="true" className="size-4" />
                  : numero}
              </span>
              <span
                className={`ml-2 whitespace-nowrap text-sm ${
                  ativa ? 'font-bold text-roxo' : concluida ? 'font-semibold text-roxo' : 'text-suave'
                }`}
              >
                {etapa}
              </span>
              {numero < etapas.length && (
                <span
                  aria-hidden="true"
                  className={`mx-3 h-px flex-1 ${concluida ? 'bg-roxo' : 'bg-borda'}`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default CheckoutEtapas;

import Button from '../components/ui/Button';

function NotFound() {
  return (
    <section className="on-dark relative isolate flex min-h-[65vh] items-center justify-center overflow-hidden bg-roxo px-4 py-16 text-center text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35">
        <span className="absolute size-48 rounded-full border border-lilas animate-ring-pulse" />
        <span className="absolute size-72 rounded-full border border-lilas animate-ring-pulse [animation-delay:200ms]" />
        <span className="absolute size-96 rounded-full border border-lilas animate-ring-pulse [animation-delay:400ms]" />
      </div>
      <div className="relative z-10 flex max-w-xl flex-col items-center">
        <h1 className="font-display text-8xl font-extrabold leading-none text-amarelo sm:text-9xl">
          404
        </h1>
        <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">
          Esse universo não existe por aqui.
        </h2>
        <p className="mt-3 text-white/85">
          Talvez o endereço tenha mudado. Vamos encontrar outro caminho para sua coleção.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/" variant="primary">Voltar à Home</Button>
          <Button to="/busca" variant="secondary" className="border-white text-white hover:bg-white/10">
            Ver coleção
          </Button>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
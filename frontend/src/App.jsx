import { lazy, Suspense } from 'react';

const RouterApplication = lazy(() => import('./RouterApplication'));

function App() {
  return (
    <Suspense fallback={(
      <main
        aria-busy="true"
        className="flex min-h-screen items-center justify-center bg-[#F8F7FB] p-6 text-roxo"
      >
        Carregando a loja...
      </main>
    )}
    >
      <RouterApplication />
    </Suspense>
  );
}

export default App;

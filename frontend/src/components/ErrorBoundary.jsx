import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Erro não tratado na interface.', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F8F7FB] p-6 text-center">
          <h1 className="font-display text-3xl font-extrabold text-roxo">
            Algo saiu do trilho
          </h1>
          <p className="max-w-md text-suave">
            Ocorreu um erro inesperado. Tente recarregar a página para continuar.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amarelo px-5 font-semibold text-roxo hover:brightness-95"
          >
            Recarregar
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

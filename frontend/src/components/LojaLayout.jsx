import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CarrinhoDrawer from './CarrinhoDrawer';

function LojaLayout() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-amarelo focus:px-4 focus:py-3 focus:font-semibold focus:text-roxo"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" tabIndex="-1" className="min-h-[70vh]">
        <Outlet />
      </main>
      <Footer />
      <CarrinhoDrawer />
    </>
  );
}

export default LojaLayout;

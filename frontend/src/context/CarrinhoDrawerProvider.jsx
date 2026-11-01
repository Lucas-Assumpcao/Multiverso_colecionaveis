import { useCallback, useMemo, useRef, useState } from 'react';
import { CarrinhoDrawerContext } from './carrinhoDrawerCtx';

function CarrinhoDrawerProvider({ children }) {
  const [aberto, setAberto] = useState(false);
  const elementoAcionador = useRef(null);

  const abrir = useCallback((elemento) => {
    elementoAcionador.current = elemento ?? document.activeElement;
    setAberto(true);
  }, []);

  const fechar = useCallback(() => setAberto(false), []);
  const value = useMemo(() => ({
    aberto,
    abrir,
    fechar,
    elementoAcionador,
  }), [aberto, abrir, fechar]);

  return (
    <CarrinhoDrawerContext.Provider value={value}>
      {children}
    </CarrinhoDrawerContext.Provider>
  );
}

export default CarrinhoDrawerProvider;

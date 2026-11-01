import { useContext } from 'react';
import { CarrinhoDrawerContext } from '../context/carrinhoDrawerCtx';

export function useCarrinhoDrawer() {
  const context = useContext(CarrinhoDrawerContext);

  if (!context) {
    throw new Error('useCarrinhoDrawer precisa ser usado dentro de CarrinhoDrawerProvider.');
  }

  return context;
}

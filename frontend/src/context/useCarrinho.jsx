import { useContext } from 'react';
import { CarrinhoContext } from './carrinhoCtx';

export function useCarrinho() {
  return useContext(CarrinhoContext);
}

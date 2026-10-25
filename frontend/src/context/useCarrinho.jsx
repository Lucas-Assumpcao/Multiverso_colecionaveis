import { useContext } from 'react';
import { CarrinhoContext } from './carrinhoContext';

export function useCarrinho() {
  return useContext(CarrinhoContext);
}

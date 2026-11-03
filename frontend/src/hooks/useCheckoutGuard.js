import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';
import { useToast } from './useToast';

function useCheckoutGuard({ exigeCarrinho = false, enderecoId } = {}) {
  const { itens } = useCarrinho();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const temToken = Boolean(localStorage.getItem('token'));
  const carrinhoValido = !exigeCarrinho || itens.length > 0;
  const enderecoValido = location.pathname !== '/pagamento' || Boolean(enderecoId);

  useEffect(() => {
    if (!temToken) {
      toast.info('Entre na sua conta para continuar o checkout.');
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (!carrinhoValido) {
      toast.info('Seu carrinho está vazio. Adicione itens antes de continuar.');
      navigate('/carrinho', { replace: true });
      return;
    }

    if (!enderecoValido) {
      toast.info('Informe o endereço de entrega para continuar.');
      navigate('/endereco', { replace: true });
    }
  }, [
    carrinhoValido,
    enderecoValido,
    location.pathname,
    navigate,
    temToken,
    toast,
  ]);

  return temToken && carrinhoValido && enderecoValido;
}

export default useCheckoutGuard;

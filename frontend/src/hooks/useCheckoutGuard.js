import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/useCarrinho';
import { useToast } from './useToast';

function useCheckoutGuard({ exigeCarrinho = false, enderecoId } = {}) {
  const { itens } = useCarrinho();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const ultimoRedirecionamento = useRef('');
  const temToken = Boolean(localStorage.getItem('token'));
  const carrinhoValido = !exigeCarrinho || itens.length > 0;
  const enderecoValido = location.pathname !== '/pagamento' || Boolean(enderecoId);
  const motivoBloqueio = !temToken
    ? 'login'
    : !carrinhoValido
      ? 'carrinho'
      : !enderecoValido
        ? 'endereco'
        : '';
  const chaveBloqueio = motivoBloqueio
    ? `${location.pathname}:${motivoBloqueio}`
    : '';

  useEffect(() => {
    if (!chaveBloqueio) {
      ultimoRedirecionamento.current = '';
      return;
    }
    if (ultimoRedirecionamento.current === chaveBloqueio) return;
    ultimoRedirecionamento.current = chaveBloqueio;

    if (motivoBloqueio === 'login') {
      toast.info('Entre na sua conta para continuar o checkout.');
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    if (motivoBloqueio === 'carrinho') {
      toast.info('Seu carrinho está vazio. Adicione itens antes de continuar.');
      navigate('/carrinho', { replace: true });
      return;
    }

    toast.info('Informe o endereço de entrega para continuar.');
    navigate('/endereco', { replace: true });
  }, [
    chaveBloqueio,
    location.pathname,
    motivoBloqueio,
    navigate,
    toast,
  ]);

  return temToken && carrinhoValido && enderecoValido;
}

export default useCheckoutGuard;

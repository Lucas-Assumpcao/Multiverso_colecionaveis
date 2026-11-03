import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutEtapas from '../components/CheckoutEtapas';
import Button from '../components/ui/Button';
import Container from '../components/ui/Container';
import Field from '../components/ui/Field';
import { FRETE_FIXO } from '../config';
import useCheckoutGuard from '../hooks/useCheckoutGuard';
import { useToast } from '../hooks/useToast';
import { consultarCep, criar } from '../services/enderecoService';

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const camposObrigatorios = {
  logradouro: 'Informe a rua.',
  numero: 'Informe o número.',
  bairro: 'Informe o bairro.',
  cidade: 'Informe a cidade.',
  estado: 'Selecione a UF.',
};

const rotulos = {
  cep: 'CEP',
  logradouro: 'Rua',
  numero: 'Número',
  bairro: 'Bairro',
  cidade: 'Cidade',
  estado: 'UF',
};

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function validarCampo(campo, valor) {
  if (campo === 'cep') {
    return valor.replace(/\D/g, '').length === 8 ? '' : 'Informe um CEP válido com 8 dígitos.';
  }
  if (camposObrigatorios[campo] && !valor.trim()) return camposObrigatorios[campo];
  return '';
}

function validarFormulario(form) {
  return ['cep', ...Object.keys(camposObrigatorios)].reduce((erros, campo) => {
    const erro = validarCampo(campo, form[campo]);
    if (erro) erros[campo] = erro;
    return erros;
  }, {});
}

function Endereco() {
  const [form, setForm] = useState({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [erros, setErros] = useState({});
  const [consultaCep, setConsultaCep] = useState({
    cep: '',
    status: 'idle',
    mensagem: '',
  });
  const [erroApi, setErroApi] = useState('');
  const [tentouEnviar, setTentouEnviar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const refsCampos = useRef({});
  const navigate = useNavigate();
  const toast = useToast();
  const permitido = useCheckoutGuard({ exigeCarrinho: true });
  const cepNumerico = form.cep.replace(/\D/g, '');

  useEffect(() => {
    if (cepNumerico.length !== 8) return undefined;

    const controlador = new AbortController();

    consultarCep(cepNumerico, { signal: controlador.signal })
      .then((dados) => {
        setForm((atual) => ({
          ...atual,
          logradouro: atual.logradouro || dados.logradouro || '',
          bairro: atual.bairro || dados.bairro || '',
          cidade: atual.cidade || dados.localidade || '',
          estado: atual.estado || dados.uf || '',
        }));
        setConsultaCep({ cep: cepNumerico, status: 'success', mensagem: '' });
      })
      .catch((erro) => {
        if (erro.name === 'AbortError') return;
        setConsultaCep({
          cep: cepNumerico,
          status: 'error',
          mensagem: erro.message === 'CEP não encontrado'
            ? 'CEP não encontrado'
            : 'Não foi possível consultar o CEP agora. Preencha manualmente.',
        });
      });

    return () => controlador.abort();
  }, [cepNumerico]);

  if (!permitido) return null;

  function atualizar(campo, valor) {
    const valorAtualizado = campo === 'cep'
      ? valor.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
      : valor;
    if (campo === 'cep') {
      const novoCep = valorAtualizado.replace(/\D/g, '');
      const cepAnterior = form.cep.replace(/\D/g, '');
      if (novoCep.length === 8 && novoCep !== cepAnterior) {
        setConsultaCep({ cep: novoCep, status: 'loading', mensagem: '' });
      }
    }
    setForm((atual) => ({ ...atual, [campo]: valorAtualizado }));
    setErros((atuais) => ({ ...atuais, [campo]: '' }));
    setErroApi('');
  }

  function validarAoSair(campo) {
    setErros((atuais) => ({
      ...atuais,
      [campo]: validarCampo(campo, form[campo]),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErroApi('');
    setTentouEnviar(true);
    const novosErros = validarFormulario(form);
    setErros(novosErros);

    const primeiroInvalido = ['cep', ...Object.keys(camposObrigatorios)]
      .find((campo) => novosErros[campo]);
    if (primeiroInvalido) {
      refsCampos.current[primeiroInvalido]?.focus();
      return;
    }

    const endereco = {
      cep: cepNumerico,
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado,
    };

    setCarregando(true);
    try {
      const resultado = await criar(endereco);
      navigate('/pagamento', {
        state: { enderecoId: resultado.id, endereco },
      });
    } catch (erro) {
      setErroApi(erro.message || 'Não foi possível salvar o endereço. Tente novamente.');
      toast.error(erro.message || 'Não foi possível salvar o endereço.');
    } finally {
      setCarregando(false);
    }
  }

  const errosVisiveis = tentouEnviar
    ? Object.entries(erros).filter(([, mensagem]) => mensagem)
    : [];

  return (
    <Container className="py-6 sm:py-10">
      <div className="mx-auto max-w-md">
        <CheckoutEtapas atual={2} />
        <h1 className="mb-3 text-3xl font-bold text-roxo">Endereço de entrega</h1>
        <p className="mb-6 text-sm text-suave">Frete fixo: {formatarPreco(FRETE_FIXO)}</p>

        {errosVisiveis.length > 0 && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-vermelho-escuro/30 bg-red-50 p-4 text-sm text-vermelho-escuro"
          >
            <p className="font-semibold">Revise os campos obrigatórios:</p>
            <ul className="mt-2 list-inside list-disc">
              {errosVisiveis.map(([campo, mensagem]) => (
                <li key={campo}>{rotulos[campo]}: {mensagem}</li>
              ))}
            </ul>
          </div>
        )}

        {erroApi && (
          <p role="alert" className="mb-4 text-sm text-vermelho-escuro">{erroApi}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Field
            id="endereco-cep"
            ref={(elemento) => { refsCampos.current.cep = elemento; }}
            label="CEP"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="00000-000"
            maxLength={9}
            value={form.cep}
            onChange={(event) => atualizar('cep', event.target.value)}
            onBlur={() => validarAoSair('cep')}
            error={erros.cep}
            help="Digite os oito números do CEP."
          />
          {consultaCep.cep === cepNumerico && consultaCep.status === 'loading' && (
            <p role="status" aria-live="polite" className="-mt-3 text-sm text-suave">
              Consultando CEP...
            </p>
          )}
          {consultaCep.cep === cepNumerico && consultaCep.status === 'error' && (
            <p className="-mt-3 text-sm text-vermelho-escuro">{consultaCep.mensagem}</p>
          )}

          <Field
            id="endereco-rua"
            ref={(elemento) => { refsCampos.current.logradouro = elemento; }}
            label="Rua"
            autoComplete="address-line1"
            value={form.logradouro}
            onChange={(event) => atualizar('logradouro', event.target.value)}
            onBlur={() => validarAoSair('logradouro')}
            error={erros.logradouro}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              id="endereco-numero"
              ref={(elemento) => { refsCampos.current.numero = elemento; }}
              label="Número"
              autoComplete="address-line2"
              value={form.numero}
              onChange={(event) => atualizar('numero', event.target.value)}
              onBlur={() => validarAoSair('numero')}
              error={erros.numero}
              required
            />
            <Field
              id="endereco-complemento"
              label="Complemento"
              autoComplete="address-line3"
              value={form.complemento}
              onChange={(event) => atualizar('complemento', event.target.value)}
            />
          </div>

          <Field
            id="endereco-bairro"
            ref={(elemento) => { refsCampos.current.bairro = elemento; }}
            label="Bairro"
            autoComplete="address-level3"
            value={form.bairro}
            onChange={(event) => atualizar('bairro', event.target.value)}
            onBlur={() => validarAoSair('bairro')}
            error={erros.bairro}
            required
          />

          <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3">
            <Field
              id="endereco-cidade"
              ref={(elemento) => { refsCampos.current.cidade = elemento; }}
              label="Cidade"
              autoComplete="address-level2"
              value={form.cidade}
              onChange={(event) => atualizar('cidade', event.target.value)}
              onBlur={() => validarAoSair('cidade')}
              error={erros.cidade}
              required
            />
            <Field
              as="select"
              id="endereco-estado"
              ref={(elemento) => { refsCampos.current.estado = elemento; }}
              label="UF"
              autoComplete="address-level1"
              value={form.estado}
              onChange={(event) => atualizar('estado', event.target.value)}
              onBlur={() => validarAoSair('estado')}
              error={erros.estado}
              required
            >
              <option value="">UF</option>
              {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
            </Field>
          </div>

          <Button type="submit" loading={carregando} loadingText="Salvando..." size="lg">
            Continuar para pagamento
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Endereco;

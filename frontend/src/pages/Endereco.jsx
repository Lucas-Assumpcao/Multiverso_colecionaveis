import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criar, consultarCep } from '../services/enderecoService';

function Endereco() {
  const [form, setForm] = useState({
    cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  });
  const [erroCep, setErroCep] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function buscarCep() {
    setErroCep(null);
    if (form.cep.replace(/\D/g, '').length !== 8) return;
    try {
      const dados = await consultarCep(form.cep);
      setForm((f) => ({
        ...f,
        logradouro: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      }));
    } catch (e) {
      setErroCep(e.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const resultado = await criar(form);
      navigate('/pagamento', { state: { enderecoId: resultado.id, valorFrete: 15.0 } });
    } catch (e) {
      setErro(e);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-roxo text-3xl font-bold mb-6">Endereço de entrega</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          placeholder="CEP" value={form.cep}
          onChange={(e) => atualizar('cep', e.target.value)}
          onBlur={buscarCep}
          className="border rounded-lg p-3" required
        />
        {erroCep && <p className="text-vermelho text-sm">{erroCep}</p>}
        <input
          placeholder="Rua" value={form.logradouro}
          onChange={(e) => atualizar('logradouro', e.target.value)}
          className="border rounded-lg p-3" required
        />
        <div className="flex gap-3">
          <input
            placeholder="Número" value={form.numero}
            onChange={(e) => atualizar('numero', e.target.value)}
            className="border rounded-lg p-3 flex-1" required
          />
          <input
            placeholder="Complemento" value={form.complemento}
            onChange={(e) => atualizar('complemento', e.target.value)}
            className="border rounded-lg p-3 flex-1"
          />
        </div>
        <input
          placeholder="Bairro" value={form.bairro}
          onChange={(e) => atualizar('bairro', e.target.value)}
          className="border rounded-lg p-3" required
        />
        <div className="flex gap-3">
          <input
            placeholder="Cidade" value={form.cidade}
            onChange={(e) => atualizar('cidade', e.target.value)}
            className="border rounded-lg p-3 flex-1" required
          />
          <input
            placeholder="UF" value={form.estado} maxLength={2}
            onChange={(e) => atualizar('estado', e.target.value.toUpperCase())}
            className="border rounded-lg p-3 w-20" required
          />
        </div>
        {erro && <p className="text-vermelho text-sm">{erro.message}</p>}
        <button
          disabled={carregando}
          className="bg-amarelo text-roxo font-bold py-3 rounded-lg mt-2 disabled:opacity-50"
        >
          {carregando ? 'Salvando...' : 'Continuar para pagamento'}
        </button>
      </form>
    </div>
  );
}

export default Endereco;
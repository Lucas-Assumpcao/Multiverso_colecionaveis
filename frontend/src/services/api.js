const valorApiUrl = import.meta.env.VITE_API_URL?.trim();

if (import.meta.env.PROD && !valorApiUrl) {
  throw new Error('Configure VITE_API_URL com a origem pública da API.');
}

const urlApi = valorApiUrl ? new URL(valorApiUrl) : null;

if (urlApi && (urlApi.pathname !== '/' || urlApi.search || urlApi.hash)) {
  throw new Error('VITE_API_URL deve conter somente a origem da API, sem caminho como /api.');
}

const API_URL = urlApi?.origin || '';

export default API_URL;

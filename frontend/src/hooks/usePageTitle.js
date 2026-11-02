import { useEffect } from 'react';

const TITULO_PADRAO = 'Multiverso Colecionáveis — Todo fandom, um só lugar.';

export default function usePageTitle(titulo) {
  useEffect(() => {
    document.title = `${titulo} — Multiverso Colecionáveis`;
    return () => {
      document.title = TITULO_PADRAO;
    };
  }, [titulo]);
}

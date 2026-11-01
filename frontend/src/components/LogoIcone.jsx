function LogoIcone({ variante = 'dark', className, ...props }) {
  const mono = variante === 'mono';
  const arcoClaro = variante === 'light' ? '#2D1B4E' : '#FFFFFF';
  const corBase = mono ? '#2D1B4E' : '#F5B700';
  const corCentro = mono ? '#2D1B4E' : '#FFFFFF';

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label="Multiverso Colecionáveis"
      className={className}
      {...props}
    >
      <circle cx="100" cy="100" r="85" stroke={corBase} strokeWidth="7" />
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke={mono ? '#FFFFFF' : arcoClaro}
        strokeWidth="7"
        strokeDasharray="40 213.6"
        strokeLinecap="round"
        transform="rotate(-20 100 100)"
      />
      <circle cx="100" cy="100" r="62" stroke={corBase} strokeWidth="6" />
      <circle cx="100" cy="100" r="40" stroke={corCentro} strokeWidth="5" />
      <polygon
        points="100,78 107,93 123,93 110,103 115,118 100,109 85,118 90,103 77,93 93,93"
        fill={corBase}
      />
    </svg>
  );
}

export default LogoIcone;

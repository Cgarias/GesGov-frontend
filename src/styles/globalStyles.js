export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Paleta principal */
    --primary:      #2563EB;
    --primary-dk:   #1D4ED8;
    --primary-lt:   #3B82F6;
    --primary-bg:   #EFF6FF;
    --primary-border: #BFDBFE;

    /* Acento */
    --accent:       #F59E0B;
    --accent-dk:    #D97706;
    --accent-lt:    #FCD34D;
    --accent-bg:    #FFFBEB;

    /* Superficie */
    --surface:      #FFFFFF;
    --surface-2:    #F8FAFC;
    --surface-3:    #F1F5F9;

    /* Texto */
    --text-1:       #0F172A;
    --text-2:       #334155;
    --text-3:       #64748B;
    --text-4:       #94A3B8;

    /* Bordes */
    --border:       #E2E8F0;
    --border-2:     #CBD5E1;

    /* Estados */
    --success:      #10B981;
    --success-bg:   #ECFDF5;
    --success-border: #A7F3D0;
    --warning:      #F59E0B;
    --warning-bg:   #FFFBEB;
    --warning-border: #FDE68A;
    --danger:       #EF4444;
    --danger-bg:    #FEF2F2;
    --danger-border: #FECACA;
    --info:         #3B82F6;
    --info-bg:      #EFF6FF;
    --info-border:  #BFDBFE;

    /* Sombras */
    --shadow-xs: 0 1px 2px rgba(0,0,0,.05);
    --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
    --shadow-lg: 0 10px 30px rgba(0,0,0,.10), 0 4px 8px rgba(0,0,0,.05);
    --shadow-xl: 0 20px 50px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.08);

    /* Layout */
    --radius-sm:  6px;
    --radius:     10px;
    --radius-lg:  14px;
    --radius-xl:  20px;
    --sidebar-w:  260px;

    /* Sidebar */
    --sidebar-bg:   #0F172A;
    --sidebar-hover: rgba(255,255,255,.06);
    --sidebar-active: rgba(37,99,235,.2);
  }

  html, body, #root {
    height: 100%;
    font-family: 'Inter', sans-serif;
  }

  body {
    background: var(--surface-2);
    color: var(--text-2);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: var(--text-1);
    line-height: 1.3;
    font-weight: 700;
  }

  input, select, textarea, button {
    font-family: 'Inter', sans-serif;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--text-4); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(.96); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @keyframes slideRight {
    from { transform: translateX(-16px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;

export function injectGlobalStyles() {
  const style = document.createElement('style');
  style.id = 'gesgov-global';
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
  return () => {
    const el = document.getElementById('gesgov-global');
    if (el) document.head.removeChild(el);
  };
}

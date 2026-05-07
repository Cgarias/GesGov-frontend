export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --navy:      #0D2545;
    --navy-mid:  #14376B;
    --navy-lt:   #1B4F9C;
    --gold:      #C9A84C;
    --gold-lt:   #E8C97A;
    --gold-dk:   #A07828;
    --white:     #FFFFFF;
    --gray-50:   #F8FAFC;
    --gray-100:  #F1F5F9;
    --gray-200:  #E2E8F0;
    --gray-300:  #CBD5E1;
    --gray-400:  #94A3B8;
    --gray-500:  #64748B;
    --gray-600:  #475569;
    --gray-700:  #334155;
    --gray-800:  #1E293B;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 12px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04);
    --shadow-lg: 0 10px 30px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
    --radius:    10px;
    --sidebar-w: 256px;
  }

  html, body, #root {
    height: 100%;
    font-family: 'Source Sans 3', sans-serif;
  }

  body {
    background: var(--gray-50);
    color: var(--gray-700);
    line-height: 1.6;
  }

  h1, h2, h3, h4 {
    font-family: 'Libre Baskerville', serif;
    color: var(--navy);
    line-height: 1.3;
  }

  input, select, textarea, button {
    font-family: 'Source Sans 3', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: var(--gray-100);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 3px;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
  }
`;

export function injectGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = GLOBAL_CSS;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}

# GesGov — Frontend

Aplicación web SPA construida con React 18 y Vite para el sistema de gestión documental de la Alcaldía Municipal.

## Stack

- **Framework**: React 18 + JSX
- **Build tool**: Vite 5
- **Iconos**: Lucide React
- **HTTP**: Axios
- **Estilos**: CSS-in-JS (inline styles + variables CSS)
- **Fuentes**: Inter + Plus Jakarta Sans (Google Fonts)

## Requisitos

- Node.js 20+
- npm 9+

## Instalación

```bash
npm install
```

## Variables de Entorno

Copia `.env.example` como `.env`:

```bash
cp .env.example .env
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:3001/api/v1` |

> Las variables de Vite deben comenzar con `VITE_` para ser accesibles en el código.

## Scripts

```bash
# Desarrollo con hot-reload (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint
```

## Estructura del Proyecto

```
src/
├── main.jsx                          # Entry point — monta React con AuthProvider
├── App.jsx                           # Componente raíz — routing por estado
├── api/
│   ├── axios.config.js               # Instancia Axios + interceptores JWT
│   ├── auth.api.js                   # Llamadas a /auth/*
│   └── documents.api.js              # Llamadas a /documents/*
├── components/
│   ├── auth/
│   │   └── LoginPage.jsx             # Pantalla de inicio de sesión
│   ├── common/
│   │   ├── Button.jsx                # Botón reutilizable con variantes
│   │   ├── Card.jsx                  # Tarjeta contenedora
│   │   ├── ErrorMessage.jsx          # Mensaje de error con retry
│   │   ├── Icons.jsx                 # Iconos SVG legacy (compatibilidad)
│   │   ├── Loading.jsx               # Spinner de carga
│   │   ├── StatusBadge.jsx           # Badge de estado de documento
│   │   └── index.js                  # Re-exportaciones
│   ├── documents/
│   │   ├── Dashboard.jsx             # Panel principal con estadísticas
│   │   ├── DocumentDetailModal.jsx   # Modal de detalle de documento
│   │   ├── DocumentsList.jsx         # Lista con búsqueda y filtros
│   │   ├── SettingsPage.jsx          # Página de configuración
│   │   ├── UploadForm.jsx            # Formulario de radicación
│   │   └── index.js
│   └── layout/
│       ├── Sidebar.jsx               # Navegación lateral
│       ├── Topbar.jsx                # Barra superior
│       └── index.js
├── constants/
│   └── documentStatus.js            # Labels y colores de estados
├── context/
│   └── AuthContext.jsx              # Estado global de autenticación
├── hooks/
│   └── useDocuments.js              # Hook para CRUD de documentos
├── styles/
│   └── globalStyles.js              # Variables CSS + animaciones
└── utils/
    └── dateUtils.js                 # Formateo de fechas y cálculos
```

## Arquitectura

### Autenticación

El flujo de autenticación funciona así:

```
1. Usuario abre la app
2. AuthContext lee el token de localStorage
3. Si no hay token → renderiza <LoginPage />
4. Usuario hace login → backend devuelve JWT
5. Token se guarda en localStorage
6. App renderiza <AuthenticatedApp />
7. Axios adjunta el token en cada petición (interceptor)
8. Si el backend devuelve 401 → se dispara evento 'auth:logout'
9. AuthContext limpia el estado → vuelve a <LoginPage />
```

### Gestión de Estado

- **Autenticación**: React Context (`AuthContext`)
- **Documentos**: Custom hook (`useDocuments`) con estado local
- **UI**: Estado local por componente (`useState`)

### Separación de Responsabilidades

```
api/          → Comunicación con el backend (sin lógica de UI)
hooks/        → Lógica de negocio y estado
components/   → Presentación pura
context/      → Estado global compartido
utils/        → Funciones puras reutilizables
constants/    → Valores estáticos
```

## Componentes Principales

### `AuthContext`
Provee el estado de sesión a toda la app. Persiste el token en `localStorage`.

```jsx
const { user, isAuthenticated, login, logout, updateUser } = useAuth();
```

### `useDocuments`
Hook que encapsula todas las operaciones CRUD de documentos.

```jsx
const {
  documents, stats, loading, error,
  fetchAll, createDocument, updateDocument,
  markAsResponded, removeDocument
} = useDocuments();
```

### `Button`
Componente de botón con variantes: `primary`, `accent`, `outline`, `ghost`, `danger`, `success`.

```jsx
<Button variant="primary" icon={<Save size={15} />} onClick={handleSave}>
  Guardar
</Button>
```

### `StatusBadge`
Badge visual para el estado de un documento.

```jsx
<StatusBadge status="POR_VENCER" />
```

## Despliegue

### Build de Producción

```bash
# Con la URL del backend de producción
VITE_API_URL=https://api.gesgov.com/api/v1 npm run build
```

El build genera la carpeta `dist/` con archivos estáticos listos para servir.

### Nginx (recomendado)

Usa el `nginx.conf` incluido en el proyecto. Configuración clave para SPA:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Docker

```bash
# Construir imagen con la URL del backend
docker build \
  --build-arg VITE_API_URL=https://api.gesgov.com/api/v1 \
  -t gesgov-frontend .

# Ejecutar
docker run -d -p 80:80 --name gesgov-frontend gesgov-frontend
```

O usar Docker Compose desde la raíz:

```bash
docker compose up -d --build frontend
```

### Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Agrega la variable de entorno `VITE_API_URL` en el panel de Vercel
4. Deploy

### Netlify

1. Conecta el repositorio en [netlify.com](https://netlify.com)
2. Configura:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
3. Agrega `VITE_API_URL` en Environment Variables
4. Crea el archivo `public/_redirects`:
   ```
   /*  /index.html  200
   ```

## Convenciones de Código

- **Componentes**: PascalCase (`DocumentsList.jsx`)
- **Hooks**: camelCase con prefijo `use` (`useDocuments.js`)
- **Constantes de módulo**: UPPER_SNAKE_CASE (`INPUT_BASE`, `FEATURES`)
- **Componentes auxiliares**: Definidos **fuera** del componente padre para evitar re-renders
- **Estilos**: Objetos JavaScript con variables CSS (`var(--primary)`)

> **Regla importante**: Nunca definir componentes dentro de otros componentes. Esto causa que React los re-monte en cada render, perdiendo el foco de los inputs.

## Paleta de Colores

| Variable | Valor | Uso |
|----------|-------|-----|
| `--primary` | `#2563EB` | Acciones principales, links |
| `--primary-dk` | `#1D4ED8` | Hover de primary |
| `--accent` | `#F59E0B` | Acciones secundarias |
| `--success` | `#10B981` | Estados positivos |
| `--danger` | `#EF4444` | Errores, eliminación |
| `--warning` | `#F59E0B` | Alertas |
| `--sidebar-bg` | `#0F172A` | Fondo del sidebar |
| `--text-1` | `#0F172A` | Texto principal |
| `--text-3` | `#64748B` | Texto secundario |
| `--border` | `#E2E8F0` | Bordes |

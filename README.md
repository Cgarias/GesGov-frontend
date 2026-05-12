# GesGov Frontend

> Aplicación web SPA para el Sistema de Gestión Documental de la Alcaldía Municipal.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel)](https://vercel.com)

---

## Descripción

SPA (Single Page Application) construida con React 18 y Vite. Consume la API REST del backend para gestionar documentos institucionales con autenticación JWT, seguimiento de estados y alertas de vencimiento.

---

## Requisitos

- Node.js 20+
- npm 9+

---

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar VITE_API_URL si el backend no corre en localhost:3001

# Desarrollo (http://localhost:5173)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `VITE_API_URL` | **Sí** | URL base de la API del backend |

**Desarrollo:** `VITE_API_URL=http://localhost:3001/api/v1`  
**Producción:** `VITE_API_URL=https://gesgov-backend.onrender.com/api/v1`

> Las variables de Vite deben comenzar con `VITE_` para ser accesibles en el código del navegador.

---

## Estructura del Proyecto

```
src/
├── main.jsx                              # Entry point — monta App con AuthProvider
├── App.jsx                               # Raíz: decide entre LoginPage y AuthenticatedApp
│
├── api/
│   ├── axios.config.js                   # Instancia Axios + interceptores JWT/401
│   ├── auth.api.js                       # login(), register(), getMe()
│   └── documents.api.js                  # getAll(), getStats(), create(), update(), remove()
│
├── components/
│   ├── auth/
│   │   └── LoginPage.jsx                 # Pantalla de inicio de sesión
│   │
│   ├── common/
│   │   ├── Button.jsx                    # Botón con variantes: primary, accent, outline, danger, success
│   │   ├── Card.jsx                      # Contenedor con sombra y borde
│   │   ├── ErrorMessage.jsx              # Mensaje de error con botón retry
│   │   ├── Loading.jsx                   # Spinner de carga
│   │   ├── StatusBadge.jsx               # Badge de estado con punto de color
│   │   └── index.js                      # Re-exportaciones
│   │
│   ├── documents/
│   │   ├── Dashboard.jsx                 # Panel con estadísticas y banner
│   │   ├── DocumentsList.jsx             # Lista con búsqueda y filtros
│   │   ├── DocumentDetailModal.jsx       # Modal de detalle, acciones y metadata
│   │   ├── UploadForm.jsx                # Formulario de radicación con drag & drop
│   │   ├── SettingsPage.jsx              # Configuración de perfil y preferencias
│   │   └── index.js
│   │
│   └── layout/
│       ├── Sidebar.jsx                   # Navegación lateral con alertas y usuario
│       ├── Topbar.jsx                    # Barra superior con título y acciones
│       └── index.js
│
├── context/
│   └── AuthContext.jsx                   # Estado global de sesión JWT
│
├── hooks/
│   └── useDocuments.js                   # CRUD de documentos con estado local
│
├── constants/
│   └── documentStatus.js                 # Labels y configuración de estados
│
├── styles/
│   └── globalStyles.js                   # Variables CSS + animaciones + fuentes
│
└── utils/
    └── dateUtils.js                      # formatDate(), getDaysRemaining(), formatFileSize()
```

---

## Arquitectura y Patrones

### Separación de Responsabilidades

```
api/          → Comunicación HTTP pura (sin lógica de UI)
context/      → Estado global compartido (autenticación)
hooks/        → Lógica de negocio y estado de datos
components/   → Presentación y UI
utils/        → Funciones puras reutilizables
constants/    → Valores estáticos
styles/       → Tokens de diseño (variables CSS)
```

### Flujo de Autenticación

```
App arranca
    │
    ├─ AuthContext lee localStorage
    │       │
    │       ├─ Token encontrado → isAuthenticated = true
    │       │       └─ Renderiza <AuthenticatedApp />
    │       │               └─ useDocuments se monta y carga datos
    │       │
    │       └─ Sin token → isAuthenticated = false
    │               └─ Renderiza <LoginPage />
    │
    └─ Usuario hace login
            │
            ├─ POST /auth/login → { accessToken, user }
            ├─ Guarda en localStorage
            ├─ Actualiza AuthContext
            └─ React renderiza <AuthenticatedApp />
```

### Manejo de Token Expirado

```
Petición HTTP con token expirado
    │
    └─ Backend responde 401
            │
            └─ Interceptor de Axios detecta 401
                    │
                    ├─ Limpia localStorage
                    └─ Dispara evento 'auth:logout'
                            │
                            └─ AuthContext escucha el evento
                                    │
                                    └─ Limpia estado → React renderiza <LoginPage />
```

### Regla Crítica de Componentes

> **Nunca definir componentes dentro de otros componentes.**

Si un componente auxiliar (como `FieldGroup` o `Field`) se define dentro del componente padre, React lo trata como un tipo nuevo en cada render, desmonta y remonta el DOM, y los inputs pierden el foco al escribir.

**Incorrecto:**
```jsx
function UploadForm() {
  const FieldGroup = ({ label, children }) => <div>...</div>; // ❌ Re-crea en cada render
  return <form><FieldGroup label="Título">...</FieldGroup></form>;
}
```

**Correcto:**
```jsx
const FieldGroup = ({ label, children }) => <div>...</div>; // ✅ Estable entre renders

function UploadForm() {
  return <form><FieldGroup label="Título">...</FieldGroup></form>;
}
```

---

## Componentes Principales

### `AuthContext`

Provee el estado de sesión a toda la app.

```jsx
const { user, isAuthenticated, loading, error, login, logout, updateUser } = useAuth();
```

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `user` | object \| null | Datos del usuario autenticado |
| `isAuthenticated` | boolean | `true` si hay token y usuario válidos |
| `loading` | boolean | `true` durante el proceso de login |
| `error` | string \| null | Mensaje de error del último login fallido |
| `login(email, password)` | async function | Autentica y guarda la sesión |
| `logout()` | function | Limpia la sesión |
| `updateUser(data)` | function | Actualiza datos del usuario en contexto y localStorage |

---

### `useDocuments`

Hook que encapsula todas las operaciones CRUD de documentos.

```jsx
const {
  documents,      // Document[]
  stats,          // { PENDIENTE: n, EN_PROCESO: n, ... }
  loading,        // boolean
  error,          // string | null
  fetchAll,       // () => Promise<void>
  createDocument, // (payload) => Promise<Document>
  updateDocument, // (id, payload) => Promise<Document>
  markAsResponded,// (id) => Promise<Document>
  removeDocument, // (id) => Promise<void>
} = useDocuments();
```

Solo se monta cuando el usuario está autenticado (vive en `AuthenticatedApp`).

---

### `Button`

```jsx
<Button
  variant="primary"    // primary | accent | gold | outline | ghost | danger | success
  size="md"            // sm | md | lg
  icon={<Save size={15} />}
  disabled={false}
  onClick={handleClick}
  type="button"        // button | submit
>
  Guardar
</Button>
```

---

### `StatusBadge`

```jsx
<StatusBadge status="POR_VENCER" />
// Renderiza: ● Por Vencer (fondo amarillo, texto ámbar)
```

Estados soportados: `PENDIENTE`, `EN_PROCESO`, `POR_VENCER`, `VENCIDO`, `RESPONDIDO`.

---

## Sistema de Diseño

### Fuentes

| Fuente | Uso |
|--------|-----|
| Inter | Cuerpo de texto, labels, botones |
| Plus Jakarta Sans | Títulos, headings, números grandes |

### Paleta de Colores (Variables CSS)

| Variable | Valor | Uso |
|----------|-------|-----|
| `--primary` | `#2563EB` | Acciones principales, links, focus |
| `--primary-dk` | `#1D4ED8` | Hover de primary |
| `--accent` | `#F59E0B` | Acciones secundarias |
| `--success` | `#10B981` | Estado respondido, confirmaciones |
| `--danger` | `#EF4444` | Errores, eliminación, vencidos |
| `--warning` | `#F59E0B` | Alertas, por vencer |
| `--sidebar-bg` | `#0F172A` | Fondo del sidebar |
| `--surface` | `#FFFFFF` | Fondo de cards y paneles |
| `--surface-2` | `#F8FAFC` | Fondo de la página |
| `--text-1` | `#0F172A` | Texto principal |
| `--text-3` | `#64748B` | Texto secundario |
| `--border` | `#E2E8F0` | Bordes de inputs y cards |

### Animaciones

| Nombre | Descripción |
|--------|-------------|
| `fadeUp` | Aparece desde abajo con fade |
| `fadeIn` | Fade simple |
| `scaleIn` | Escala desde 96% con fade |
| `slideRight` | Desliza desde la izquierda |

---

## Despliegue en Vercel

### Configuración

| Campo | Valor |
|-------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Variable de entorno en Vercel

```
VITE_API_URL = https://gesgov-backend.onrender.com/api/v1
```

### SPA Routing

El archivo `vercel.json` configura el rewrite necesario para que React Router funcione:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Actualizar el despliegue

Cada `git push` a la rama `main` redespliega automáticamente en Vercel.

```bash
git add .
git commit -m "feat: descripción del cambio"
git push
```

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo (http://localhost:5173)
npm run build     # Build de producción → dist/
npm run preview   # Preview del build local
npm run lint      # ESLint
```

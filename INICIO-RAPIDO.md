# 🚀 Inicio Rápido - Frontend GesGov

## ✅ Estado del Proyecto

El frontend está **completamente configurado** y listo para usar. Todos los archivos han sido creados y el proyecto compila correctamente.

## 📦 Archivos Creados

```
front/
├── src/
│   ├── App.jsx ✅          # Aplicación completa (todos los componentes)
│   └── main.jsx ✅         # Punto de entrada React
├── index.html ✅           # HTML base
├── .env ✅                 # Variables de entorno
├── .gitignore ✅           # Archivos ignorados por Git
├── vite.config.js ✅       # Configuración Vite
├── package.json ✅         # Dependencias
└── README.md ✅            # Documentación completa
```

## 🎯 Componentes Incluidos

### ✅ Componentes Base
- `StatusBadge` - Badge de estado de documentos
- `PrioridadBadge` - Badge de prioridad
- `Card` - Tarjeta contenedora
- `Btn` - Botón personalizado

### ✅ Componentes de Layout
- `Sidebar` - Barra lateral de navegación
- `Topbar` - Barra superior con título y acciones

### ✅ Vistas Principales
- `DashboardView` - Panel principal con estadísticas
- `DocumentsView` - Lista de documentos con búsqueda
- `UploadView` - Formulario de radicación
- `DetailModal` - Modal de detalle de documento

### ✅ Utilidades
- Iconos SVG inline (sin dependencias externas)
- Funciones de formato de fechas
- Cálculo de días restantes
- Formato de tamaño de archivos

## ▶️ Ejecutar el Proyecto

### 1. Asegúrate de que el backend esté corriendo

```bash
# En la carpeta backend/
npm run start:dev
```

El backend debe estar en: `http://localhost:3001`

### 2. Ejecuta el frontend

```bash
# En la carpeta front/
npm run dev
```

### 3. Abre el navegador

El frontend se abrirá automáticamente en: **http://localhost:5173**

## 🎨 Características Visuales

### Paleta de Colores Institucional
- **Azul Navy:** `#0D2545` - Color principal
- **Dorado:** `#C9A84C` - Color de acento
- **Grises:** Escala completa para UI

### Tipografías
- **Títulos:** Libre Baskerville (serif elegante)
- **Cuerpo:** Source Sans 3 (sans-serif moderna)

### Animaciones
- Fade up para tarjetas
- Fade in para elementos
- Scale in para modales
- Transiciones suaves en hover

## 📊 Datos de Prueba

El sistema incluye 8 documentos mock con diferentes estados:

1. **Contrato Interventoría** - Por vencer (2 días)
2. **Solicitud Presupuestal** - En proceso (15 días)
3. **Derecho de Petición** - Vencido (-3 días)
4. **Convenio Gobernación** - En proceso (30 días)
5. **Acta Liquidación** - Respondido
6. **Informe Gestión** - Pendiente (sin fecha)
7. **Permiso Ambiental** - Por vencer (1 día)
8. **Resolución Nombramiento** - En proceso (20 días)

## 🔄 Navegación

### Menú Principal
1. **Panel Principal** - Dashboard con estadísticas
2. **Documentos** - Lista completa de documentos
3. **Radicar Documento** - Formulario de carga
4. **Reportes** - Indicadores (en desarrollo)
5. **Configuración** - Ajustes (en desarrollo)

### Funcionalidades Activas
- ✅ Búsqueda de documentos
- ✅ Filtros por estado y dependencia
- ✅ Vista de tarjetas
- ✅ Modal de detalle
- ✅ Formulario de radicación
- ✅ Alertas de vencimiento
- ✅ Sidebar colapsable

## 🔌 Integración con Backend

### Estado Actual
El frontend usa datos mock (`MOCK_DOCUMENTS`) para desarrollo independiente.

### Para Conectar con Backend Real

1. **Verifica que el backend esté corriendo:**
```bash
curl http://localhost:3001/api/v1/documents
```

2. **Crea un archivo de API** (próximo paso):
```javascript
// src/api/documents.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const documentsApi = {
  getAll: () => api.get('/documents'),
  getById: (id) => api.get(`/documents/${id}`),
  create: (formData) => api.post('/documents', formData),
  // ... más métodos
};
```

3. **Reemplaza MOCK_DOCUMENTS** con llamadas a la API

## 🎯 Próximos Pasos Sugeridos

### Corto Plazo
1. ✅ Integrar con API real del backend
2. ✅ Implementar carga real de archivos
3. ✅ Agregar manejo de errores
4. ✅ Implementar loading states

### Mediano Plazo
1. ⏳ Autenticación y autorización
2. ⏳ Paginación de documentos
3. ⏳ Descarga de archivos
4. ⏳ Exportación de reportes

### Largo Plazo
1. 📋 Notificaciones en tiempo real
2. 📋 Historial de cambios
3. 📋 Firma digital
4. 📋 App móvil

## 🐛 Solución de Problemas

### El frontend no inicia
```bash
# Reinstala dependencias
rm -rf node_modules
npm install
npm run dev
```

### Error de conexión con backend
- Verifica que el backend esté corriendo en puerto 3001
- Revisa la variable `VITE_API_URL` en `.env`
- Verifica CORS en el backend

### Estilos no se aplican
- Los estilos se inyectan dinámicamente en `<head>`
- Verifica que `GLOBAL_CSS` se esté aplicando en `useEffect`

## 📝 Notas Importantes

1. **Datos Mock:** Actualmente usa datos de prueba. Para producción, conecta con el backend.

2. **Archivos:** La carga de archivos está simulada. Implementa la integración real con FormData.

3. **Autenticación:** No hay autenticación implementada. Agrégala antes de producción.

4. **Responsive:** Optimizado para desktop. Mobile requiere ajustes adicionales.

## 🎉 ¡Listo!

Tu frontend está completamente funcional. Solo necesitas:
1. ✅ Ejecutar `npm run dev`
2. ✅ Navegar por las secciones
3. ✅ Probar las funcionalidades

Para integración con backend real, consulta el `README.md`.

---

**¿Necesitas ayuda?** Revisa la consola del navegador para ver logs y errores.

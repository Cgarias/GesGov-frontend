# GesGov Frontend - Sistema de Gestión Documental

Frontend desarrollado con React + Vite para el sistema de gestión de documentos de la Alcaldía Municipal.

## 🚀 Características

- ✅ Interfaz moderna y responsiva
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión completa de documentos
- ✅ Formulario de radicación de documentos
- ✅ Sistema de alertas y notificaciones
- ✅ Filtros y búsqueda avanzada
- ✅ Modal de detalle de documentos
- ✅ Diseño institucional personalizado

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x
- Backend de NestJS corriendo en `http://localhost:3001`

## 🔧 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

El archivo `.env` ya está configurado:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

Si el backend corre en otro puerto, actualiza esta variable.

## ▶️ Ejecutar el Proyecto

### Modo desarrollo:
```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

### Modo producción:
```bash
npm run build
npm run preview
```

## 📂 Estructura del Proyecto

```
front/
├── src/
│   ├── App.jsx           # Componente principal con toda la aplicación
│   └── main.jsx          # Punto de entrada de React
├── index.html            # HTML base
├── .env                  # Variables de entorno
├── vite.config.js        # Configuración de Vite
└── package.json          # Dependencias
```

## 🎨 Componentes Principales

### Sidebar
- Navegación principal
- Alertas de documentos vencidos
- Información del usuario
- Modo colapsable

### Dashboard
- Estadísticas por estado
- Banner institucional
- Documentos urgentes
- Radicaciones recientes

### Gestión de Documentos
- Lista de documentos con filtros
- Búsqueda en tiempo real
- Vista de tarjetas
- Modal de detalle

### Formulario de Radicación
- Validación de campos
- Carga de archivos drag & drop
- Resumen antes de enviar
- Feedback visual

## 🎯 Estados de Documentos

| Estado | Color | Descripción |
|--------|-------|-------------|
| `PENDIENTE` | Azul | Sin fecha de respuesta asignada |
| `EN_PROCESO` | Azul claro | Más de 3 días restantes |
| `POR_VENCER` | Amarillo | 3 días o menos restantes |
| `VENCIDO` | Rojo | Fecha superada |
| `RESPONDIDO` | Verde | Marcado como respondido |

## 🎨 Paleta de Colores

```css
--navy:      #0D2545  /* Azul institucional principal */
--navy-mid:  #14376B  /* Azul medio */
--navy-lt:   #1B4F9C  /* Azul claro */
--gold:      #C9A84C  /* Dorado institucional */
--gold-lt:   #E8C97A  /* Dorado claro */
--gold-dk:   #A07828  /* Dorado oscuro */
```

## 📝 Datos Mock

Actualmente el frontend usa datos mock (MOCK_DOCUMENTS) para desarrollo. Para conectar con el backend real:

1. Asegúrate de que el backend esté corriendo
2. Verifica que `VITE_API_URL` apunte al backend
3. Reemplaza las funciones mock con llamadas a la API usando axios

## 🔄 Próximos Pasos

- [ ] Integrar con API real del backend
- [ ] Implementar autenticación
- [ ] Agregar paginación
- [ ] Implementar descarga de archivos
- [ ] Agregar exportación de reportes
- [ ] Implementar notificaciones en tiempo real
- [ ] Agregar tests unitarios

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Compilar para producción
npm run preview  # Preview de build de producción
npm run lint     # Linter
```

## 📱 Responsividad

El diseño está optimizado para:
- Desktop (1920px+)
- Laptop (1366px+)
- Tablet (768px+)
- Mobile (en desarrollo)

## 🎭 Tipografías

- **Títulos:** Libre Baskerville (serif)
- **Cuerpo:** Source Sans 3 (sans-serif)

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
# Subir carpeta dist/ a Vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

## 📄 Licencia

Proyecto privado - Alcaldía Municipal

---

**Desarrollado con React + Vite** ⚛️

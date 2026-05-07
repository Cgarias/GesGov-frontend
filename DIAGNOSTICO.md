# 🔍 Diagnóstico del Botón "Radicar Documento"

## Estado Actual
- ✅ Código del frontend está correctamente estructurado
- ✅ Logs de depuración agregados en todos los puntos clave
- ✅ Backend configurado correctamente con CORS
- ✅ Validación de formulario implementada
- ⚠️ El botón no responde al hacer clic

## Pasos para Diagnosticar

### 1️⃣ Verificar que el Backend esté corriendo

Abre una terminal en la carpeta `backend` y ejecuta:

```bash
cd backend
npm run start:dev
```

Deberías ver:
```
🚀 Backend corriendo en http://localhost:3001/api/v1
```

### 2️⃣ Verificar que el Frontend esté corriendo

Abre otra terminal en la carpeta `front` y ejecuta:

```bash
cd front
npm run dev
```

Deberías ver algo como:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3️⃣ Abrir la Consola del Navegador

1. Abre el navegador en `http://localhost:5173`
2. Presiona **F12** para abrir las DevTools
3. Ve a la pestaña **Console**
4. Limpia la consola (icono 🚫 o Ctrl+L)

### 4️⃣ Intentar Radicar un Documento

1. Haz clic en "Radicar Documento" en el sidebar
2. Completa el formulario:
   - **Título**: Escribe cualquier texto (ej: "Documento de prueba")
   - **Archivo**: Selecciona un archivo PDF o imagen
3. Haz clic en el botón **"Radicar Documento"**

### 5️⃣ Revisar los Logs en la Consola

Deberías ver una secuencia de logs como esta:

```
🔵 handleSubmit called
📝 Form data: {title: "...", description: "...", ...}
📎 File: File {name: "...", size: ..., type: "..."}
✅ Validation passed, submitting...
📤 Calling onSubmit...
🔵 useDocuments.createDocument called
📦 Payload: {title: "...", file: File, ...}
📤 Calling documentsApi.create...
🔵 documentsApi.create called
📦 Payload received: {title: "...", file: File, ...}
📤 Sending FormData to backend...
FormData entries:
  file: File
  title: ...
✅ Response from backend: {...}
✅ Document created successfully
```

## 🔴 Posibles Problemas y Soluciones

### Problema 1: No aparece ningún log
**Causa**: El evento submit no se está disparando

**Solución**:
1. Verifica que el botón tenga `type="submit"` ✅ (ya lo tiene)
2. Verifica que el botón no esté deshabilitado
3. Asegúrate de haber llenado el título y seleccionado un archivo

### Problema 2: Aparece "❌ Validation failed"
**Causa**: Falta el título o el archivo

**Solución**:
- Completa el campo **Título** (obligatorio)
- Selecciona un **Archivo** (obligatorio)

### Problema 3: Error "Network Error" o "ERR_CONNECTION_REFUSED"
**Causa**: El backend no está corriendo o está en un puerto diferente

**Solución**:
```bash
# En la carpeta backend
cd backend
npm run start:dev
```

Verifica que esté corriendo en el puerto 3001.

### Problema 4: Error 400 Bad Request
**Causa**: El backend está rechazando los datos

**Solución**:
1. Revisa los logs del backend en la terminal
2. Verifica que el archivo sea válido (PDF, imagen, Word, Excel)
3. Verifica que el archivo no supere 10MB

### Problema 5: Error CORS
**Causa**: El backend no permite peticiones desde el frontend

**Solución**:
Verifica que en `backend/src/main.ts` esté configurado CORS:
```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
});
```

### Problema 6: El botón está deshabilitado (gris)
**Causa**: Falta completar campos obligatorios

**Solución**:
El botón se habilita solo cuando:
- ✅ El campo **Título** tiene texto
- ✅ Se ha seleccionado un **Archivo**

Verifica que ambos campos estén completos.

## 🧪 Prueba Rápida del Backend

Abre una terminal y ejecuta:

```bash
curl http://localhost:3001/api/v1/documents
```

Deberías recibir una respuesta JSON (puede ser un array vacío `[]` si no hay documentos).

Si recibes un error de conexión, el backend no está corriendo.

## 📋 Checklist Final

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173
- [ ] Consola del navegador abierta (F12)
- [ ] Campo "Título" completado
- [ ] Archivo seleccionado
- [ ] Botón "Radicar Documento" habilitado (no gris)
- [ ] Logs aparecen en la consola al hacer clic

## 🆘 Si Nada Funciona

Ejecuta estos comandos para reiniciar todo:

```bash
# Detener ambos servidores (Ctrl+C en cada terminal)

# Backend
cd backend
npm install
npm run start:dev

# Frontend (en otra terminal)
cd front
npm install
npm run dev
```

Luego intenta de nuevo siguiendo los pasos 3-5.

## 📞 Información para Reportar

Si el problema persiste, copia y pega:

1. **Logs de la consola del navegador** (todo lo que aparezca)
2. **Logs de la terminal del backend** (errores en rojo)
3. **Responde estas preguntas**:
   - ¿El backend está corriendo? (sí/no)
   - ¿El frontend está corriendo? (sí/no)
   - ¿El botón está habilitado o deshabilitado?
   - ¿Aparece algún log en la consola al hacer clic?
   - ¿Qué error específico aparece?

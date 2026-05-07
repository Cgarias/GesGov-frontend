# ─── Etapa 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# ARG permite pasar la URL del backend en tiempo de build
ARG VITE_API_URL=http://localhost:3001/api/v1
ENV VITE_API_URL=$VITE_API_URL

# Compilar la aplicación
RUN npm run build

# ─── Etapa 2: Servidor Nginx ──────────────────────────────────────────────────
FROM nginx:alpine AS production

# Copiar build al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

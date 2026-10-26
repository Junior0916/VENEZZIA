# ── Etapa 1: Build Frontend ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifiestos de dependencias
COPY frontend/package.json frontend/package-lock.json ./

# Instala dependencias
RUN npm ci

# Copia el código fuente del frontend
COPY frontend/ .

# Variables de entorno para el build inyectadas por Dokploy
ARG VITE_POCKETBASE_URL
ARG VITE_CULQI_PUBLIC_KEY
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_CULQI_PUBLIC_KEY=$VITE_CULQI_PUBLIC_KEY

# Compila la aplicación en /app/dist
RUN npm run build

# ── Etapa 2: Servidor Nginx de Alta Disponibilidad ───────────────────────
FROM nginx:alpine AS production

# Configuración Nginx para SPA (soporte Vue 3 y compresión gzip)
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

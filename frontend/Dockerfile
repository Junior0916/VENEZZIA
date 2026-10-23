# ── Etapa 1: Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copia manifiestos de dependencias primero (caching de capas)
COPY package.json package-lock.json ./

# Instala dependencias de producción + dev (necesarias para el build)
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Variables de entorno en tiempo de build (Dokploy las inyecta aquí)
ARG VITE_POCKETBASE_URL
ARG VITE_CULQI_PUBLIC_KEY
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
ENV VITE_CULQI_PUBLIC_KEY=$VITE_CULQI_PUBLIC_KEY

# Compila la aplicación Vue 3 con Vite
RUN npm run build

# ── Etapa 2: Servidor Nginx (imagen mínima) ─────────────────────────────────
FROM nginx:alpine AS production

# Copia la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos compilados desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Expone el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

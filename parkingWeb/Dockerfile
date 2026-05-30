# PARTE 1: Construir el sitio (Vite/React)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL

RUN npx vite build

# PARTE 2: Servidor Web
FROM nginx:alpine
# Copiamos la carpeta 'dist' que generó la parte 1 al servidor Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Copiamos el archivo de configuración para que no fallen las rutas de React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

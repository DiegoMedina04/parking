# PARTE 1: Construir el código (TypeScript -> JS)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# PARTE 2: Correr la aplicación
FROM node:20-slim
WORKDIR /app
# Solo traemos lo necesario de la parte 1
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# Instalamos solo las librerías necesarias para que funcione (sin las de desarrollo)
RUN npm install --production

EXPOSE 3000
CMD ["node", "dist/index.js"]

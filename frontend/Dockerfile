# Dockerfile del frontend

# Usar una imagen base de Node.js
FROM node:18-alpine as builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración e instalar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Crear el build de la aplicación
RUN npm run build

# Usar una imagen final de nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html


# Exponer el puerto 80
EXPOSE 80

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]


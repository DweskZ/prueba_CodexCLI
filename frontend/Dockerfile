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

## Cambiar puerto a 8080 en el default.conf
RUN sed -i 's/80/8080/g' /etc/nginx/conf.d/default.conf

# Exponer el puerto 8080
EXPOSE 8080

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]


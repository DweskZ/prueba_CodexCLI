# Dockerfile del backend

# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración e instalar las dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Compilar la aplicación
RUN npm run build

# Exponer el puerto que utiliza tu aplicación
EXPOSE 8080

# Configurar la variable de entorno API_KEY
ENV API_KEY=be0d70e3b1dd6929968b214d9c0d7540

# Comando para ejecutar la aplicación
CMD ["npm", "start"]


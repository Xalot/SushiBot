# Usar la imagen base de Node.js
FROM node:14

# Crear y establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación correrá
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]

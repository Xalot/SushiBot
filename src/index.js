// Importación de módulos necesarios
const express = require('express'); // Importar Express para el servidor web
const path = require('path'); // Importar path para manejar rutas de archivos
const { startBot } = require('./chat'); // Importar la función startBot desde chat/index.js

const app = express(); // Crear una instancia de la aplicación Express

const PORT = process.env.PORT || 3000; // Configurar el puerto del servidor

// Ruta para servir el archivo HTML del código QR
app.get('/chatbot', (req, res) => {
  startBot(res); // Iniciar el bot y pasar la respuesta del servidor para servir el HTML
});

// Servir archivos estáticos desde el directorio src
app.use(express.static(path.join(__dirname, '/chat'))); // Ajustar la ruta a la carpeta donde está el archivo QR

// Iniciar el servidor y escuchar en el puerto configurado
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

# SushiBot

Este es un bot para WhatsApp que permite a los usuarios consultar el menú de un restaurante de sushi y obtener información sobre los productos y precios.

## Requisitos

- Node.js v20.13.1 o superior
- Google Chrome instalado

## Instalación

1. Clona este repositorio en tu máquina local:

git clone https://github.com/tu-usuario/sushibot.git

2. Navega a la carpeta del proyecto:

cd sushibot

3. Instala las dependencias:

npm install

Ejecución

Para iniciar el bot en modo desarrollo, ejecuta:

npm run dev

Estructura del Proyecto

SushiBot/
├── node_modules/
├── src/
│   ├── chat/
│   │   ├── Chat.js
│   │   ├── chatStates.js
│   │   ├── index.js
│   ├── menu/
│   │   ├── mainMenu.js
│   ├── index.js
├── package.json
├── package-lock.json
├── README.md

Uso

1.Abre tu navegador y navega a http://localhost:3000/chatbot.
2.Escanea el código QR con tu aplicación de WhatsApp para iniciar sesión.
3.Envía mensajes para interactuar con el bot y obtener información del menú.

Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un "issue" para discutir cualquier cambio que desees realizar.

Licencia

MIT

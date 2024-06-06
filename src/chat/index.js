const fs = require('fs');
const venom = require('venom-bot'); // Importar el módulo venom-bot para interactuar con WhatsApp
require('dotenv').config(); // Importar y configurar dotenv para el manejo de variables de entorno

const { Chat } = require('./Chat'); // Importar la clase Chat desde el archivo Chat.js
const { chatStates } = require('./chatStates'); // Importar los estados del chat desde el archivo chatStates.js

// HTML que contiene el código QR en una etiqueta <img>
const htmlResponse = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Escanea el código QR</title>
  </head>
  <body>
    <main
      style="display: flex; flex-direction: column; align-items: center"
    >
      <h2 style="text-align: center">Escanéa el código QR</h2>
      <img
        style="width: 500px; height: 500px; margin-top:20px;"
        alt="Código QR"
        src="/codigo-qr.png"
      />
    </main>
  </body>
</html>
`;

// Variable para almacenar la instancia del cliente de WhatsApp
let client;

// Función para iniciar el bot
async function startBot(res) {
  console.log('Iniciando');
  try {
    // Para cerrar adecuadamente el navegador si se recarga la página
    if (client) {
      await client.close();
      console.log('Cliente anterior cerrado');
    }
    client = await venom.create(
      'chat-session',
      // Función para exportar el código QR como imagen
      async (base64Qr, asciiQR, attempts, urlCode) => {
        console.log('Generando código QR');
        const matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches.length !== 3) {
          console.error('Invalid input string');
          return;
        }

        const response = {
          type: matches[1],
          data: Buffer.from(matches[2], 'base64'),
        };

        fs.writeFile(
          __dirname + '/codigo-qr.png',
          response.data,
          'binary',
          (err) => {
            if (err) {
              console.error(err);
            } else if (attempts === 1) {
              console.log('Código QR guardado como codigo-qr.png');
              res.send(htmlResponse);
              // Tiempo de espera para escanear el código
              setTimeout(() => {}, 180000);
            }
          }
        );
      },
      // Función para saber si ya se ha escaneado el QR
      (statusSession, session) => {
        console.log('Estado de la sesión: ', statusSession);
        if (statusSession === 'isLogged') {
          res.send('Ya has escaneado el código QR');
        }
      },
      {
        logQR: false,
        puppeteerOptions: {
          args: [
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--single-process',
            '--no-zygote',
          ],
          executablePath: '/usr/bin/google-chrome-stable',
        },
      }
    );

    console.log('Cliente iniciado');
    start(client);
  } catch (error) {
    console.error('Error iniciando el cliente:', error);
  }
}

// Hashmap que almacena cada una de las instancias "Chat"
// Utiliza como key el número de teléfono del usuario que manda mensaje
const chatInstances = new Map();

// Función para manejar los mensajes recibidos y responder al usuario
function start(client) {
  client.onMessage(async (payload) => {
    console.log('Mensaje recibido:', payload);
    const userPhone = payload.from;
    // Si no hay una instancia de "Chat" almacenada que corresponda al número de teléfono
    // implica que es el inicio de la conversación, se crea la instancia y se guarda en el hashmap
    let chat = chatInstances.get(userPhone);
    if (!chat) {
      chat = new Chat(client);
      chat.userPhone = userPhone;
      chatInstances.set(userPhone, chat);
    }
    // Se asigna el mensaje a la instancia
    chat.message = { content: payload.body, fromGroup: payload.isGroupMsg };

    try {
      await chat.replyToUser();
      if (chat.chatState.current.state === chatStates.onExit) {
        chatInstances.delete(userPhone);
      }
    } catch (err) {
      console.error('Error respondiendo al usuario:', err);
    }
  });

  // Manejar los cambios de estado de la conexión
  client.onStateChange((state) => {
    console.log('Estado de la conexión:', state);
    if ('CONFLICT'.includes(state)) client.useHere();
    if ('UNPAIRED'.includes(state)) console.log('Desconectado');
  });

  // Manejar los cambios de flujo de la conexión
  let time = 0;
  client.onStreamChange((state) => {
    console.log('Estado del flujo de conexión:', state);
    clearTimeout(time);
    if (state === 'DISCONNECTED' || state === 'SYNCING') {
      time = setTimeout(() => {
        client.close();
      }, 80000);
    }
  });
}

// Exportar la función startBot
module.exports = { startBot };

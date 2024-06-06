const { mainMenu } = require('../menu/mainMenu');
const { chatStates } = require('./chatStates');

class Chat {
  constructor(client) {
    this.client = client;
    this.userPhone = '';
    this.message = {};
    this.chatState = {
      current: { state: chatStates.onMainMenu, menu: mainMenu },
      prev: null
    };
    this.reply = '';  // Usar un campo público en lugar de uno privado
  }

  async replyToUser() {
    const category = this.message.content.trim();
    await this.handleCategorySelection(category);
  }

  async handleCategorySelection(category) {
    let responseText;

    switch (category) {
      case '1':
        responseText = `🍣 *Rollos de Sushi* 🍣
1. California Fray: $203
2. Cani Roll: $203
3. Ebi Roll: $203
4. El Nevadito: $203
5. Fray Roll: $203
6. Manchego Especial: $203
7. Okay Roll: $203
8. Queso Maki: $203
9. Sake Especial: $200
10. Shis Roll: $203`;
        break;
      case '2':
        responseText = `🥟 *Entradas* 🥟
- Tempura Roll: $203
- Yakitori: $125
- Gyozas: $90`;
        break;
      case '3':
        responseText = `🍨 *Postres* 🍨
- Banana Maki: $65
- Caramelo: $60
- Fresa: $60
- Gelatina de Café: $60
- Helado de Brandy: $65
- Tempura Helado: $65`;
        break;
      case '4':
        responseText = `🍹 *Bebidas* 🍹
- Agua: $25
- Boing Mango: $30
- Coca 600 ml: $35
- Manzanilla: $29
- Manzana Lift: $30
- Sangría 600 ml: $35
- Te-Limón: $29`;
        break;
      case '5':
        responseText = `🍙 *Bolitas de Arroz* 🍙
- Con Camarón y Queso: $110
- Con Queso Manchego y Camarón: $110
- Con Pollo y Queso: $110
- Con Salsa Kushiage y Empanizado: $110
- Con Tampico y Queso: $110`;
        break;
      case '6':
        responseText = `🍱 *Charolas* 🍱
- Charola 1: $491
- Charola 2: $574
- Charola 3: $491
- Charola 4: $591
- Charola 5: $646
- Charola 7: $339
- Charola 8: $313
- Charola 9: $478
- Charola 10: $313
- Charola 12: $385`;
        break;
      case '7':
        responseText = `🍚 *Gohan* 🍚
- Arroz al Vapor: $42
- Con Condimento de Camarón: $67
- Con Condimento de Salmón: $70
- Con Tampico: $67
- Especial: $83
- Gohan con Aguacate y Condimento de Camarón y Queso: $83
- Gohan Teriyaki de Camarón: $85
- Gohan Teriyaki de Pollo: $75`;
        break;
      case '8':
        responseText = `🍤 *Ordenes Adicionales* 🍤
- Aguacate: $25
- Brochetas de Queso: $30
- Brochetas Empanizadas: $40
- Camarón Empanizado: $50
- Pepino Rallado: $20
- Queso Extra: $25
- Salsa Chipotle: $15
- Salsa Tampico: $15`;
        break;
      case '9':
        responseText = `📦 *Paquetes* 📦
- Paquete 1: $200
- Paquete 2: $200
- Paquete 3: $200
- Paquete 4: $200
- Paquete 5: $220
- Paquete 6: $220
- Paquete 7: $210
- Paquete 8: $120
- Paquete 9: $120
- Paquete 10: $120`;
        break;
      case '10':
        await this.handleInfo();
        return;
      case '11':
        await this.handleTutorial();
        return;
      default:
        responseText = `⚠️ *Opción no válida*. Por favor, elige una opción del menú.`;
    }

    this.reply = responseText;
    return await this.sendReply();
  }

  async handleInfo() {
    this.reply = `🤖 *Información del Bot* 🤖

Este bot está diseñado solo para proporcionar información sobre nuestros productos y precios. Para realizar pedidos, por favor utiliza el catálogo de productos disponible en WhatsApp. 🛒📱

Puedes añadir productos al carrito de compras directamente desde el catálogo y proceder con tu pedido. ¡Gracias por tu comprensión! 😊`;

    this.updateState({
      current: { state: chatStates.onMainMenu, menu: mainMenu },
      prev: this.chatState.prev,
    });

    return await this.sendReply();
  }

  async handleTutorial() {
    this.reply = `📖 *Tutorial para Realizar Pedidos* 📖

1. Abre el catálogo de productos en WhatsApp.
2. Explora las categorías y selecciona los productos que deseas añadir al carrito.
3. Añade los productos al carrito y verifica tu selección.
4. Procede con el pago y confirma tu pedido.

¡Es muy fácil y rápido! 🛒😊

Si necesitas más ayuda, por favor contacta con nuestro equipo de soporte.`;

    this.updateState({
      current: { state: chatStates.onMainMenu, menu: mainMenu },
      prev: this.chatState.prev,
    });

    return await this.sendReply();
  }

  async sendReply() {
    try {
      await this.client.sendText(this.userPhone, this.reply);
      console.log(`Mensaje enviado a ${this.userPhone}: ${this.reply}`);
    } catch (err) {
      console.error('Error enviando el mensaje:', err);
    }
  }

  updateState(newState) {
    this.chatState.prev = this.chatState.current;
    this.chatState.current = newState;
  }
}

module.exports = { Chat };

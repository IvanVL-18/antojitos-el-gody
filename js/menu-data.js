/*
 * Menú y datos de Antojitos "El Gody".
 *
 * Para cambiar un precio: busca el platillo, cambia el número de `precio` y guarda.
 * Para agregar un platillo: copia una línea de `items` y cámbiale `id`, `nombre`,
 * `precio` y `pedido` (el `id` no se debe repetir).
 * Todo lo demás de la página (listón de precios, pedido, totales) se actualiza solo.
 */
window.GODY = {
  negocio: {
    nombre: 'Antojitos “El Gody”',
    direccion: 'C. Nacionalismo 377, Jagüey de Téllez, Hidalgo',

    // Número de WhatsApp para recibir pedidos: 52 + 10 dígitos, sin espacios.
    // Ejemplo: '527711234567'. Si se queda vacío, el cliente elige a quién mandar su pedido.
    whatsapp: '',

    mapsUrl: 'https://maps.app.goo.gl/KNUF6QfPcBpcCLHX7',
    lat: 19.982607,
    lng: -98.78892,

    // Texto que se muestra mientras no haya horario.
    dias: 'Abrimos los fines de semana',

    // Horario para que la página diga "Abierto ahorita" o "Hoy abrimos a las...".
    // Días: 0 domingo, 1 lunes, 2 martes, 3 miércoles, 4 jueves, 5 viernes, 6 sábado.
    // Ejemplo: [{ dias: [6, 0], abre: '17:00', cierra: '23:00' }]
    horario: [],

    pagos: 'Efectivo o tarjeta'
  },

  menu: [
    {
      id: 'chalupas',
      nombre: 'Chalupas',
      icono: 'chalupa',
      chiste: 'Una orden nunca es suficiente, pero es buen comienzo.',
      items: [
        { id: 'chalupas-papa-chorizo', nombre: 'Papa con chorizo', precio: 12, detalle: 'Orden de 4. Sueltas a $3 cada una.', pedido: 'Orden de chalupas de papa con chorizo' },
        { id: 'chalupas-papa-blanca', nombre: 'Papa blanca', precio: 12, detalle: 'Orden de 4. Sueltas a $3 cada una.', pedido: 'Orden de chalupas de papa blanca' },
        { id: 'chalupas-guisado', nombre: 'Guisado', precio: 16, detalle: 'Orden de 4. Sueltas a $4 cada una.', pedido: 'Orden de chalupas de guisado' }
      ]
    },
    {
      id: 'pambazos',
      nombre: 'Pambazos',
      icono: 'pambazo',
      chiste: 'Pan bañado en salsa y doradito. Vas a ocupar servilletas.',
      items: [
        { id: 'pambazo-papa-chorizo', nombre: 'Papa con chorizo y pollo', precio: 30, pedido: 'Pambazo de papa con chorizo y pollo' },
        { id: 'pambazo-papa-blanca', nombre: 'Papa blanca y pollo', precio: 30, pedido: 'Pambazo de papa blanca y pollo' },
        { id: 'pambazo-guisado', nombre: 'Guisado', precio: 35, pedido: 'Pambazo de guisado' }
      ]
    },
    {
      id: 'quesadillas',
      nombre: 'Quesadillas',
      icono: 'quesadilla',
      chiste: 'Con o sin queso, aquí no hay debate.',
      unidad: 'c/u',
      items: [
        { id: 'quesadilla-mollejas', nombre: 'Mollejas', precio: 20, pedido: 'Quesadilla de mollejas' },
        { id: 'quesadilla-huitlacoche', nombre: 'Huitlacoche', precio: 20, pedido: 'Quesadilla de huitlacoche' },
        { id: 'quesadilla-rajas', nombre: 'Rajas', precio: 20, pedido: 'Quesadilla de rajas' },
        { id: 'quesadilla-nopales-bistec', nombre: 'Nopales con bistec', precio: 20, pedido: 'Quesadilla de nopales con bistec' },
        { id: 'quesadilla-flor-calabaza', nombre: 'Flor de calabaza', precio: 20, pedido: 'Quesadilla de flor de calabaza' },
        { id: 'quesadilla-chicharron', nombre: 'Chicharrón prensado', precio: 20, pedido: 'Quesadilla de chicharrón prensado' },
        { id: 'quesadilla-champinones', nombre: 'Champiñones', precio: 20, pedido: 'Quesadilla de champiñones' },
        { id: 'quesadilla-tinga', nombre: 'Tinga', precio: 20, pedido: 'Quesadilla de tinga' },
        { id: 'quesadilla-mole-verde', nombre: 'Mole verde', precio: 20, pedido: 'Quesadilla de mole verde' }
      ]
    },
    {
      id: 'burritos',
      nombre: 'Burritos',
      icono: 'burrito',
      chiste: 'Para cuando el hambre viene en serio.',
      unidad: 'c/u',
      items: [
        { id: 'burrito-bistec', nombre: 'Bistec', precio: 45, pedido: 'Burrito de bistec' },
        { id: 'burrito-alambre', nombre: 'Alambre', precio: 45, pedido: 'Burrito de alambre' }
      ]
    },
    {
      id: 'tacos',
      nombre: 'Tacos',
      icono: 'tacos',
      chiste: 'El clásico que nunca falla.',
      items: [
        { id: 'tacos-bistec', nombre: 'Tacos de bistec', precio: 20, pedido: 'Tacos de bistec' }
      ]
    },
    {
      id: 'hamburguesas',
      nombre: 'Hamburguesas',
      icono: 'hamburguesa',
      chiste: 'Para los que no se deciden por un antojito.',
      items: [
        { id: 'hamburguesa', nombre: 'Hamburguesa', precio: 50, pedido: 'Hamburguesa' }
      ]
    },
    {
      id: 'hotdogs',
      nombre: 'Hot dogs',
      icono: 'hotdog',
      chiste: 'Ni de Nueva York ni de Sonora: de Téllez.',
      items: [
        { id: 'hotdog', nombre: 'Hot dog', precio: 25, pedido: 'Hot dog' }
      ]
    },
    {
      id: 'alitas',
      nombre: 'Alitas',
      icono: 'alitas',
      chiste: 'Las de mango habanero pican bonito.',
      items: [
        { id: 'alitas-bbq', nombre: 'BBQ', precio: 75, pedido: 'Alitas BBQ' },
        { id: 'alitas-mango-habanero', nombre: 'Mango habanero', precio: 75, pedido: 'Alitas mango habanero' }
      ]
    },
    {
      id: 'papas',
      nombre: 'Papas fritas',
      icono: 'papas',
      chiste: 'Con catsup, Valentina o mayonesa. O las tres, no te juzgamos.',
      items: [
        { id: 'papas-fritas', nombre: 'Orden de papas', precio: 50, detalle: 'Con catsup, Valentina o mayonesa.', pedido: 'Orden de papas fritas' }
      ]
    },
    {
      id: 'postres',
      nombre: 'Postres',
      icono: 'postre',
      chiste: 'El postre va en otro estómago. Es ciencia.',
      items: [
        { id: 'postre-pastel-helado', nombre: 'Pastel helado', precio: 25, pedido: 'Pastel helado' },
        { id: 'postre-concha-rellena', nombre: 'Concha rellena', precio: 30, pedido: 'Concha rellena' },
        { id: 'postre-ensalada-betabel', nombre: 'Ensalada de betabel', precio: 25, pedido: 'Ensalada de betabel' },
        { id: 'postre-ensalada-manzana', nombre: 'Ensalada de manzana', precio: 20, pedido: 'Ensalada de manzana' },
        { id: 'postre-bunuelos', nombre: 'Buñuelos', precio: 10, pedido: 'Buñuelos' }
      ]
    },
    {
      id: 'bebidas',
      nombre: 'Bebidas',
      icono: 'bebida',
      chiste: 'Para bajarte el picor.',
      unidad: 'c/u',
      letraChiquita: 'Café y té: cortesía de la casa.',
      items: [
        { id: 'bebida-jarritos', nombre: 'Jarritos', precio: 20, pedido: 'Jarritos' },
        { id: 'bebida-coca', nombre: 'Coca-Cola', precio: 20, pedido: 'Coca-Cola' },
        { id: 'bebida-boing-mango', nombre: 'Boing de mango', precio: 20, pedido: 'Boing de mango' },
        { id: 'bebida-agua-frutas', nombre: 'Agua de frutas', precio: 20, pedido: 'Agua de frutas' }
      ]
    }
  ]
};

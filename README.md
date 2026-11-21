# Antojitos “El Gody”

Menú en línea de Antojitos “El Gody”, en Jagüey de Téllez, Hidalgo: platillos, precios, cómo llegar y un pedido que se arma en el teléfono y se manda por WhatsApp.

**Página:** https://antojitos-el-gody-zku9.vercel.app/ (también se publica una copia en https://ivanvl-18.github.io/antojitos-el-gody/)

## Cambiar precios o platillos

Todo el menú vive en **`js/menu-data.js`**. Cambia el `precio` del platillo, guarda y sube el cambio:

```bash
git add js/menu-data.js
git commit -m "Actualiza precios"
git push
```

Vercel y GitHub Pages publican solos en uno o dos minutos. El listón de precios, las estampas de “desde $…” y los totales del pedido se calculan solos.

En ese mismo archivo, dentro de `negocio`:

| Campo | Para qué sirve |
| --- | --- |
| `whatsapp` | Número que recibe los pedidos (`52` + 10 dígitos, sin espacios). Vacío = el cliente elige a quién mandarlo. |
| `horario` | Con días y horas, la página dice “Abierto ahorita” o “Hoy abrimos a las…”. Ejemplo: `[{ dias: [6, 0], abre: '17:00', cierra: '23:00' }]` (0 = domingo, 6 = sábado). |
| `dias` | Texto que se muestra mientras no haya horario. |
| `pagos` | Formas de pago que se muestran abajo. |
| `letraChiquita` (en Bebidas) | La nota de café y té de cortesía. Bórrala si ya no aplica. |

## Vista previa al compartir (WhatsApp y Facebook)

La imagen está en `img/og-image.jpg` (1200 × 630). Si la cambias, sube también el número de `?v=2` en las etiquetas `og:image` de `index.html` para que WhatsApp y Facebook no muestren la vieja. Para refrescar Facebook al instante: https://developers.facebook.com/tools/debug/

## Ver la página en tu computadora

```bash
python -m http.server 8000
```

Y abre http://localhost:8000

## Cómo está hecha

HTML, CSS y JavaScript sin dependencias ni paso de compilación, para que GitHub Pages la publique tal cual desde la rama `main`.

```
index.html          Estructura, metadatos para compartir e ilustraciones (sprite SVG)
css/styles.css      Estilos
js/menu-data.js     Menú, precios y datos del negocio
js/app.js           Menú, barra de categorías, pedido, horario y botón de compartir
img/                Imagen para compartir e íconos
fonts/              Shrikhand y Baloo 2 (licencia SIL Open Font License)
404.html            Página para enlaces rotos
```

Las ilustraciones de los platillos están dibujadas en SVG para esta página. Si tienes fotos reales de tus platillos, se pueden poner en su lugar.

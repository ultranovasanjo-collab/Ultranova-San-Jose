# UltraNova San José · Sitio web (Lista de Precios 2026)

Sitio estático (sin servidor ni base de datos). Todo vive en la raíz, sin carpetas.

## Qué trae cada archivo

| Archivo | Para qué sirve | ¿Lo vas a editar? |
|---|---|---|
| `precios.js` | **Todos los precios** (lista, cotizador y kits) | Sí, cuando cambie la lista |
| `config.js` | WhatsApp, Instagram, **tema de color**, dirección, horarios, opiniones, kits sí/no | Sí |
| `galeria.js` | **Fotos de antes y después** (lista de fotos) | Sí, cada vez que subas fotos |
| `index.html` | Textos, preguntas frecuentes, SEO | Rara vez |
| `style.css` | Diseño y los 6 temas de color | Rara vez |
| `app.js` | Lógica: pestañas, cotizador, PDF | No |
| `jspdf.min.js` | Librería del PDF (copia propia, por la política de seguridad) | No |
| `logo.png`, `logo-blanco.png`, `logo-mark.png` | Logo (fondo transparente) | Solo para reemplazar |
| `favicon.svg`, `og-image.png` | Ícono de pestaña e imagen al compartir el enlace | Opcional |
| `qr-whatsapp.svg`, `qr-instagram.svg` | Códigos QR descargables | No |
| `sitemap.xml`, `robots.txt` | SEO | Si cambia el dominio |
| `_headers` | Cabeceras de seguridad (solo Cloudflare Pages/Netlify; GitHub Pages las ignora) | No |

## Cómo subirlo a GitHub (sin carpetas)

1. Descomprime el zip. Entra a la carpeta y selecciona **todos los archivos de adentro** (no la carpeta).
2. En el repositorio: **Add file → Upload files** y arrastra los archivos sueltos.
3. Escribe un mensaje (ej. "Sitio lista 2026") y pulsa **Commit changes**.
4. Los archivos con el mismo nombre se reemplazan solos. Espera 1 a 2 minutos.
5. Abre el sitio y pulsa **Ctrl + Shift + R** (en celular, abre en pestaña privada) para saltarte la caché.

## Cambios frecuentes

- **Lista de precios nueva:** pásale el Word a Claude y te devuelve un único `precios.js`. Se sube ese solo archivo.
- **Cambiar de color:** en `config.js`, línea `tema:`. Opciones: `marino-dorado` (oficial), `esmeralda`, `vino`, `grafito`, `oceano`, `noche`.
- **Ocultar los kits de mecanismo:** `mostrarKits: false` en `config.js`.
- **Dirección y horarios:** la dirección ya está cargada; agrega `horarios` en `config.js`. Lo vacío no se muestra.
- **Galería antes/después:** sube las fotos a la raíz del repositorio, anótalas en `galeria.js` y sube ese archivo para reemplazar el anterior (instrucciones dentro del archivo).
- **Opiniones:** en `config.js`, solo reales.
- **Fotos reales en el cotizador:** `fotosTipos` en `config.js` reemplaza las ilustraciones.
- **Logo nuevo:** reemplaza `logo.png` (fondo transparente). `logo-blanco.png` es la versión para fondos oscuros.

## Seguridad

- La cuenta de GitHub debe tener **verificación en dos pasos**.
- El sitio no tiene backend ni formularios. La política de contenido (CSP) solo permite recursos propios; el texto se inserta como texto, no como HTML.
- Los datos de la cotización nunca salen del navegador, salvo que el usuario pulse enviar por WhatsApp.

## SEO: siguientes pasos

1. Google Search Console: agrega la URL del sitio y envía `sitemap.xml`.
2. Perfil de Negocio de Google (cuando haya dirección y horarios).
3. Dominio propio (ej. `ultranovasanjose.com`): al cambiarlo, reemplaza `ultranovasanjo-collab.github.io/Ultranova-San-Jose` en `index.html` (canonical, og:url, og:image, JSON-LD), `sitemap.xml` y `robots.txt`.
4. La dirección ya está en el bloque JSON-LD de `index.html`; si cambia, actualízala también ahí.

## Comunicación

Evitar afirmaciones sanitarias absolutas ("elimina ácaros", "desinfecta 100 %", "ambientes más saludables") mientras no haya evidencia técnica del proceso. Se puede hablar de limpieza profunda, mantenimiento especializado, conservación y tecnología ultrasónica.

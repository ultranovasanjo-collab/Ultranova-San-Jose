# UltraNova San José — sitio web

Sitio estático (HTML + CSS + JS). Sin backend, sin base de datos, sin formularios, sin librerías externas: no hay nada que "hackear" en el servidor.

## Qué editar
- `assets/app.js`, bloque CONFIG: WhatsApp, dirección, horarios, galería de fotos y opiniones.
- `assets/app.js`, bloque PRECIOS: lista de precios y recargos.
- Fotos: carpeta `assets/fotos/` (JPG/PNG/WebP).
- Logo: guarde `assets/logo.png` y reemplace el bloque `<svg class="mark">` del header en `index.html` por `<img src="assets/logo.png" alt="UltraNova San José" height="34">`.

## Seguridad
- CSP estricta (solo recursos propios, sin scripts inline).
- Todo texto dinámico se inserta con `textContent` (nunca `innerHTML`).
- Enlaces externos con `rel="noopener noreferrer"`.
- `_headers`: cabeceras completas si lo sirve Cloudflare Pages o Netlify.

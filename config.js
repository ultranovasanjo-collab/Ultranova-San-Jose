/* ============================================================
   CONFIG.JS · Datos del negocio y apariencia · UltraNova San José
   ------------------------------------------------------------
   Aquí se cambia lo que NO son precios: contacto, tema de color,
   dirección, horarios, fotos y opiniones.
   Lo que dejes vacío ("" o []) simplemente no se muestra.
   ============================================================ */
window.CONFIG = {
  negocio: "UltraNova San José",
  eslogan: "Como nuevas y sin cambiarlas.",
  promesa: "Tecnología que renueva. Confianza que permanece.",

  /* ---- Contacto ---- */
  whatsapp: "573213183368",          // solo números, con indicativo de país
  whatsappVisible: "321 318 3368",
  instagram: "ultranovasanjose",     // sin @
  urlSitio: "https://ultranovasanjo-collab.github.io/Ultranova-San-Jose/",

  /* ---- Apariencia ----
     Temas disponibles (elige uno):
       "marino-dorado"  → identidad oficial (por defecto)
       "esmeralda"      → verde profundo y champán
       "vino"           → vino tinto y oro
       "grafito"        → grafito y cobre
       "oceano"         → azul petróleo y turquesa
       "noche"          → modo oscuro con dorado                      */
  tema: "marino-dorado",

  /* ---- Opciones ---- */
  mostrarKits: true,     // false = oculta los kits de mecanismo (lista y cotizador)
  validezDias: 0,        // días de validez de la cotización (0 = no mostrar)

  /* ---- Se muestran solo si tienen datos ---- */
  direccion: "Carrera 52C # 44-19 Sur, Bogotá",
  mapaUrl: "https://www.google.com/maps/search/?api=1&query=Carrera+52C+%2344-19+Sur%2C+Bogot%C3%A1",
  horarios: ["Lunes a viernes: 8:00 a. m. a 5:00 p. m.", "Cualquier duda, escríbenos por WhatsApp."],

  /* La galería de antes y después se maneja en su propio archivo: galeria.js */

  /* Opiniones REALES de clientes (no inventar):
     { nombre: "Nombre", texto: "Lo que dijo el cliente" } */
  opiniones: [],

  /* Fotos reales para el cotizador (reemplazan las ilustraciones).
     Ej: { enrollable: "foto-enrollable.jpg", romana: "foto-romana.jpg" }
     Ids: enrollable, romana, sheer, royal, vertesse, celular, verticales,
          aluminio, madera, tradicional, tapetes, panel                      */
  fotosTipos: {}
};

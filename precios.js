/* ============================================================
   PRECIOS.JS · Lista de Precios 2026 · UltraNova San José
   ------------------------------------------------------------
   Este es el ÚNICO archivo con valores en pesos.
   Cuando llegue una lista nueva, solo se cambian los números
   (p, p2, precio, recargo) y los textos (d, nombre, incluye).
   NO cambies los "id": el cotizador los usa para calcular.
   ============================================================ */
window.PRECIOS = {
  version: "Lista de Precios 2026",
  entrega: "3 a 5 días hábiles",
  motorizadaRecargo: 40000, // por cortina
  notaKits: "Precio promedio de los tamaños disponibles. No incluye soportes ni uñas.",

  categorias: [
    {
      id: "enrollable",
      nombre: "Enrollable",
      columnas: ["Sin casetera", "Con casetera"],
      filas: [
        { id: "enr_h1", d: "Lavado Enrollable hasta 1 MT2", p: 31500, p2: 35400 },
        { id: "enr_h6", d: "Lavado Enrollable de 1 a 6 MT2", p: 59000, p2: 65500 },
        { id: "enr_m6", d: "Lavado Enrollable más de 6 MT2", p: 72100, p2: 78600 }
      ],
      kits: ["k_cadena"]
    },
    {
      id: "romana",
      nombre: "Romana · Persiana Viewtex",
      filas: [
        { id: "rom_h1", d: "Lavado Romana hasta 1 MT2", p: 56300 },
        { id: "rom_h6", d: "Lavado Romana de 1 a 6 MT2", p: 94200 },
        { id: "rom_m6", d: "Lavado Romana más de 6 MT2", p: 98300 }
      ],
      kits: ["k_rom_continua", "k_rom_semi"]
    },
    {
      id: "sheer",
      nombre: "Sheer Elegance",
      filas: [
        { id: "she_h1", d: "Lavado Sheer hasta 1 MT2", p: 56300 },
        { id: "she_h6", d: "Lavado Sheer de 1 a 6 MT2", p: 111400 },
        { id: "she_m6", d: "Lavado Sheer más de 6 MT2", p: 117900 }
      ],
      nota: "El lavado incluye refilada cuando la tela viene deshilada.",
      kits: ["k_cadena"],
      notaKit: "Usa el mismo kit del Enrollable."
    },
    {
      id: "royal",
      nombre: "Sheer Royal · Nuance",
      filas: [
        { id: "roy_h1", d: "Lavado Sheer Royal-Nuance hasta 1 MT2", p: 83800 },
        { id: "roy_h6", d: "Lavado Sheer Royal-Nuance de 1 a 6 MT2", p: 137600 },
        { id: "roy_m6", d: "Lavado Sheer Royal-Nuance más de 6 MT2", p: 150700 }
      ],
      kits: []
    },
    {
      id: "vertesse",
      nombre: "Vertesse · Sheer Vertical",
      filas: [
        { id: "ver_h1", d: "Lavado Vertesse hasta 1 MT2", p: 125700 },
        { id: "ver_h3", d: "Lavado Vertesse de 1 a 3 MT2 Ancho", p: 248800 },
        { id: "ver_extra", d: "Cada 50 CM adicional en la misma cortina, recargo", p: 38900 }
      ],
      kits: []
    },
    {
      id: "celular",
      nombre: "Cortina Celular",
      filas: [
        { id: "cel_s_h1", d: "Lavado Sencilla (solo Velo o solo Blackout) hasta 1 MT2", p: 111400 },
        { id: "cel_s_h6", d: "Lavado Sencilla (solo Velo o solo Blackout) de 1 a 6 MT2", p: 209500 },
        { id: "cel_s_m6", d: "Lavado Sencilla (solo Velo o solo Blackout) más de 6 MT2", p: 225200 },
        { id: "cel_d_h1", d: "Lavado Doble (Velo + Blackout) hasta 1 MT2", p: 153200 },
        { id: "cel_d_h6", d: "Lavado Doble (Velo + Blackout) de 1 a 6 MT2", p: 224000 },
        { id: "cel_d_m6", d: "Lavado Doble (Velo + Blackout) más de 6 MT2", p: 255400 }
      ],
      kits: []
    },
    {
      id: "verticales",
      nombre: "Verticales",
      filas: [
        { id: "vrt_lama", d: "Lavado de Lamas (Unidad)", p: 7400 },
        { id: "vrt_lama100", d: "Lavado de Lamas más de 100 unidades", p: 6100 },
        { id: "vrt_riel", d: "Lavado de Riel - Cambio de Cordón - Lubricación", p: 98300 }
      ],
      kits: ["k_vertical"]
    },
    {
      id: "aluminio",
      nombre: "Persianas de Aluminio",
      filas: [
        { id: "alu_h1", d: "Lavado de Persiana Aluminio hasta 1 MT2", p: 62900 },
        { id: "alu_h6", d: "Lavado de Persiana Aluminio de 1 a 6 MT2", p: 91700 },
        { id: "alu_m6", d: "Lavado de Persiana Aluminio más de 6 MT2", p: 99500 },
        { id: "alu_cordon", d: "Mano de obra cambio de cordón o escalerilla por persiana", p: 59000 }
      ],
      kits: []
    },
    {
      id: "madera",
      nombre: "Persianas de Madera",
      filas: [
        { id: "mad_h6", d: "Limpieza y lubricación Persiana Madera de 1 a 6 MT2", p: 111400 },
        { id: "mad_m6", d: "Limpieza y lubricación Persiana Madera más de 6 MT2", p: 134900 },
        { id: "mad_cordon", d: "Mano de obra cambio de cordón o escalerilla por persiana", p: 59000 }
      ],
      kits: ["k_madera"]
    },
    {
      id: "tradicional",
      nombre: "Cortinas Tradicionales",
      subtitulo: "Precio por metro lineal",
      filas: [
        { id: "tra_velo", d: "Cortina en Velo ML (dobladillo)", p: 14400 },
        { id: "tra_pesada", d: "Cortina Pesada ML (dobladillo)", p: 18400 },
        { id: "tra_forrada", d: "Cortina Forrada ML (dobladillo)", p: 32800 },
        { id: "tra_gal_ondas", d: "Galerías Ondas y Cascadas hasta 3 ML", p: 125700 },
        { id: "tra_gal_tap", d: "Galería Tapizada hasta 3 ML", p: 95600 }
      ],
      kits: ["k_riel_trad"]
    },
    {
      id: "tapetes",
      nombre: "Lavado de Tapetes",
      filas: [
        { id: "tap_liso", d: "Lavado Tapete MT2 Liso", p: 60200 }
      ],
      kits: []
    },
    {
      id: "panel",
      nombre: "Panel Japonés",
      filas: [
        { id: "pan_telo", d: "Lavado Telo (Unidad)", p: 24800 },
        { id: "pan_velcro", d: "Cambio de Velcro (Unidad)", p: 9200 },
        { id: "pan_riel", d: "Lavado de Riel - Cambio de Cordón - Lubricación", p: 98300 }
      ],
      kits: ["k_panel"]
    }
  ],

  /* Kits de mecanismo (precio por unidad) */
  kits: [
    { id: "k_cadena", nombre: "KIT mecanismo de cadena", incluye: "Incluye: control (mecanismo), cadena de 2 m, conector y tensor de cadena.", precio: 14900, grupo: "Enrollable y Sheer Elegance" },
    { id: "k_rom_continua", nombre: "KIT mecanismo cadena continua", incluye: "Incluye: control de cadena continua y cadena cerrada de 2,5 m.", precio: 12200, grupo: "Romana" },
    { id: "k_rom_semi", nombre: "KIT mecanismo semiautomático", incluye: "Incluye: control semiautomático y cadena cerrada de 2,5 m.", precio: 33500, grupo: "Romana" },
    { id: "k_vertical", nombre: "KIT mecanismo (control, cadena y cordón)", incluye: "Incluye: control vertical, cadena de 2 m y cordón de 4 m.", precio: 9400, grupo: "Verticales" },
    { id: "k_madera", nombre: "KIT mecanismo de cordón", incluye: "Incluye: cordón de 4 m e igualador de cordón.", precio: 1400, grupo: "Persianas de madera" },
    { id: "k_riel_trad", nombre: "KIT mecanismo de cordón", incluye: "Incluye: cordón de 3 m y cruzador con brazo.", precio: 4200, grupo: "Riel de cortinas tradicionales" },
    { id: "k_panel", nombre: "KIT mecanismo de cordón", incluye: "Incluye: cordón de 5 m y tensor pesa elipse.", precio: 6500, grupo: "Panel japonés" }
  ]
};

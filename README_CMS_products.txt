QUÉ INCLUYE
- assets/css/fixes.css        → corrige el recorte al hacer scroll y activa el subrayado dorado dinámico
- assets/js/section-active.js → detecta la sección activa y mueve el subrayado
- assets/js/render-products.js→ pinta las tarjetas desde content/products/products.json
- admin/config.yml            → añade una colección para editar la lista de productos en el panel
- content/products/products.json → archivo editable desde /admin

CÓMO USAR
1) Sube estos archivos respetando las rutas.
2) En index.html:
   - En la sección de productos, deja un contenedor vacío con id="products-cards":
       <div class="cards" id="products-cards"></div>
   - Asegúrate de cargar los scripts y css nuevos:
       <link rel="stylesheet" href="/assets/css/fixes.css">
       <script src="/assets/js/section-active.js" defer></script>
       <script src="/assets/js/render-products.js" defer></script>
3) En /admin, edita “Productos (lista)” para añadir/quitar productos.
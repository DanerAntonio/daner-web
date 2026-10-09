# Plantilla web reutilizable para restaurantes

Primera versión de Daner Web: sitio adaptable a celulares, con contenido configurable desde `config.js`.

## Cómo probarla en Windows
1. Descarga y extrae el archivo ZIP.
2. Abre la carpeta.
3. Haz doble clic en `index.html` para abrirlo en tu navegador.
4. Para personalizar el sitio, abre `config.js` con Visual Studio Code o el Bloc de notas.
5. Cambia el nombre, teléfono de WhatsApp, dirección, horarios, colores, imágenes y productos.
6. Guarda y recarga `index.html`.

## Cómo ponerla en GitHub Pages
1. Crea un repositorio nuevo en GitHub, por ejemplo `daner-web-restaurante`.
2. Sube los archivos `index.html`, `styles.css`, `config.js`, `script.js` y `README.md` a la raíz del repositorio.
3. En el repositorio entra a **Settings → Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, y guarda.
6. Espera a que GitHub publique el sitio; la dirección aparecerá en esa misma sección.

## Crear una versión para otro cliente
Edita los datos de `config.js` y reemplaza las imágenes por imágenes que el cliente tenga derecho a usar. Para un proyecto de varios clientes administrados desde un solo panel, más adelante tendremos que añadir almacenamiento, autenticación y una arquitectura multi-cliente.

## Nota
Esta versión es una plantilla inicial: no incluye panel administrativo, base de datos, carrito ni sistema de pagos. Los pedidos se inician por WhatsApp.

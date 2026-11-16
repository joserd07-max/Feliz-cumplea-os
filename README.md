# ETERNAL LOVE

Página de cumpleaños hecha con HTML, CSS y JavaScript. No necesita instalar programas, usar Node.js ni compilarse: abre `index.html` para verla.

## Archivos principales

- `index.html`: estructura y título de la página.
- `styles.css`: diseño adaptable a computadoras y celulares.
- `script.js`: carta, carrusel automático, lluvia de corazones y reproductor.
- `assets/images/`: fotografías del carrusel.
- `assets/audio/`: canción de la página.

## Personalizar

Los textos de la carta, el saludo, la canción y la lista de fotos están al inicio de `script.js`, en el objeto `content`. Las fotos y el audio deben estar dentro de `assets/`; usa sus rutas relativas, por ejemplo `assets/images/mi-foto.jpg`.

La reproducción automática depende de las reglas del navegador. Si el navegador bloquea el sonido al entrar, la página intenta iniciarlo con el primer toque o clic.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube los archivos de este proyecto manteniendo las carpetas `assets/images` y `assets/audio`.
2. En el repositorio, abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**, elige la rama `main` y la carpeta `/(root)`, y pulsa **Save**.
4. GitHub publicará el sitio y mostrará el enlace en esa misma sección.

No cambies los nombres de las carpetas `assets` ni de `index.html`: la página usa rutas relativas y funciona también bajo la dirección de un repositorio de GitHub Pages.

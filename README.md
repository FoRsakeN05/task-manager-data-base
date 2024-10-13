Instrucciones para ejecutar el proyecto
Requisitos previos
Antes de ejecutar este proyecto, asegúrate de tener instalados los siguientes componentes:

Node.js: Puedes descargar e instalar Node.js desde su página oficial. Asegúrate de instalar también el gestor de paquetes npm, que viene con Node.js.
Git: Para clonar el repositorio, debes tener instalado Git. Puedes descargarlo desde su página oficial.
SQLite: Este proyecto usa SQLite como base de datos, y no requiere configuración adicional si tienes SQLite disponible.

Configuración del backend (servidor)
Instala las dependencias del servidor. En el directorio raíz del proyecto, ejecuta:

bash

npm install

Inicia el servidor ejecutando el siguiente comando:

bash

node server.js
Esto iniciará el servidor en http://localhost:3000. Asegúrate de que este puerto esté libre. Si deseas cambiar el puerto, puedes modificar el archivo server.js.

Configuración del frontend
El frontend está ubicado en el archivo index.html. No necesitas instalar dependencias adicionales para el frontend.

Para abrir el frontend, simplemente abre el archivo index.html en tu navegador.

Alternativamente, si deseas usar un servidor de desarrollo como Live Server para facilitar la recarga automática, sigue estos pasos:

Si tienes instalado Visual Studio Code, puedes utilizar la extensión Live Server.
Abre la carpeta del proyecto en Visual Studio Code, haz clic derecho en index.html, y selecciona Open with Live Server.
Conexión entre el frontend y el backend
Una vez que el servidor esté en funcionamiento, el frontend se conectará automáticamente con el backend a través de las llamadas fetch hacia http://localhost:3000. Asegúrate de que el servidor esté corriendo antes de interactuar con la aplicación en el navegador.


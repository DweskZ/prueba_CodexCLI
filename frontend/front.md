 Estructura de Componentes del Dashboard del Clima
Componentes y funciones
AuthForm.vue (FormularioAuth.vue):
Este componente maneja toda la autenticación del usuario, tanto el inicio de sesión como el registro de nuevos usuarios. Muestra los dos formularios (login y registro) y emite eventos hacia el componente principal para que se procese la acción correspondiente. Además, muestra mensajes de error si ocurre algún problema con la autenticación.

HeaderBar.vue (BarraCabecera.vue):
Es la barra superior del dashboard. Aquí se muestra el nombre de la aplicación, el correo electrónico del usuario que ha iniciado sesión y un botón para cerrar sesión. Al pulsar el botón, se emite un evento para cerrar la sesión y volver a la pantalla de autenticación.

WeatherSearch.vue (BuscarClima.vue):
Este componente contiene el formulario para que el usuario pueda buscar el clima de una ciudad. Al enviar la búsqueda, se emite un evento para que el componente principal realice la consulta correspondiente y actualice el historial de búsquedas.

WeatherHistory.vue (HistorialClima.vue):
Este componente muestra el historial de búsquedas de clima que ha realizado el usuario. Si no existen búsquedas, muestra un mensaje informativo. Si hay búsquedas, presenta una lista de tarjetas, una por cada consulta realizada.

WeatherCard.vue (TarjetaClima.vue):
Es la tarjeta individual donde se presentan los detalles de una búsqueda de clima. Incluye la ciudad, el país, la fecha y hora de la consulta, la descripción y el icono del clima, la temperatura, la sensación térmica, la humedad, la velocidad del viento y (opcionalmente) el correo del usuario que hizo la búsqueda.

App.vue
Este archivo es el componente principal de la aplicación y actúa como el "controlador" general del flujo.
Su función principal es orquestar y conectar todos los demás componentes y manejar el estado global de la app, como la sesión del usuario, los mensajes de autenticación y el historial de búsquedas.

¿Qué hace App.vue?
Maneja el estado del usuario:
Guarda en una variable reactiva si el usuario está autenticado (y su información, como el correo). Esto se mantiene sincronizado con el almacenamiento local del navegador para que la sesión persista al recargar la página.

Controla qué componentes se muestran:
Si el usuario no está autenticado, muestra el formulario de login/registro (AuthForm.vue).
Si el usuario está autenticado, muestra el dashboard completo: barra superior (HeaderBar.vue), formulario de búsqueda (WeatherSearch.vue), historial de búsquedas (WeatherHistory.vue) y el pie de página.

Procesa los eventos de login y registro:
Escucha los eventos emitidos por AuthForm.vue y, según corresponda, envía la información al backend para iniciar sesión o registrar un nuevo usuario. Actualiza el estado del usuario y muestra mensajes de error si algo falla.

Gestiona el logout:
Cuando el usuario pulsa el botón de cerrar sesión en la barra superior, App.vue limpia el estado, borra el usuario del almacenamiento local y muestra nuevamente el formulario de autenticación.

Maneja la búsqueda y el historial:
Recibe la ciudad a buscar desde el formulario WeatherSearch.vue, consulta el backend y luego actualiza el historial mostrado en WeatherHistory.vue.

Carga el historial al iniciar:
Si el usuario ya estaba autenticado al abrir la aplicación, App.vue recupera automáticamente su historial de búsquedas.

En resumen:
App.vue es el corazón de la aplicación. Se encarga de mostrar el contenido correcto según el estado del usuario, conectar los componentes entre sí, y mantener sincronizada la información entre la interfaz, el almacenamiento local y el backend.
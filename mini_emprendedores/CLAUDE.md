@AGENTS.md
**Reglas Estrictas de Desarrollo (¡CRÍTICO!):**

1.  **Codificación de Texto:** Utiliza EXCLUSIVAMENTE caracteres UTF-8 nativos. Escribe las eñes (ñ, Ñ) y las vocales con tilde (á, é, í, ó, ú) directamente en el texto. BAJO NINGUNA CIRCUNSTANCIA utilices secuencias de escape unicode (como `\u00f1` o `\u00e1`), caracteres de reemplazo, ni entidades HTML.
2.  **Arquitectura y Simplicidad:** Escribe código React simple, plano y fácil de mantener. Evita estructuras lógicas complejas, abstracciones innecesarias y operadores ternarios encadenados.
3.  **Modularidad:** Si un componente supera las 100 líneas o tiene demasiadas responsabilidades, divídelo en componentes más pequeños, funcionales y legibles.
4.  **Idioma del Código:** Mantén todos los nombres de variables, propiedades (`props`), funciones y archivos en Inglés.
5.  **Idioma de la Interfaz:** Todo el texto estático visible para el usuario debe estar en Español con una ortografía impecable.
6.  **Props Dinámicas:** Estructura los componentes para que reciban la información a través de `props` o arreglos de configuración, facilitando la futura conexión con el backend.

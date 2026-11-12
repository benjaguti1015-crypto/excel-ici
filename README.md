# Excel ICI

Juego interactivo para aprender Excel en la ayudantía: materia corta, quizzes y un mini Excel que corrige al instante. El estudiante solo escribe su nombre; el avance se guarda en su navegador.

## Usarlo

Es un sitio estático, sin instalación ni servidor.

- **Local:** abre `index.html` en el navegador.
- **Con tus estudiantes:** en GitHub ve a Settings → Pages, elige la rama y la carpeta raíz. Comparte el enlace que entrega.

## Contenido

| Tema | Materia | Quiz | Práctica en la hoja |
| --- | --- | --- | --- |
| Lo básico | celdas, datos, operadores | 7 | boleta, ganancia y vuelto |
| Funciones | SUMA, PROMEDIO, MAX, MIN, CONTAR | 7 | resumen semanal, lista del curso |
| Referencias | relativas, absolutas `$`, relleno | 7 | arrastrar fórmulas, IVA fijo |
| Condicional | SI, Y/O, CONTAR.SI, SUMAR.SI, formato | 8 | acta de notas, ventas por sabor, semáforo |
| Gráficos | columnas, líneas, circular | 7 | tres gráficos y un desafío final |

## Editar la materia

Todo el contenido está en `js/data.js`: agrega pasos a `lesson`, preguntas a `quiz` o ejercicios a `practice`. Cada tarea de práctica lleva una fórmula solución (`sol`); la página acepta cualquier fórmula equivalente y la prueba además con datos distintos (`vary`) para detectar números escritos a mano.

## Estructura

- `js/engine.js` — motor de fórmulas en español (`;` como separador, coma decimal).
- `js/data.js` — materia, quizzes y ejercicios.
- `js/app.js` — interfaz y corrección.
- `css/styles.css` — estilos, con modo claro y oscuro.

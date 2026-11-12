/* Contenido del curso. Cada módulo: lesson (materia), quiz y practice (ejercicios en la hoja).
   - lesson: {h, p, t?(tabla), hi?, chart?, find? | try? | pick?}
   - quiz:   {q, o[], a (índice correcto), why}
   - practice.tasks: {text, cell|cells, sol, hints[], tip?} | {text, format{}} | {text, chart{}}
   - vary: [rango, mín, máx, decimales] → datos que se cambian al corregir, para detectar números escritos a mano. */
window.COURSE = [
  /* ------------------------------------------------------------------ 1 */
  {
    id: 'basico', name: 'Lo básico', desc: 'Celdas, datos y tus primeras fórmulas',
    lesson: [
      {
        h: 'La hoja es un mapa',
        p: 'Excel es una cuadrícula gigante. Las <b>columnas</b> se nombran con letras y las <b>filas</b> con números. Donde se cruzan hay una <b>celda</b>, y su dirección es letra + número: columna C con fila 3 es <code>C3</code>.',
        find: 'C3', ask: 'Toca la celda C3'
      },
      {
        h: 'Lo que ves no siempre es lo que hay',
        p: 'Una celda puede guardar <b>texto</b>, <b>números</b> o <b>fórmulas</b>. El texto se alinea a la izquierda y los números a la derecha. Y cuando hay una fórmula, la celda muestra el <b>resultado</b>, no la fórmula.',
        t: { A1: 'Galleta', B1: 'Precio', A2: 'Chips', B2: '800', A3: 'Avena', B3: '700', A4: 'Total', B4: '=B2+B3' }, hi: ['B4'],
        pick: {
          q: '¿Qué hay guardado realmente en B4?',
          o: ['Una fórmula que suma B2 y B3', 'El número 1500 escrito a mano', 'Un texto'], a: 0,
          why: 'Ves 1500, pero la celda guarda =B2+B3. Si cambias un precio, el total se recalcula solo.'
        }
      },
      {
        h: 'Todo empieza con =',
        p: 'El signo <code>=</code> le avisa a Excel que lo que viene es un cálculo. Sin él, <code>12+8</code> es solo un texto. Con él, <code>=12+8</code> entrega 20.',
        try: { ask: 'Escribe una fórmula que sume 12 + 8', sol: '=12+8', must: ['+'] }
      },
      {
        h: 'Operadores y su orden',
        p: 'Tienes <code>+</code> suma, <code>-</code> resta, <code>*</code> multiplicación, <code>/</code> división y <code>^</code> potencia. Excel respeta el orden matemático: primero paréntesis, luego potencias, después <code>*</code> y <code>/</code>, al final <code>+</code> y <code>-</code>. Por eso <code>=2+3*4</code> da 14 y no 20.',
        try: { ask: 'Calcula el promedio de 4 y 10: súmalos y divide el resultado por 2', sol: '=(4+10)/2', must: ['(', '/'] }
      },
      {
        h: 'Usa celdas, no números',
        p: 'La gracia de Excel es apuntar a las celdas en vez de copiar sus valores. Si escribes <code>=B1*B2</code> y mañana cambia el precio, el total se actualiza sin tocar la fórmula.',
        t: { A1: 'Precio', B1: '800', A2: 'Cantidad', B2: '12', A3: 'Total' }, hi: ['B1', 'B2'],
        try: { ask: 'Calcula el total: precio por cantidad, usando las celdas', sol: '=B1*B2', vary: [['B1:B2', 1, 900, 0]] }
      }
    ],
    quiz: [
      { q: '¿Cómo se llama la celda en la columna D y la fila 7?', o: ['D7', '7D', 'D-7', 'Fila7D'], a: 0, why: 'Siempre va primero la letra de la columna y después el número de la fila.' },
      { q: '¿Con qué símbolo empieza toda fórmula?', o: ['=', '+', '#', '@'], a: 0, why: 'Sin el = Excel trata lo que escribes como texto.' },
      { q: '¿Qué resultado entrega =2+3*4?', o: ['14', '20', '24', '9'], a: 0, why: 'Primero se multiplica 3*4 = 12 y luego se suma 2.' },
      { q: '¿Y cuánto da =(2+3)*4?', o: ['20', '14', '24', '10'], a: 0, why: 'Los paréntesis se resuelven primero: 5*4 = 20.' },
      { q: 'Escribes 800 y queda alineado a la izquierda. ¿Qué pasó?', o: ['Excel lo guardó como texto', 'Es un número negativo', 'La celda tiene una fórmula', 'La celda está protegida'], a: 0, why: 'Los números se alinean a la derecha. A la izquierda significa texto, y con texto no se puede calcular.' },
      { q: 'El precio está en B1 y la cantidad en B2. ¿Cuál es la mejor fórmula para el total?', o: ['=B1*B2', '=800*12', 'B1*B2', '=B1xB2'], a: 0, why: 'Con referencias, el total se actualiza cuando cambian los datos. Y la multiplicación es *.' },
      { q: '¿Qué operador eleva a una potencia?', o: ['^', '**', 'x', '%'], a: 0, why: '=3^2 es 3 al cuadrado: 9.' }
    ],
    practice: [
      {
        id: 'bas1', title: 'Tu primera boleta', cols: 4, rows: 6,
        story: 'Vendiste galletas en el patio. Calcula cuánto recaudaste por cada sabor y en total.',
        data: { A1: 'Galleta', B1: 'Precio', C1: 'Cantidad', D1: 'Total', A2: 'Chips', B2: '800', C2: '5', A3: 'Avena', B3: '700', C3: '3', A4: 'Brownie', B4: '1200', C4: '2', C5: 'Suma' },
        vary: [['B2:C4', 1, 1500, 0]],
        tasks: [
          { text: 'En <b>D2</b> calcula el total de Chips: precio por cantidad.', cell: 'D2', sol: '=B2*C2', hints: ['Multiplica las dos celdas de la fila 2. El operador es <code>*</code>.', 'Escribe <code>=B2*C2</code> y presiona Enter.'] },
          { text: 'Haz lo mismo en <b>D3</b> y <b>D4</b>.', cells: 'D3:D4', sol: '=B3*C3', hints: ['Misma idea, cambiando el número de fila.', 'En D3: <code>=B3*C3</code>. En D4: <code>=B4*C4</code>.'] },
          { text: 'En <b>D5</b> suma los tres totales.', cell: 'D5', sol: '=D2+D3+D4', hints: ['Suma las tres celdas con <code>+</code>.', 'Escribe <code>=D2+D3+D4</code>.'] }
        ]
      },
      {
        id: 'bas2', title: 'Ganancia y vuelto', cols: 2, rows: 6,
        story: 'Cierre del día: quieres saber cuánto ganaste y cuánto vuelto dar al último cliente.',
        data: { A1: 'Venta', B1: '5600', A2: 'Costo', B2: '3100', A3: 'Ganancia', A4: 'Margen', A5: 'Paga con', B5: '10000', A6: 'Vuelto' },
        vary: [['B1', 5000, 6000, 0], ['B2', 1000, 4000, 0], ['B5', 10000, 20000, 0]],
        tasks: [
          { text: 'En <b>B3</b> calcula la ganancia: venta menos costo.', cell: 'B3', sol: '=B1-B2', hints: ['Es una resta entre dos celdas.', 'Escribe <code>=B1-B2</code>.'] },
          { text: 'En <b>B4</b> calcula el margen: ganancia dividida por la venta.', cell: 'B4', sol: '=B3/B1', hints: ['La división se escribe con <code>/</code>.', 'Escribe <code>=B3/B1</code>.'] },
          { text: 'En <b>B6</b> calcula el vuelto del cliente.', cell: 'B6', sol: '=B5-B1', hints: ['Lo que paga menos lo que compró.', 'Escribe <code>=B5-B1</code>.'] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 2 */
  {
    id: 'funciones', name: 'Funciones', desc: 'SUMA, PROMEDIO, MAX, MIN y CONTAR',
    lesson: [
      {
        h: 'Fórmulas que ya vienen hechas',
        p: 'Una <b>función</b> es un cálculo con nombre. Se escribe así: <code>=NOMBRE(argumentos)</code>. En vez de <code>=B2+B3+B4+B5+B6</code> escribes <code>=SUMA(B2:B6)</code> y listo.',
        t: { A1: 'Día', B1: 'Ventas', A2: 'Lunes', B2: '12', A3: 'Martes', B3: '18', A4: 'Miércoles', B4: '9', A5: 'Total', B5: '=SUMA(B2:B4)' }, hi: ['B5'],
        pick: { q: '¿Qué parte de =SUMA(B2:B4) es el argumento?', o: ['B2:B4', 'SUMA', 'El signo ='], a: 0, why: 'El argumento va entre paréntesis: es el dato con el que trabaja la función.' }
      },
      {
        h: 'Los rangos',
        p: 'Los dos puntos significan <b>"desde… hasta"</b>. <code>B2:B6</code> son las cinco celdas de B2 a B6. Un rango también puede ser un rectángulo: <code>A1:C2</code> abarca tres columnas y dos filas.',
        pick: { q: '¿Cuántas celdas tiene el rango B2:C4?', o: ['6', '3', '4', '8'], a: 0, why: 'Dos columnas (B y C) por tres filas (2, 3 y 4): 6 celdas.' }
      },
      {
        h: 'SUMA',
        p: '<code>=SUMA(rango)</code> suma todos los números del rango e ignora los textos.',
        t: { A1: 'Día', B1: 'Ventas', A2: 'Lunes', B2: '12', A3: 'Martes', B3: '18', A4: 'Miércoles', B4: '9', A5: 'Jueves', B5: '21', A6: 'Viernes', B6: '30' }, hi: ['B2', 'B3', 'B4', 'B5', 'B6'],
        try: { ask: 'Suma las ventas de la semana', sol: '=SUMA(B2:B6)', vary: [['B2:B6', 1, 60, 0]] }
      },
      {
        h: 'PROMEDIO, MAX y MIN',
        p: 'Funcionan igual que SUMA. <code>PROMEDIO</code> entrega la media, <code>MAX</code> el valor más alto y <code>MIN</code> el más bajo.',
        t: { A1: 'Día', B1: 'Ventas', A2: 'Lunes', B2: '12', A3: 'Martes', B3: '18', A4: 'Miércoles', B4: '9', A5: 'Jueves', B5: '21', A6: 'Viernes', B6: '30' },
        try: { ask: '¿Cuál fue la mejor venta de la semana?', sol: '=MAX(B2:B6)', vary: [['B2:B6', 1, 60, 0]] }
      },
      {
        h: 'CONTAR y CONTARA',
        p: '<code>CONTAR</code> cuenta solo las celdas que tienen <b>números</b>. <code>CONTARA</code> cuenta todas las que <b>no están vacías</b>, incluidos los textos.',
        t: { A1: 'Estudiante', B1: 'Nota', A2: 'Ana', B2: '5,5', A3: 'Beto', B3: 'Pendiente', A4: 'Caro', B4: '6,1', A5: 'Dani', B5: '4,8' }, hi: ['B3'],
        try: { ask: '¿Cuántas notas (números) hay ingresadas en B2:B5?', sol: '=CONTAR(B2:B5)', must: ['CONTAR'] }
      },
      {
        h: 'Punto y coma, y coma decimal',
        p: 'En el Excel en español que usamos en Chile, los argumentos se separan con <b>punto y coma</b> y los decimales se escriben con <b>coma</b>: <code>=REDONDEAR(3,14159;2)</code> redondea a 2 decimales.',
        try: { ask: 'Redondea 3,14159 a 2 decimales', sol: '=REDONDEAR(3,14159;2)', must: ['REDONDEAR'] }
      }
    ],
    quiz: [
      { q: '¿Qué hace =SUMA(A1:A5)?', o: ['Suma las celdas desde A1 hasta A5', 'Suma solo A1 y A5', 'Cuenta cuántas celdas hay', 'Multiplica A1 por A5'], a: 0, why: 'Los dos puntos indican el rango completo, de A1 a A5.' },
      { q: '¿Cuántas celdas abarca B2:C4?', o: ['6', '3', '4', '2'], a: 0, why: '2 columnas por 3 filas.' },
      { q: 'En A1:A3 están las notas 5, 6 y 4. ¿Qué entrega =PROMEDIO(A1:A3)?', o: ['5', '15', '6', '4'], a: 0, why: '(5 + 6 + 4) / 3 = 5.' },
      { q: '¿Cuál es la diferencia entre CONTAR y CONTARA?', o: ['CONTAR cuenta solo números; CONTARA cuenta todo lo que no esté vacío', 'Son la misma función', 'CONTARA cuenta solo textos', 'CONTAR suma y CONTARA cuenta'], a: 0, why: 'Si una celda dice "Pendiente", CONTARA la cuenta y CONTAR no.' },
      { q: '¿Qué función entrega el valor más alto de un rango?', o: ['MAX', 'MIN', 'SUMA', 'ALTO'], a: 0, why: 'MAX entrega el máximo y MIN el mínimo.' },
      { q: '¿Cuál está bien escrita?', o: ['=SUMA(B2:B6)', '=SUMA B2:B6', 'SUMA(B2:B6)', '=SUMA(B2-B6)'], a: 0, why: 'Necesita el =, los paréntesis y los dos puntos del rango.' },
      { q: 'En el Excel en español de Chile, ¿con qué se separan los argumentos?', o: ['Punto y coma ;', 'Coma ,', 'Dos puntos :', 'Espacio'], a: 0, why: 'La coma se reserva para los decimales, así que los argumentos van con ;' }
    ],
    practice: [
      {
        id: 'fun1', title: 'Resumen de la semana', cols: 2, rows: 10,
        story: 'Tienes las ventas de cada día. Arma el resumen que le mostrarías a tu socio.',
        data: { A1: 'Día', B1: 'Ventas', A2: 'Lunes', B2: '12500', A3: 'Martes', B3: '18200', A4: 'Miércoles', B4: '9800', A5: 'Jueves', B5: '21000', A6: 'Viernes', B6: '30400', A7: 'Total', A8: 'Promedio', A9: 'Mejor día', A10: 'Peor día' },
        vary: [['B2:B6', 5000, 40000, 0]],
        tasks: [
          { text: 'En <b>B7</b> suma las ventas de la semana.', cell: 'B7', sol: '=SUMA(B2:B6)', hints: ['Usa la función SUMA con el rango de lunes a viernes.', 'Escribe <code>=SUMA(B2:B6)</code>.'] },
          { text: 'En <b>B8</b> calcula el promedio diario.', cell: 'B8', sol: '=PROMEDIO(B2:B6)', hints: ['Misma forma que SUMA, con otro nombre de función.', 'Escribe <code>=PROMEDIO(B2:B6)</code>.'], tip: 'Ojo con no incluir el total (B7) dentro del rango.' },
          { text: 'En <b>B9</b> encuentra la venta más alta.', cell: 'B9', sol: '=MAX(B2:B6)', hints: ['La función se llama MAX.', 'Escribe <code>=MAX(B2:B6)</code>.'] },
          { text: 'En <b>B10</b> encuentra la venta más baja.', cell: 'B10', sol: '=MIN(B2:B6)', hints: ['La función se llama MIN.', 'Escribe <code>=MIN(B2:B6)</code>.'] }
        ]
      },
      {
        id: 'fun2', title: 'Lista del curso', cols: 2, rows: 10,
        story: 'A una estudiante le falta rendir la prueba. Aun así necesitas las estadísticas del curso.',
        data: { A1: 'Estudiante', B1: 'Nota', A2: 'Ana', B2: '5,5', A3: 'Beto', B3: '3,8', A4: 'Caro', B4: 'Pendiente', A5: 'Dani', B5: '6,4', A6: 'Emi', B6: '4,9', A7: 'Fran', B7: '5,7', A8: 'Inscritos', A9: 'Notas listas', A10: 'Promedio' },
        vary: [['B2:B7', 1, 7, 1]],
        tasks: [
          { text: 'En <b>B8</b> cuenta cuántos estudiantes hay inscritos.', cell: 'B8', sol: '=CONTARA(A2:A7)', hints: ['Los nombres son texto: necesitas la función que cuenta celdas no vacías.', 'Escribe <code>=CONTARA(A2:A7)</code>.'] },
          { text: 'En <b>B9</b> cuenta cuántas notas ya están ingresadas.', cell: 'B9', sol: '=CONTAR(B2:B7)', hints: ['"Pendiente" no es un número. ¿Qué función cuenta solo números?', 'Escribe <code>=CONTAR(B2:B7)</code>.'] },
          { text: 'En <b>B10</b> calcula el promedio del curso, redondeado a 1 decimal.', cell: 'B10', sol: '=REDONDEAR(PROMEDIO(B2:B7);1)', hints: ['Puedes poner una función dentro de otra: REDONDEAR(lo que quieres redondear; decimales).', 'Escribe <code>=REDONDEAR(PROMEDIO(B2:B7);1)</code>.'] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 3 */
  {
    id: 'referencias', name: 'Referencias', desc: 'Copiar fórmulas y fijar celdas con $',
    lesson: [
      {
        h: 'Las fórmulas se adaptan al copiarlas',
        p: 'Cuando copias una fórmula a otra celda, Excel mueve sus referencias la misma distancia. Si <code>=B2*C2</code> baja una fila, se convierte en <code>=B3*C3</code>. A eso se le llama <b>referencia relativa</b>.',
        t: { A1: 'Galleta', B1: 'Precio', C1: 'Cant.', D1: 'Total', A2: 'Chips', B2: '800', C2: '5', D2: '=B2*C2', A3: 'Avena', B3: '700', C3: '3', D3: '=B3*C3' }, hi: ['D2', 'D3'],
        pick: { q: 'Copias =A1+B1 desde C1 hacia C2. ¿Qué fórmula queda en C2?', o: ['=A2+B2', '=A1+B1', '=B1+C1', '=A2+B1'], a: 0, why: 'Bajaste una fila, así que todas las filas de la fórmula suben en 1.' }
      },
      {
        h: 'El cuadradito de relleno',
        p: 'La celda seleccionada tiene un <b>cuadradito</b> en la esquina inferior derecha. Si lo arrastras hacia abajo, Excel copia la fórmula a todas las celdas por las que pasas. Una fórmula bien hecha se escribe una vez y se arrastra.',
        pick: { q: 'Tienes =B2*C2 en D2 y arrastras el cuadradito hasta D4. ¿Qué queda en D4?', o: ['=B4*C4', '=B2*C2', '=B3*C3', '=D2*D3'], a: 0, why: 'Dos filas más abajo, las referencias avanzan dos filas.' }
      },
      {
        h: 'Cuando algo no se debe mover: $',
        p: 'A veces todas las filas usan <b>un mismo dato</b>, como el IVA. Si copias <code>=B4*B1</code> hacia abajo, B1 se mueve a B2 y el cálculo se rompe. El signo <code>$</code> fija la referencia: <code>$B$1</code> apunta siempre a B1.',
        t: { A1: 'IVA', B1: '0,19', A3: 'Producto', B3: 'Neto', C3: 'IVA', A4: 'Chips', B4: '1000', C4: '=B4*$B$1', A5: 'Avena', B5: '2000', C5: '=B5*$B$1' }, hi: ['B1'],
        pick: { q: 'Copias =B4*$B$1 una fila hacia abajo. ¿Qué queda?', o: ['=B5*$B$1', '=B5*$B$2', '=B4*$B$1', '=B5*B2'], a: 0, why: 'B4 es relativa y avanza a B5. $B$1 es absoluta y no se mueve.' }
      },
      {
        h: 'Fijar solo una parte',
        p: 'El <code>$</code> fija lo que tiene a su derecha. <code>$A1</code> fija la columna A y deja libre la fila. <code>A$1</code> fija la fila 1 y deja libre la columna. En Excel, la tecla <b>F4</b> va alternando entre las cuatro opciones.',
        pick: { q: 'En la referencia B$3, ¿qué queda fijo?', o: ['La fila 3', 'La columna B', 'La columna y la fila', 'Nada'], a: 0, why: 'El $ está antes del 3, así que fija la fila. La columna puede cambiar.' }
      },
      {
        h: 'Ahora tú',
        p: 'Escribe la fórmula del IVA de Chips de modo que funcione al copiarla hacia abajo.',
        t: { A1: 'IVA', B1: '0,19', A3: 'Producto', B3: 'Neto', C3: 'IVA', A4: 'Chips', B4: '1000', A5: 'Avena', B5: '2000' }, hi: ['B1', 'B4'],
        try: { ask: 'Neto de Chips por el IVA, con el IVA fijo', sol: '=B4*$B$1', must: ['$B$1'], vary: [['B1', 0.1, 0.3, 2], ['B4', 500, 5000, 0]] }
      }
    ],
    quiz: [
      { q: 'En B1 está =A1*2. La copias a B3. ¿Qué queda?', o: ['=A3*2', '=A1*2', '=B3*2', '=A3*4'], a: 0, why: 'Bajó dos filas: A1 pasa a A3. El 2 es un número, no cambia.' },
      { q: '¿Qué hace el signo $ en una referencia?', o: ['Fija la columna o fila para que no cambie al copiar', 'Da formato de moneda', 'Convierte el número en texto', 'Suma los valores'], a: 0, why: 'No tiene que ver con dinero: es un ancla.' },
      { q: '¿Cuál referencia apunta siempre a B1, se copie donde se copie?', o: ['$B$1', 'B1', 'B$1', '$B1'], a: 0, why: 'Necesita un $ antes de la columna y otro antes de la fila.' },
      { q: 'Copias =B2*$E$1 una columna a la derecha. ¿Qué queda?', o: ['=C2*$E$1', '=B2*$E$1', '=C2*$F$1', '=B3*$E$1'], a: 0, why: 'Solo se mueve la parte relativa: B2 pasa a C2.' },
      { q: 'En A$1, ¿qué queda fijo?', o: ['La fila', 'La columna', 'Las dos', 'Ninguna'], a: 0, why: 'El $ fija lo que tiene a su derecha: el 1.' },
      { q: '¿Cuándo conviene una referencia absoluta?', o: ['Cuando muchas fórmulas usan un mismo dato, como una tasa', 'Siempre, por seguridad', 'Solo con textos', 'Cuando la fórmula no se va a copiar'], a: 0, why: 'IVA, tipo de cambio, descuento: un solo dato usado por todas las filas.' },
      { q: '¿Qué tecla alterna los $ de una referencia en Excel?', o: ['F4', 'F1', 'Ctrl + $', 'Tab'], a: 0, why: 'F4 pasa por B1, $B$1, B$1 y $B1.' }
    ],
    practice: [
      {
        id: 'ref1', title: 'Una fórmula, muchas filas', cols: 4, rows: 6,
        story: 'Esta vez la boleta tiene cinco productos. No escribas cinco fórmulas: escribe una y arrástrala.',
        data: { A1: 'Galleta', B1: 'Precio', C1: 'Cantidad', D1: 'Total', A2: 'Chips', B2: '800', C2: '5', A3: 'Avena', B3: '700', C3: '3', A4: 'Brownie', B4: '1200', C4: '2', A5: 'Limón', B5: '900', C5: '4', A6: 'Coco', B6: '750', C6: '6' },
        vary: [['B2:C6', 1, 1500, 0]],
        tasks: [
          { text: 'En <b>D2</b> calcula precio por cantidad.', cell: 'D2', sol: '=B2*C2', hints: ['Como en la primera boleta.', 'Escribe <code>=B2*C2</code>.'] },
          { text: 'Selecciona D2 y arrastra el <b>cuadradito</b> de su esquina hasta <b>D6</b>.', cells: 'D3:D6', sol: '=B3*C3', hints: ['Haz clic en D2: verás un cuadradito verde abajo a la derecha. Arrástralo hacia abajo.', 'También puedes copiar D2 con Ctrl+C y pegarla en D3:D6 con Ctrl+V.'] }
        ]
      },
      {
        id: 'ref2', title: 'IVA para todos', cols: 4, rows: 7,
        story: 'Todos los productos pagan el mismo IVA, que está en B1. Si mañana cambia la tasa, la planilla debe seguir funcionando.',
        data: { A1: 'IVA', B1: '0,19', A3: 'Producto', B3: 'Neto', C3: 'IVA', D3: 'Total', A4: 'Chips', B4: '1000', A5: 'Avena', B5: '2000', A6: 'Brownie', B6: '3500', A7: 'Limón', B7: '1800' },
        vary: [['B1', 0.1, 0.3, 2], ['B4:B7', 500, 5000, 0]],
        tasks: [
          { text: 'En <b>C4</b> calcula el IVA de Chips: neto por la tasa, con la tasa fija.', cell: 'C4', sol: '=B4*$B$1', hints: ['La tasa está en B1 y no debe moverse al copiar. ¿Qué signo la fija?', 'Escribe <code>=B4*$B$1</code>.'], tip: 'Usa la celda B1, no el número 0,19.' },
          { text: 'Arrastra C4 hasta <b>C7</b>.', cells: 'C5:C7', sol: '=B5*$B$1', hints: ['Usa el cuadradito de relleno de C4.', 'Si aparecen ceros, revisa C4: debe decir <code>$B$1</code>, no <code>B1</code>.'], tip: 'Si quedó en cero, es porque B1 se movió al copiar. Fíjala con <code>$B$1</code> en C4 y vuelve a arrastrar.' },
          { text: 'En <b>D4</b> suma neto más IVA, y arrastra hasta <b>D7</b>.', cells: 'D4:D7', sol: '=B4+C4', hints: ['Aquí todo es relativo: no necesitas $.', 'Escribe <code>=B4+C4</code> en D4 y arrástrala hacia abajo.'] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 4 */
  {
    id: 'condicional', name: 'Condicional', desc: 'SI, CONTAR.SI, SUMAR.SI y formato condicional',
    lesson: [
      {
        h: 'Excel sabe comparar',
        p: 'Una comparación entrega <code>VERDADERO</code> o <code>FALSO</code>. Los operadores son <code>=</code> igual, <code>&lt;&gt;</code> distinto, <code>&gt;</code> mayor, <code>&lt;</code> menor, <code>&gt;=</code> mayor o igual y <code>&lt;=</code> menor o igual.',
        try: { ask: 'Pregúntale a Excel si 7 es mayor o igual que 4', sol: '=7>=4', must: ['>='] }
      },
      {
        h: 'La función SI',
        p: 'SI toma una decisión: <code>=SI(condición; valor_si_verdadero; valor_si_falso)</code>. Los textos van entre comillas.',
        t: { A1: 'Nota', B1: '5,2', A2: 'Estado' }, hi: ['B1'],
        try: { ask: 'Si la nota (B1) es mayor o igual a 4 muestra "Aprueba"; si no, "Reprueba"', sol: '=SI(B1>=4;"Aprueba";"Reprueba")', vary: [['B1', 1, 7, 1]] }
      },
      {
        h: 'Varias condiciones: Y, O',
        p: '<code>Y(a; b)</code> es verdadero solo si <b>todas</b> las condiciones se cumplen. <code>O(a; b)</code> lo es si se cumple <b>al menos una</b>. Se usan dentro de SI.',
        t: { A1: 'Nota', B1: '5,2', A2: 'Asistencia', B2: '70', A3: 'Estado' }, hi: ['B1', 'B2'],
        try: { ask: 'Aprueba solo si la nota es al menos 4 y la asistencia al menos 75. Muestra "Aprueba" o "Reprueba"', sol: '=SI(Y(B1>=4;B2>=75);"Aprueba";"Reprueba")', vary: [['B1', 1, 7, 1], ['B2', 50, 100, 0]] }
      },
      {
        h: 'Contar y sumar con condición',
        p: '<code>=CONTAR.SI(rango; criterio)</code> cuenta las celdas que cumplen el criterio. <code>=SUMAR.SI(rango; criterio; rango_suma)</code> suma solo las filas que lo cumplen. El criterio va entre comillas: <code>"&gt;=4"</code> o <code>"Chips"</code>.',
        t: { A1: 'Estudiante', B1: 'Nota', A2: 'Ana', B2: '5,5', A3: 'Beto', B3: '3,8', A4: 'Caro', B4: '6,1', A5: 'Dani', B5: '3,2', A6: 'Emi', B6: '4,0' },
        try: { ask: 'Cuenta cuántas notas son mayores o iguales a 4', sol: '=CONTAR.SI(B2:B6;">=4")', vary: [['B2:B6', 1, 7, 1]] }
      },
      {
        h: 'Formato condicional',
        p: 'En vez de entregar un valor, el <b>formato condicional</b> pinta la celda cuando cumple una regla. Es la forma más rápida de ver qué necesita atención. En Excel está en Inicio → Formato condicional.',
        t: { A1: 'Estudiante', B1: 'Nota', A2: 'Ana', B2: '5,5', A3: 'Beto', B3: '3,8', A4: 'Caro', B4: '6,1', A5: 'Dani', B5: '3,2' }, hi: ['B3', 'B5'], hiColor: 'r',
        pick: { q: 'Quieres ver en rojo las notas bajo 4. ¿Qué regla aplicas a B2:B5?', o: ['Resaltar si es menor que 4', 'Resaltar si es mayor que 4', 'Resaltar si es igual a 4'], a: 0, why: 'La regla se evalúa celda por celda: las que sean menores que 4 se pintan.' }
      }
    ],
    quiz: [
      { q: '¿Qué entrega =SI(5>3;"Sí";"No")?', o: ['Sí', 'No', 'VERDADERO', '5'], a: 0, why: '5>3 es verdadero, así que SI entrega el segundo argumento.' },
      { q: '¿Cuál es el operador "distinto de"?', o: ['<>', '!=', '=/=', '><'], a: 0, why: 'En Excel, distinto se escribe <>.' },
      { q: '¿En qué orden van los argumentos de SI?', o: ['Condición; valor si verdadero; valor si falso', 'Valor si verdadero; condición; valor si falso', 'Condición; valor si falso; valor si verdadero', 'Valor; condición'], a: 0, why: 'Primero la pregunta, luego qué hacer si se cumple y qué hacer si no.' },
      { q: '¿Qué entrega =Y(VERDADERO;FALSO)?', o: ['FALSO', 'VERDADERO', 'Un error', '1'], a: 0, why: 'Y exige que todas las condiciones sean verdaderas.' },
      { q: 'B2 vale 3,9. ¿Qué entrega =SI(B2>=4;"Aprueba";"Reprueba")?', o: ['Reprueba', 'Aprueba', 'FALSO', '3,9'], a: 0, why: '3,9 no es mayor o igual a 4, así que entrega el valor si falso.' },
      { q: '¿Qué hace =CONTAR.SI(A1:A10;">=4")?', o: ['Cuenta las celdas con valor mayor o igual a 4', 'Suma los valores mayores o iguales a 4', 'Cuenta todas las celdas', 'Entrega VERDADERO o FALSO'], a: 0, why: 'CONTAR.SI cuenta; SUMAR.SI suma.' },
      { q: '¿Qué hace =SUMAR.SI(A2:A6;"Chips";B2:B6)?', o: ['Suma los valores de B donde A dice Chips', 'Cuenta cuántas veces aparece Chips', 'Suma toda la columna B', 'Suma la columna A'], a: 0, why: 'Busca el criterio en el primer rango y suma las filas correspondientes del último.' },
      { q: '¿Para qué sirve el formato condicional?', o: ['Para cambiar el aspecto de una celda según su valor', 'Para calcular promedios', 'Para proteger celdas', 'Para ordenar datos'], a: 0, why: 'No cambia el valor: solo cómo se ve.' }
    ],
    practice: [
      {
        id: 'con1', title: 'Acta de notas', cols: 3, rows: 8,
        story: 'Con nota 4,0 o más se aprueba. Completa el estado de cada estudiante y cuenta los aprobados.',
        data: { A1: 'Estudiante', B1: 'Nota', C1: 'Estado', A2: 'Ana', B2: '5,5', A3: 'Beto', B3: '3,8', A4: 'Caro', B4: '6,1', A5: 'Dani', B5: '3,2', A6: 'Emi', B6: '4,0', A8: 'Aprobados' },
        vary: [['B2:B6', 1, 7, 1]],
        tasks: [
          { text: 'En <b>C2</b> muestra "Aprueba" si la nota es mayor o igual a 4, o "Reprueba" si no.', cell: 'C2', sol: '=SI(B2>=4;"Aprueba";"Reprueba")', hints: ['SI(condición; valor si verdadero; valor si falso). Los textos van entre comillas.', 'Escribe <code>=SI(B2>=4;"Aprueba";"Reprueba")</code>.'], tip: 'Revisa las comillas y que los textos digan exactamente Aprueba y Reprueba.' },
          { text: 'Arrastra C2 hasta <b>C6</b>.', cells: 'C3:C6', sol: '=SI(B3>=4;"Aprueba";"Reprueba")', hints: ['Usa el cuadradito de relleno de C2.', 'O copia C2 y pégala en C3:C6.'] },
          { text: 'En <b>B8</b> cuenta cuántos aprobaron.', cell: 'B8', sol: '=CONTAR.SI(B2:B6;">=4")', hints: ['CONTAR.SI(rango; criterio). El criterio va entre comillas.', 'Escribe <code>=CONTAR.SI(B2:B6;"&gt;=4")</code>.'] }
        ]
      },
      {
        id: 'con2', title: 'Ventas por sabor', cols: 2, rows: 10,
        story: 'El registro de ventas mezcla los sabores. Necesitas saber cuánto vendiste de Chips y cuántas ventas grandes hubo.',
        data: { A1: 'Sabor', B1: 'Monto', A2: 'Chips', B2: '4800', A3: 'Avena', B3: '2100', A4: 'Chips', B4: '6400', A5: 'Brownie', B5: '7200', A6: 'Avena', B6: '3500', A7: 'Chips', B7: '1600', A9: 'Total Chips', A10: 'Sobre 5000' },
        vary: [['B2:B7', 1000, 9000, 0]],
        tasks: [
          { text: 'En <b>B9</b> suma solo los montos de Chips.', cell: 'B9', sol: '=SUMAR.SI(A2:A7;"Chips";B2:B7)', hints: ['SUMAR.SI(dónde busco; qué busco; qué sumo).', 'Escribe <code>=SUMAR.SI(A2:A7;"Chips";B2:B7)</code>.'] },
          { text: 'En <b>B10</b> cuenta cuántas ventas superaron los 5000.', cell: 'B10', sol: '=CONTAR.SI(B2:B7;">5000")', hints: ['CONTAR.SI con el criterio "mayor que 5000" entre comillas.', 'Escribe <code>=CONTAR.SI(B2:B7;"&gt;5000")</code>.'] }
        ]
      },
      {
        id: 'con3', title: 'Semáforo de stock', cols: 3, rows: 6, tools: ['cf'],
        story: 'Cuando quedan menos de 10 unidades hay que hornear. Haz que la planilla te avise sola.',
        data: { A1: 'Galleta', B1: 'Stock', C1: 'Acción', A2: 'Chips', B2: '24', A3: 'Avena', B3: '6', A4: 'Brownie', B4: '15', A5: 'Limón', B5: '3', A6: 'Coco', B6: '10' },
        vary: [['B2:B6', 0, 30, 0]],
        tasks: [
          { text: 'Selecciona <b>B2:B6</b> y, con <b>Formato condicional</b>, resalta los valores menores que 10.', format: { range: 'B2:B6', test: function (v) { return v < 10; }, probe: [9, 10, 11] }, hints: ['Arrastra desde B2 hasta B6 para seleccionar el rango y luego abre Formato condicional.', 'Regla: "menor que", valor 10, y presiona Aplicar.'] },
          { text: 'En <b>C2</b> muestra "Hornear" si el stock es menor que 10, o "OK" si no. Arrastra hasta <b>C6</b>.', cells: 'C2:C6', sol: '=SI(B2<10;"Hornear";"OK")', hints: ['Es un SI con la misma condición de la regla.', 'Escribe <code>=SI(B2&lt;10;"Hornear";"OK")</code> en C2 y arrástrala.'] }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ 5 */
  {
    id: 'graficos', name: 'Gráficos', desc: 'Elegir el gráfico correcto y crearlo',
    lesson: [
      {
        h: 'Una imagen de tus datos',
        p: 'Un gráfico convierte una tabla en algo que se entiende de un vistazo. Lo importante no es que se vea bonito: es que responda <b>una pregunta</b>. Antes de crear uno, decide qué quieres mostrar.',
        chart: { type: 'col', title: 'Ventas por sabor', labels: ['Chips', 'Avena', 'Brownie', 'Limón', 'Coco'], values: [42, 28, 35, 18, 12] }
      },
      {
        h: 'Columnas: comparar categorías',
        p: 'Usa <b>columnas</b> (o barras) para comparar cantidades entre categorías: productos, personas, sucursales. La altura muestra de inmediato quién va primero.',
        chart: { type: 'col', title: 'Ventas por sabor', labels: ['Chips', 'Avena', 'Brownie', 'Limón', 'Coco'], values: [42, 28, 35, 18, 12] },
        pick: { q: 'Quieres comparar cuánto vendió cada uno de tus 5 sabores. ¿Qué gráfico usas?', o: ['Columnas', 'Líneas', 'Circular'], a: 0, why: 'Son categorías independientes que quieres comparar entre sí.' }
      },
      {
        h: 'Líneas: cambios en el tiempo',
        p: 'Usa <b>líneas</b> cuando el eje horizontal es el tiempo: días, semanas, meses. La línea muestra la tendencia: si sube, baja o se mantiene.',
        chart: { type: 'line', title: 'Ventas por semana', labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'], values: [20, 26, 24, 33, 38, 45] },
        pick: { q: 'Quieres mostrar cómo cambiaron tus ventas mes a mes durante el año. ¿Qué gráfico usas?', o: ['Líneas', 'Circular', 'Columnas apiladas'], a: 0, why: 'El tiempo es continuo y lo que importa es la tendencia.' }
      },
      {
        h: 'Circular: partes de un total',
        p: 'Usa el gráfico <b>circular</b> para mostrar cómo se reparte un total. Funciona con pocas categorías: con más de cinco o seis, los trozos se vuelven imposibles de comparar.',
        chart: { type: 'pie', title: 'Participación por sabor', labels: ['Chips', 'Avena', 'Brownie', 'Limón'], values: [42, 28, 35, 18] },
        pick: { q: '¿Qué porcentaje de tus ventas aporta cada sabor? ¿Qué gráfico usas?', o: ['Circular', 'Líneas', 'Columnas'], a: 0, why: 'Estás mostrando las partes de un total del 100%.' }
      },
      {
        h: 'Cómo se crea',
        p: 'Tres pasos: <b>1)</b> selecciona los datos, incluidos los encabezados; <b>2)</b> ve a Insertar → Gráficos; <b>3)</b> elige el tipo. Un buen gráfico tiene <b>título</b>, <b>ejes</b> que se entienden y, si hay varias series, una <b>leyenda</b>.',
        pick: { q: '¿Cuál es el primer paso para crear un gráfico?', o: ['Seleccionar los datos', 'Elegir los colores', 'Escribir el título', 'Guardar el archivo'], a: 0, why: 'Excel grafica lo que tengas seleccionado.' }
      }
    ],
    quiz: [
      { q: 'Quieres comparar las ventas de 5 productos. ¿Qué gráfico eliges?', o: ['Columnas', 'Líneas', 'Circular', 'Ninguno'], a: 0, why: 'Columnas o barras son la mejor opción para comparar categorías.' },
      { q: 'Quieres ver la evolución de las ventas en 12 meses. ¿Qué gráfico eliges?', o: ['Líneas', 'Circular', 'Columnas', 'Dispersión'], a: 0, why: 'Las líneas muestran tendencias a lo largo del tiempo.' },
      { q: 'Quieres mostrar qué parte del total representa cada sabor. ¿Qué gráfico eliges?', o: ['Circular', 'Líneas', 'Columnas', 'Área'], a: 0, why: 'El circular muestra la proporción de cada parte sobre el total.' },
      { q: '¿Cuál es el primer paso para insertar un gráfico?', o: ['Seleccionar los datos', 'Cambiar el color', 'Poner el título', 'Imprimir la hoja'], a: 0, why: 'Primero los datos, después Insertar → Gráficos.' },
      { q: 'En un gráfico de columnas, ¿qué muestra normalmente el eje horizontal?', o: ['Las categorías', 'Los valores', 'El título', 'La leyenda'], a: 0, why: 'Las categorías van abajo y los valores en el eje vertical.' },
      { q: '¿Por qué es mala idea un gráfico circular con 15 categorías?', o: ['Los trozos quedan tan pequeños que no se pueden comparar', 'Excel no lo permite', 'Solo acepta números enteros', 'Ocupa mucha memoria'], a: 0, why: 'Con muchas categorías conviene un gráfico de barras.' },
      { q: '¿Para qué sirve la leyenda?', o: ['Para identificar qué representa cada color o serie', 'Para mostrar el total', 'Para explicar la fórmula', 'Para ordenar los datos'], a: 0, why: 'Relaciona cada color con su serie de datos.' }
    ],
    practice: [
      {
        id: 'gra1', title: 'Ventas por sabor', cols: 2, rows: 6, tools: ['chart'],
        story: 'Tu socio quiere ver de un vistazo qué sabor se vende más.',
        data: { A1: 'Sabor', B1: 'Ventas', A2: 'Chips', B2: '42', A3: 'Avena', B3: '28', A4: 'Brownie', B4: '35', A5: 'Limón', B5: '18', A6: 'Coco', B6: '12' },
        tasks: [
          { text: 'Selecciona <b>A1:B6</b> (con encabezados) e inserta un gráfico de <b>columnas</b>.', chart: { ranges: ['A1:B6', 'A2:B6'], types: ['col'], want: 'columnas' }, hints: ['Arrastra desde A1 hasta B6 y luego presiona Insertar gráfico.', 'Con A1:B6 seleccionado, elige Columnas.'] }
        ]
      },
      {
        id: 'gra2', title: 'Evolución semanal', cols: 2, rows: 7, tools: ['chart'],
        story: 'Llevas seis semanas vendiendo. ¿El negocio crece?',
        data: { A1: 'Semana', B1: 'Ventas', A2: 'S1', B2: '20', A3: 'S2', B3: '26', A4: 'S3', B4: '24', A5: 'S4', B5: '33', A6: 'S5', B6: '38', A7: 'S6', B7: '45' },
        tasks: [
          { text: 'Elige el gráfico adecuado para mostrar la <b>tendencia</b> de A1:B7 e insértalo.', chart: { ranges: ['A1:B7', 'A2:B7'], types: ['line'], want: 'líneas' }, hints: ['Los datos avanzan en el tiempo: ¿qué gráfico muestra tendencias?', 'Selecciona A1:B7 y elige Líneas.'] }
        ]
      },
      {
        id: 'gra3', title: 'Desafío final', cols: 3, rows: 6, tools: ['chart'],
        story: 'Junta todo lo aprendido: funciones, referencias absolutas y gráficos.',
        data: { A1: 'Sabor', B1: 'Ventas', C1: 'Parte', A2: 'Chips', B2: '42', A3: 'Avena', B3: '28', A4: 'Brownie', B4: '35', A5: 'Limón', B5: '18', A6: 'Total' },
        vary: [['B2:B5', 5, 60, 0]],
        tasks: [
          { text: 'En <b>B6</b> suma todas las ventas.', cell: 'B6', sol: '=SUMA(B2:B5)', hints: ['Función SUMA con el rango de ventas.', 'Escribe <code>=SUMA(B2:B5)</code>.'] },
          { text: 'En <b>C2</b> calcula qué parte del total es Chips, y arrastra hasta <b>C5</b>.', cells: 'C2:C5', sol: '=B2/$B$6', hints: ['Ventas del sabor dividido por el total. El total es un dato único: ¿cómo lo fijas?', 'Escribe <code>=B2/$B$6</code> en C2 y arrástrala.'], tip: 'Si al arrastrar aparece #¡DIV/0!, el total se movió: fíjalo con <code>$B$6</code>.' },
          { text: 'Selecciona <b>A1:B5</b> e inserta un gráfico <b>circular</b>.', chart: { ranges: ['A1:B5', 'A2:B5'], types: ['pie'], want: 'circular' }, hints: ['Selecciona solo los sabores y sus ventas, sin la fila del total.', 'Con A1:B5 seleccionado, elige Circular.'] }
        ]
      }
    ]
  }
];

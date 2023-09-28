# Proyecto de Analizador Léxico y Sintáctico

## Descripción

Este proyecto es una implementación de un analizador léxico y sintáctico basado en Autómatas Finitos Determinísticos (AFD) y un Autómata de Pila Determinista (APD). Está diseñado para reconocer y validar un conjunto específico de tokens y estructuras de control en un lenguaje de programación personalizado.

## Implementación del scanner


La clase `Scanner` tiene como objetivo escanear líneas de código para identificar y categorizar tokens en un lenguaje de programación personalizado. Los tokens se categorizan en diferentes tipos como palabras reservadas, identificadores, operadores, números, símbolos y tokens desconocidos.

### Estructura de la Clase

La clase `Scanner` se inicia con la definición de los tipos de tokens y las palabras reservadas en un diccionario y una lista, respectivamente. También se inicializa un contador de línea (`this.linea`) que se utiliza para realizar un seguimiento de la línea actual que se está escaneando.

### Métodos Importantes

#### `scanLine(line)`

Este método acepta una línea de código como argumento y devuelve una lista de tokens identificados en esa línea. Internamente, utiliza un bucle `for` para recorrer cada carácter y una variable `lexema` para acumular caracteres que forman un token.

#### `clasificarLexema(lexema, linea)`

Este método clasifica un lexema en uno de los tipos de tokens predefinidos. Utiliza expresiones regulares y consultas en la lista de palabras reservadas para realizar esta clasificación.

#### `manejoErrores(tokens)`

Este método recorre la lista de tokens generados y verifica si hay algún token de tipo desconocido. Si se encuentra tal token, se llama al método `displayError()` para mostrar un error.

## Implementación del parser

### Tokens Iniciales

Los tokens reconocidos por el proyecto se dividen en categorías. Los principales son:

#### Palabras Reservadas
* `si`, `sino`, `fsi`, `mientras`, `fmientras`: Gestionados por APD.
* `enter`, `real`: Gestionados por AFD1.
* `imprime`: Gestionado por AFD2.

#### Identificadores
* Gestionados por AFD3.

### Autómatas Finitos Determinísticos (AFD)

#### AFD1: Declaración de Variables

![AFD1](https://github.com/DivorcedLance/compilador-basico/assets/104219610/9936e5b0-3660-4b04-b90c-8f8fe959edf6)

$$
\begin{aligned}
q0, \text{entero} \implies q1 \\
q0, \text{real} \implies q1 \\
q1, \text{IDENTIFICADOR} \implies q2 \\
q2, \text{=} \implies q3 \\
q3, \text{NUMERO} \implies q4 \\
q4, \text{,} \implies q1 \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: q2, q4

#### AFD2: Imprimir

![AFD2](https://github.com/DivorcedLance/compilador-basico/assets/104219610/7e05df57-3ffa-4b84-b893-00e369d9d299)

$$
\begin{aligned}
q0, \text{imprime} \implies q1 \\
q1, \text{IDENTIFICADOR} \implies q2 \\
q1, \text{NUMERO} \implies q2 \\
q2, \text{,} \implies q1 \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: q2

#### AFD3: Asignación

![AFD3](https://github.com/DivorcedLance/compilador-basico/assets/104219610/f8d4937a-3efe-4a29-bf81-a2d27436b9b3)

$$
\begin{aligned}
q0, \text{IDENTIFICADOR} \implies q1 \\
q1, \text{=} \implies q2 \\
q2, \text{IDENTIFICADOR} \implies q3 \\
q2, \text{NUMERO} \implies q3 \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: q3

#### AFD4: Condición

![AFD4](https://github.com/DivorcedLance/compilador-basico/assets/104219610/83d06a02-d968-44ae-9dbc-3896c2b5e6f8)

$$
\begin{aligned}
q0, \text{IDENTIFICADOR} \implies q1 \\
q0, \text{NUMERO} \implies q1 \\
q1, \text{>} \implies q2 \\
q1, \text{<} \implies q2 \\
q2, \text{IDENTIFICADOR} \implies q3 \\
q2, \text{NUMERO} \implies q3 \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: q3

### Autómata de Pila Determinista (APD)

$$
\begin{aligned}
q0, \text{si}, - &\implies q0 \text{ si} \\
q0, \text{sino}, \text{si} &\implies q0 \text{ sino} \\
q0, \text{fsi}, \text{sino} &\implies q0 \&\& \\
q0, \text{fsi}, \text{si} &\implies q0 \& \\
q0, \text{mientras}, - &\implies q0 \text{ mientras} \\
q0, \text{fmientras}, \text{mientras} &\implies q0 \& \\
q0, \$, \text{PO} &\implies qf - \\
\end{aligned}
$$

Estado inicial: q0  
Estados finales: qf

### Descripción de la implementación del parser

Vamos a tener una pila de estados

El scanner llamará al parser con la lista de tokens que tenga hasta ese momento cuando encuentre un salto de linea

El parser leera el primer token de la lista para saber que tipo de token es y en base a eso, sabrá a que autómata llamar (solo tendrá las siguientes posibilidades: APD, AFD1, AFD2, AFD3)

El parser llamará al autómata correspondiente y le pasará la lista de tokens

Si el automata es uno de los AFD:

* Si el AFD reconoce la lista como válida (es decir, llega a un estado final) entonces el scanner continuará leyendo el código repitiendo el proceso

* Si el AFD no reconoce la lista como válida (es decir, no llega a un estado final) entonces tirará un error de sintaxis especificando la linea del error

Si el autómata es el APD:

* Si la lista empieza en si o mientras, entonces llamará al AFD4 con la lista de tokens sin el si o mientras inicial. 

- Si el AFD4 reconoce la lista como válida, entonces se llamará al APD con solo el si o mientras.

- Si el AFD4 no reconoce la lista como válida, entonces se dará un error de sintaxis especificando la linea del error.

Tanto el estado como la pila de AFD se mantendrán en toda la leída del código. 

* Si el APD no tiene una regla de transición para el token dado, entonces se dará un error de sintaxis especificando la linea del error.

* Si el APD sí tiene una regla de transición para el token dado, entonces se regresará al scanner para continuar el proceso.

Al terminar de leer el código si la pila está vacia (P0) enconces el código es válido, si no, entonces se dará un error de sintaxis especificando la linea del último token en la pila.

## Implementación en Código

### Estructura del Proyecto

El proyecto se organiza en múltiples archivos y módulos para facilitar la separación de responsabilidades y la mantenibilidad del código:

- `scanner.js`: Contiene la implementación del analizador léxico.
- `parser.js`: Implementa el analizador sintáctico y decide qué autómata llamar.
- `index.html`: Interfaz gráfica del usuario para la entrada del código y visualización de resultados.

### Funciones Principales

#### Función `run()`

Esta función se invoca cada vez que se presiona el botón "Ejecutar" o se utiliza el atajo `Ctrl+Enter`. Coordina la ejecución del analizador léxico y sintáctico y actualiza la salida en la interfaz de usuario.

#### Eventos DOM

Se utilizan eventos DOM para gestionar la interacción con el usuario, como la actualización de números de línea en tiempo real y el desplazamiento del área de texto.

#### Copiar al Portapapeles

Se proporcionan funciones para copiar el código y la salida al portapapeles del usuario, mejorando así la usabilidad del proyecto.

### Tratamiento de Errores

El proyecto tiene un sistema robusto para el manejo de errores, que proporciona mensajes de error detallados que especifican el tipo y la línea del error.

### Flujo de Trabajo

1. El scanner invoca al parser cada vez que encuentra un salto de línea, pasándole la lista de tokens recolectados hasta ese momento. Si se encuentra algún token no reconocido, el propio scanner lanza un error de léxico.
2. El parser identifica qué autómata debe ser llamado para procesar la lista de tokens.
3. Si se llega a un estado final, el proceso continúa; de lo contrario, se lanza un error de sintaxis.

## Cómo ejecutar el proyecto

Para ejecutar el proyecto, siga estos pasos:

1. Clone el repositorio en su máquina local.
2. Abra el archivo `index.html` en su navegador.
3. Ingrese el código a analizar en el área de texto.
4. Presione el botón "Ejecutar" o utilice el atajo `Ctrl + Enter`.

# Código:

index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Compilador</title>
  <link rel="stylesheet" href="css/styles.css">
  <script src="https://kit.fontawesome.com/03cff3d805.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="button-container">
    <button id="run-button"><i class="fa-solid fa-play"></i>Ejecutar</button>
    
  </div>
  
  <div class="container">
    <div class="left">
      <label><i class="fa-solid fa-code"></i>Código<i  id="copy-code-button" class="fa-regular fa-clipboard"></i></label>
      <div class="code-container">
        <textarea id="line-numbers" readonly></textarea>
        <textarea id="code" autofocus cols="30" rows="10"></textarea>
      </div>
    </div>
    <div class="right">
      <label><i class="fa-solid fa-terminal"></i>Salida<i id="copy-output-button" class="fa-regular fa-clipboard"></i></label>
      <textarea id="output" readonly></textarea>
    </div>
  </div>
  
  <script type="module" src="js/app.js"></script>
  <script type="module" src="js/error.js"></script>
  <script type="module" src="js/parser.js"></script>
  <script type="module" src="js/scanner.js"></script>
</body>
</html>

```

styles.css
```css
* {
  margin: 0;
  padding: 0;
  font-family: 'Poppins' ,sans-serif;
  box-sizing: border-box;
}
body {
  background:#454545;
  color: #fff;
}
.container {
  width: 100%;
  height: 93vh;
  padding: 20px;
  display: flex;
}

.button-container {
  width: 100%;
  height: 5vh;
  padding: 0px;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.left, .right {
  flex-basis: 100%;
  padding: 10px;
}

textarea {
  width: 100%;
  height: 95%;
  background: #1f1f1f;
  color: #fff;
  padding: 10px 20px;
  border: 0;
  outline: 0;
  font-size: 18px;
  resize: none;
}

textarea#output {
  background: #fff;
  color: #1f1f1f;
}

label i {
  margin-right: 10px;
  margin-left: 10px;
}

button i {
  margin-right: 10px;
}

label {
  display: flex;
  align-items: center;
  background: #000;
  height: 30px;
}

.fa-clipboard {
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
}

.code-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

#line-numbers {
  padding: 10px 0;
  color: #fff;
  font-size: 18px;
  line-height: 1.5;
  white-space: pre;
  overflow-y: hidden;
  overflow-x: hidden;
  background-color: #1f1f1f;
  width: 30px;
  text-align: right;
  /* margin-right: 5px; */
  height: 95%;
}

textarea {
  margin-left: 0px;
  font-size: 18px;
  line-height: 1.5;
  padding: 10px 20px;
  flex-grow: 1;
}

#run-button {
  background-color: #1f1f1f; 
  color: #fff; 
  padding: 5px 20px; 
  border: none; 
  cursor: pointer; 
  border-radius: 5px; 
  font-size: 16px; 
}


#run-button:hover {
  background-color: #2f2f2f;
}
```

app.js

```js
// Importar los módulos scanner y parser
import { Scanner } from './scanner.js';
import { Parser } from './parser.js';

// Función principal para correr el compilador
function run() {

  // Instanciar las clases Scanner y Parser
  const parser = new Parser();
  const scanner = new Scanner();

  // Obtener el código ingresado y el elemento de salida
  let code = document.getElementById('code').value;
  let output = document.getElementById('output');

  // Separar el código por líneas
  let lines = code.split('\n');
  let resultado = true; // Variable para almacenar el resultado del análisis

  // Limpiar la salida anterior
  output.value = '';
  
  // Bucle para analizar cada línea del código
  for (const line of lines) {
    // Analisis léxico
    const tokens = scanner.scanLine(line);
    if (tokens === false) {
      resultado = false;
      break;
    }
    // Análisis sintáctico
    if (parser.parse(tokens) === false) {
      output.value += "El código no es válido en la línea: " + (scanner.linea) + "\n";
      resultado = false;
      break;
    }
    // Incrementar el número de línea
    scanner.linea++;
  }
  
  // Verificar si el código es válido
  if (resultado && parser.evaluarFinalAPD()) {
    output.value += "El código es válido\n";
  }
}

// Al cargar el DOM, añadimos eventos para manejar las líneas
document.addEventListener("DOMContentLoaded", function () {
  const codeTextArea = document.getElementById("code");
  const lineNumbersDiv = document.getElementById("line-numbers");

  // Actualizamos números de línea
  function updateLineNumbers() {
    const lines = codeTextArea.value.split("\n").length;
    let lineNumbers = "";

    for (let i = 1; i <= lines; i++) {
      lineNumbers += i + "\n";
    }

    lineNumbersDiv.textContent = lineNumbers;
  }

  // Eventos para actualizar y sincronizar las líneas
  codeTextArea.addEventListener("input", updateLineNumbers);
  codeTextArea.addEventListener("scroll", function () {
    lineNumbersDiv.scrollTop = codeTextArea.scrollTop;
  });

  updateLineNumbers();
});

// Evento para ejecutar el compilador con Ctrl+Enter
document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.code === 'Enter') {
      run();
  }
});

// Añadimos un evento de clic al botón para ejecutar el compilador
const runButton = document.getElementById('run-button');
runButton.addEventListener('click', run);

// Función para copiar texto al portapapeles
async function copyToClipboard(textAreaId) {
  const textArea = document.getElementById(textAreaId);
  const text = textArea.value; // Obtener el texto del textarea

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('No se pudo copiar el texto', err);
  }
}

// Obtener botones y añadir eventos de clic
document.getElementById('copy-code-button').addEventListener('click', function() {
  copyToClipboard('code');
});

document.getElementById('copy-output-button').addEventListener('click', function() {
  copyToClipboard('output');
});
```

error.js

```js
export function displayError(line, typeError, messageError) {
  console.error(`Linea ${line}: ${typeError}: ${messageError}`);
  const output = document.getElementById('output');
  
  // Mostrar el mensaje en el textarea de salida
  output.value += `Línea ${line}: ${typeError} - ${messageError}\n`;

  const codeArea = document.getElementById('code');

  // Calcular la posición inicial para mover el cursor en el textarea de código
  let startPos = 0;
  for (let i = 0; i < line - 1; i++) {
    startPos = codeArea.value.indexOf('\n', startPos) + 1;
  }

  // Encontrar la posición del carácter de nueva línea que indica el final de la línea
  let endPos = codeArea.value.indexOf('\n', startPos);
  if (endPos === -1) {  // Si no hay un carácter de nueva línea, usar el final del texto
    endPos = codeArea.value.length;
  }

  // Mover el cursor al final de la línea de error
  codeArea.focus();
  codeArea.setSelectionRange(endPos, endPos);
}
```

scanner.js

```js
// Importar la función displayError del módulo 'error.js'.
import { displayError } from './error.js';

// Clase Scanner para la clasificación de tokens en un lenguaje de programación.
export class Scanner {
  constructor() {
    // Definición de los tipos de tokens y las palabras reservadas.
    this.TokenType = {
      PALABRA_RESERVADA: "PALABRA_RESERVADA",
      IDENTIFICADOR: "IDENTIFICADOR",
      OPERADOR: "OPERADOR",
      NUMERO: "NUMERO",
      SIMBOLO: "SIMBOLO",
      DESCONOCIDO: "DESCONOCIDO",
    };

    // Listado de palabras reservadas del lenguaje.
    this.palabrasReservadas = ["entero", "real", "si", "sino", "mientras", "fmientras", "fsi", "imprime"];
    // Inicialización del contador de líneas.
    this.linea = 1;
  }

  // Método para escanear una línea del código y devolver una lista de tokens.
  scanLine(line) {
    let tokens = []; // Array para almacenar los tokens encontrados.
    let lexema = ""; // Almacena el lexema actual que se está analizando.

    // Bucle para recorrer cada carácter de la línea.
    for (let i = 0; i < line.length; i++) {
      const character = line[i]; // Carácter actual.

      // Comprobar si el carácter es un espacio en blanco.
      if (character.match(/\s/)) {
        if (lexema.length > 0) {
          tokens.push(this.clasificarLexema(lexema, this.linea)); // Clasificar el lexema.
          lexema = ""; // Reiniciar el lexema.
        }
      }
      // Si es una letra.
      else if (character.match(/[a-zA-Z]/)) {
        lexema += character;
      }
      // Si es un número.
      else if (character.match(/[0-9]/)) {
        lexema += character;
      }
      // Si es un punto.
      else if (character.match(/[\.]/)) {
        lexema += character;
      }
      // Si es un operador.
      else if (character.match(/[<>=]/)) {
        if (lexema.length > 0) {
          tokens.push(this.clasificarLexema(lexema, this.linea));
          lexema = "";
        }
        lexema += character;
        tokens.push({ type: this.TokenType.OPERADOR, value: lexema, linea: this.linea });
        lexema = "";
      }
      // Si es una coma.
      else if (character.match(/[,]/)) {
        if (lexema.length > 0) {
          tokens.push(this.clasificarLexema(lexema, this.linea));
          lexema = "";
        }
        tokens.push({ type: this.TokenType.SIMBOLO, value: character, linea: this.linea });
      }
      // Si es un carácter desconocido.
      else {
        if (lexema.length > 0) {
          tokens.push(this.clasificarLexema(lexema, this.linea));
          lexema = "";
        }
        lexema += character;
        tokens.push({ type: this.TokenType.DESCONOCIDO, value: lexema, linea: this.linea });
        lexema = "";
      }
    }

    // Verificar si queda un lexema al final.
    if (lexema.length > 0) {
      tokens.push(this.clasificarLexema(lexema, this.linea));
    }

    // Validar los tokens a través del manejo de errores.
    if (!this.manejoErrores(tokens)) {
      return false;
    }

    return tokens;
  }

  // Método para clasificar un lexema y asignarle un tipo de token.
  clasificarLexema(lexema, linea) {
    // Si el lexema es una palabra reservada.
    if (this.palabrasReservadas.includes(lexema)) {
      return { type: this.TokenType.PALABRA_RESERVADA, value: lexema, linea: linea };
    }
    // Si es un identificador válido.
    if (lexema.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      return { type: this.TokenType.IDENTIFICADOR, value: 'IDENTIFICADOR', linea: linea };
    }
    // Si es un número, puede ser entero o decimal.
    if (lexema.match(/^[0-9]+(\.[0-9]+)?$/)) {
      return { type: this.TokenType.NUMERO, value: 'NUMERO', linea: linea };
    }
    // Si el lexema es desconocido.
    return { type: this.TokenType.DESCONOCIDO, value: lexema, linea: linea };
  }

  // Método para manejar los errores de tokens desconocidos.
  manejoErrores(tokens) {
    // Recorre cada token para verificar su tipo.
    for (let i = 0; i < tokens.length; i++) {
      // Si se encuentra un token desconocido, se muestra un error.
      if (tokens[i].type === this.TokenType.DESCONOCIDO) {
        displayError(tokens[i].linea, "Error léxico", `Token desconocido "${tokens[i].value}"`);
        return false;
      }
    }
    return true;
  }
}
```

parser.js

```js
import { displayError } from './error.js';

// Clase Parser que evalúa la sintaxis de los tokens utilizando Autómatas de Pila Determinista (APD) y Autómatas Finitos Deterministas (AFD)
export class Parser {
  constructor() {
    // Inicialización de la pila y del estado del APD
    this.pila = [{'value': 'P0'}]; // Pila para el APD
    this.estadoAPD = 'q0'; // Estado inicial del APD

    // Definición de los autómatas de estados finitos (AFD) para distintas estructuras

    // AFD1 para declaración de variables
    this.AFD1 = {
      'q0': { 'entero': 'q1', 'real': 'q1' },
      'q1': { 'IDENTIFICADOR': 'q2' },
      'q2': { '=': 'q3', ',': 'q1' },
      'q3': { 'NUMERO': 'q4' },
      'q4': { ',': 'q1' },
      'estado_final': ['q2', 'q4']
    };
    
    // AFD2 para la función imprime
    this.AFD2 = {
      'q0': { 'imprime': 'q1' },
      'q1': { 'IDENTIFICADOR': 'q2', 'NUMERO': 'q2' },
      'q2': { ',': 'q1' },
      'estado_final': ['q2']
    };
    
    // AFD3 para asignaciones
    this.AFD3 = {
      'q0': { 'IDENTIFICADOR': 'q1' },
      'q1': { '=': 'q2' },
      'q2': { 'IDENTIFICADOR': 'q3', 'NUMERO': 'q3' },
      'estado_final': ['q3']
    };
    
    // AFD4 para condicionales
    this.AFD4 = {
      'q0': { 'IDENTIFICADOR': 'q1', 'NUMERO': 'q1' },
      'q1': { '<': 'q2', '>': 'q2' },
      'q2': { 'IDENTIFICADOR': 'q3', 'NUMERO': 'q3' },
      'estado_final': ['q3']
    };
    
    // Definición del autómata de pila (APD) para estructuras de control
    this.APD = {
      'q0': {
        'si': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
        'sino': { 'si': { 'estado': 'q0', 'pila': '+' } },
        'fsi': { 'sino': { 'estado': 'q0', 'pila': '&&' }, 'si': { 'estado': 'q0', 'pila': '&' } },
        'mientras': { 'P0': { 'estado': 'q0', 'pila': '+' }, '-': { 'estado': 'q0', 'pila': '+' } },
        'fmientras': { 'mientras': { 'estado': 'q0', 'pila': '&' } }
      }
    };
  }

  // Método que evalúa la secuencia de tokens utilizando un AFD
  evaluarAFD(afd, tokens) {
    // Inicialización del estado del AFD
    let estado = 'q0';
    let last_token
    // Iteración sobre cada token
    for (const token of tokens) {
      last_token = token;
      // Transición de estados
      if (afd[estado] && afd[estado][token.value]) {
        estado = afd[estado][token.value];
      } else {
        return [false, token]; // error de sintaxis
      }
    }
    // Verificación del estado final
    if (afd['estado_final'].includes(estado)) {
      return [true];
    } else {
      return [false, last_token]; // error de sintaxis
    }
  }

  // Método que evalúa los tokens utilizando un APD
  evaluarAPD(token) {
    let topePila = this.pila[this.pila.length - 1];
    const transicion = this.APD[this.estadoAPD][token.value][topePila.value] || this.APD[this.estadoAPD][token.value]['-'];
        if (transicion) {
      this.estadoAPD = transicion.estado;
      this.actualizarPila(transicion.pila, token);
      return true;
    } 
    else {
      return false; // error de sintaxis
    }
  }

  // Método para actualizar el estado de la pila de APD
  actualizarPila(toke_apilado, token) {
    // Manipulación de la pila según el token
    if (toke_apilado == "&") {
      this.pila.pop();
    } else if (toke_apilado == "&&") {
      this.pila.pop();
      this.pila.pop();
    } else if (toke_apilado == "+") {
      this.pila.push(token);
    }
    // En el caso de que el token sea - no se hace nada
  }

  // Método para evaluar el estado final del APD
  evaluarFinalAPD() {
    // Verificación del estado final de la pila
    if (this.pila[this.pila.length-1].value !== 'P0') {
      // En caso de error
      displayError(this.pila[this.pila.length-1].linea, "Error de sintaxis", `no se puede manejar el token "${this.pila[this.pila.length-1].value}"`);
      return false;
    }
    return true;
  }

  // Método principal para el análisis sintáctico
  parse(tokens) {
    if (tokens.length === 0) {
      return true;
    }
    let initial_token_value = tokens[0].value;
    if (["si", "sino", "fsi", "mientras", "fmientras"].includes(initial_token_value)) {
      if (!this.evaluarAPD(tokens[0])) {
        displayError(tokens[0].linea, "Error de sintaxis", `no se puede manejar el token "${tokens[0].value}"`);
        return false;
      } else {
        let res = this.evaluarAFD(this.AFD4, tokens.slice(1));
        if (["si", "mientras"].includes(initial_token_value) && !res[0]) {
          displayError(res[1].linea, "Error de sintaxis", `no se puede manejar el token "${res[1].value}" en la condicional`);
          return false;
        }
      }
    } else if (initial_token_value === "entero" || initial_token_value === "real") {
      let res = this.evaluarAFD(this.AFD1, tokens)
      if (!res[0]) {
        displayError(res[1].linea, "Error de sintaxis", `no se puede manejar el token "${res[1].value}" en la declaración de variable`);
        return false;
      }
    } else if (initial_token_value === "imprime") {
      let res = this.evaluarAFD(this.AFD2, tokens)
      if (!res[0]) {
        displayError(res[1].linea, "Error de sintaxis", `no se puede manejar el token "${res[1].value}" en la función`);
        return false;
      }
    } else if (initial_token_value === "IDENTIFICADOR") {
      let res = this.evaluarAFD(this.AFD3, tokens)
      if (!res[0]) {
        displayError(res[1].linea, "Error de sintaxis", `no se puede manejar el token "${res[1].value}" en la asignación`);
        return false;
      }
    }
    return true;
  }
}
```

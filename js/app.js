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

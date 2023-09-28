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
  

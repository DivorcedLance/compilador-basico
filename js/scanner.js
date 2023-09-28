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

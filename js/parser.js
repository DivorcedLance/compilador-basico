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
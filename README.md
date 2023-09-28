# Proyecto de Analizador Léxico y Sintáctico

## Descripción

Este proyecto es una implementación de un analizador léxico y sintáctico basado en Autómatas Finitos Determinísticos (AFD) y un Autómata de Pila Determinista (APD). Está diseñado para reconocer y validar un conjunto específico de tokens y estructuras de control en un lenguaje de programación personalizado.

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

## Contribuciones y Mantenimiento

Este proyecto es mantenido por DivorcedLance. Para contribuir, por favor, haga un 'fork' del repositorio y proponga sus cambios a través de un 'pull request'.

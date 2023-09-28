# Proyecto de Analizador Léxico y Sintáctico

## Descripción

Este proyecto es una implementación de un analizador léxico y sintáctico basado en Autómatas Finitos Determinísticos (AFD) y un Autómata de Pila Determinista (APD). Está diseñado para reconocer y validar un conjunto específico de tokens y estructuras de control en un lenguaje de programación personalizado.

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

## Tokens Iniciales

Los tokens reconocidos por el proyecto se dividen en categorías. Los principales son:

### Palabras Reservadas
* `si`, `sino`, `fsi`, `mientras`, `fmientras`: Gestionados por APD.
* `enter`, `real`: Gestionados por AFD1.
* `imprime`: Gestionado por AFD2.

### Identificadores
* Gestionados por AFD3.

## Autómatas Finitos Determinísticos (AFD)

### AFD1: Declaración de Variables

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

### AFD2: Imprimir
Estado inicial: q0  
Estados finales: q2

### AFD3: Asignación
Estado inicial: q0  
Estados finales: q3

### AFD4: Condición
Estado inicial: q0  
Estados finales: q3

## Autómata de Pila Determinista (APD)

Estado inicial: q0  
Estados finales: qf

## Implementación del Parser

El parser actúa como intermediario entre el scanner y los autómatas. Se implementa una pila de estados para gestionar el flujo de tokens.

### Flujo de Trabajo

1. El scanner invoca al parser cada vez que encuentra un salto de línea, pasándole la lista de tokens recolectados hasta ese momento.
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
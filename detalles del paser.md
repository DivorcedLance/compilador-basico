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

### AFD3: Asignación

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

### AFD4: Condición

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

## Autómata de Pila Determinista (APD)

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

## Descripción de la implementación del parser

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
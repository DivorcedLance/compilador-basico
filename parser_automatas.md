# Initial Tokens:

## PALABRA_RESERVADA
si, sino, fsi, mientras, fmientras: APD
enter, real: AFD1
imprime: AFD2

## IDENTIFICADOR
AFD3

# AFD

## AFD1: Declaración

q0, entero: q1
q0, real: q1
q1, IDENTIFICADOR: q2
q2, =: q3
q3, NUMERO: q4
q4, ,: q1

Estado inicial: q0
Estados finales: q2, q4

## AFD2: Imprimir

q0, imprime: q1
q1, IDENTIFICADOR: q2
q1, NUMERO: q2
q2, ,: q1

Estado inicial: q0
Estados finales: q2

## AFD3: Asignación

q0, IDENTIFICADOR: q1
q1, =: q2
q2, IDENTIFICADOR: q3
q2, NUMERO: q3

Estado inicial: q0
Estados finales: q3

## AFD4: Condición

q0, IDENTIFICADOR: q1
q0, NUMERO: q1
q1, >: q2
q1, <: q2
q2, IDENTIFICADOR: q3
q2, NUMERO: q3

Estado inicial: q0
Estados finales: q3

## APD: Estructura de control

q0, si, - : q0 si
q0, sino, si : q0 sino
q0, fsi, sino : q0 &&
q0, fsi, si : q0 &
q0, mientras, - : q0 mientras
q0, fmientras, mientras : q0 &
q0, $, PO: qf -

Estado inicial: q0
Estados finales: qf

# Descripción de la implementación del parser

Vamos a tener una pila de estados

El scanner llamará al parser con la lista de tokens que tenga hasta ese momento cuando encuentre un salto de linea

El parser leera el primer token de la lista para saber que tipo de token es y en base a eso, sabrá que autómata llamar (solo tendrá las siguientes posibilidades: APD, AFD1, AFD2, AFD3)

El parser llamará al autómata correspondiente y le pasará la lista de tokens

Si el automata es uno de los AFD:

  Si el AFD reconoce la lista como válida (es decir, llega a un estado final) entonces el scanner continuará leyendo el código repitiendo el proceso

  Si el AFD no reconoce la lista como válida (es decir, no llega a un estado final) entonces tirará un error de sintaxis especificando la linea del error

Si el autómata es el APD:

Si la lista empieza en si o mientras, entonces llamará al AFD4 con la lista de tokens sin el si o mientras inicial. 

  Si el AFD4 reconoce la lista como válida, entonces se llamará al APD con solo el si o mientras.

  Si el AFD4 no reconoce la lista como válida, entonces se dará un error de sintaxis especificando la linea del error.

Tanto el estado como la pila de AFD se mantendrán en toda la leída del código. 

Si el APD no tiene una regla de transición para el token dado, entonces se dará un error de sintaxis especificando la linea del error.

Si el APD sí tiene una regla de transición para el token dado, entonces se regresará al scanner para continuar el proceso.

Al terminar de leer el código se enviará al APD el token de fin de archivo ($). Si la pila está vacia (P0) enconces el código es válido, si no, entonces se dará un error de sintaxis especificando la linea del último token en la pila.


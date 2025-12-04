# Análisis Técnico - Respuestas

## Pregunta A: Sincronización de Estado entre Pestañas

El equipo de producto requiere una nueva funcionalidad: si un usuario tiene el dashboard abierto en dos pestañas del navegador y actualiza un filtro en una, la otra pestaña debe reflejar este cambio automáticamente sin recargar la página.

### ¿Qué enfoque técnico propondrías para implementar esto?

<!-- Tu respuesta aquí -->
Buscando la solución a esta feature, encontre una api BroadCastChanel para sincronizar el estado eentre pestañas.


### ¿Qué implicaciones tiene tu solución a nivel de cliente y servidor?

<!-- Tu respuesta aquí -->
- ligera, solo requier esuchar y emitir mensajes
- alto rendimiento, no penalizaria en gran cantidad el performance
- compatible con la gran mayoria de los navegadores

### Compara brevemente dos estrategias posibles y justifica tu elección final (Costo vs. Beneficio).

<!-- Tu respuesta aquí -->
WebSockets:
- Implica desarrollaar backend
- Usada para aplicaciones donde hay mas usuarios, para aplicaiones mas robustas que necesitan manejar gran cantidad de peticiones
- Coste de procesamiento de servidor
- Innesaria para la solcion actual

BroadCastChanel:
- Reside en el cliente
- Ligera y rapida para la solucion actual
- No necesita el servidor para funcionar

Para esta feature actual, recomendaria mucho mas BroadCastChanel por su simplicidad y requerimientos de la aplicacion, menos costo y noa agrega complejidad innecesaria.

---

## Pregunta B: Comportamiento del Ciclo de Vida

Durante las pruebas en el entorno de desarrollo, se observó que el `useEffect` encargado de la carga inicial de datos se ejecuta dos veces consecutivas. Se ha sugerido utilizar un `useRef` para bloquear la segunda ejecución y evitar "peticiones duplicadas".

### ¿Implementarías esta solución en el código? Justifica tu respuesta técnica.

<!-- Tu respuesta aquí -->

- No seria necesario, la dobel renderizacion solo ocurre en modo desarrollo cuando esta activado el Strict Mode

### ¿Qué nos indica este comportamiento sobre el entorno de ejecución de React moderno?

<!-- Tu respuesta aquí -->
- Indica que React busca detectar efectos secundarios no seguros, se verifican dos veces, en entorno de desarrollo se busca la mejor robustez posible, no performance
- El produccion el useEffect solo se ejecura una sola vez, por lo que no es necesario usar el useRef
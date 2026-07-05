# Plantilla de LECCION.md

Usa esta estructura para cada lección. Las secciones marcadas (opcional) se incluyen solo si aportan al tema.

```markdown
# Módulo NN: [Título del tema]

> **Nivel:** Trainee | Junior | Semi-Senior
> **Requisitos previos:** módulos X, Y
> **Duración estimada:** N horas

## 🌍 ¿Por qué este módulo?

[OBLIGATORIO. 2-3 líneas antes de cualquier teoría: qué problema real resuelve este tema en el contexto de código profesional, qué tipo de decisión de arquitectura o debugging habilita, y cómo conecta con lo aprendido antes. El objetivo es que el alumno entienda el criterio antes de ver el código. Ejemplo para el event loop: "Cada vez que tu app se congela, responde lento o los resultados async aparecen en el orden incorrecto, el problema está en no entender cómo JS ejecuta el código por debajo. Entender el event loop no es trivia: es la herramienta que te permite diagnosticar esos bugs en producción."]

## 🎯 Objetivos de aprendizaje

Al terminar este módulo vas a poder:
- [objetivo verificable 1]
- [objetivo verificable 2]
- [3 a 5 objetivos en total]

## 🧠 [Concepto 1]

[Explicación breve del concepto.]

**🤔 ¿Por qué?** [OBLIGATORIO siempre que se pueda o deba: responder por qué existe esto, por qué se hace así y no de otra forma, qué problema resuelve, y la razón histórica o de diseño del lenguaje si la hay. En Trainee: acompañar con una analogía cotidiana. En Semi-Senior: incluir el "cómo funciona por debajo".]

### Ejemplo guiado

> 📂 El código completo de este ejemplo está en `ejemplos/NN-nombre.js`. Córrelo desde la carpeta del módulo con: `node ejemplos/NN-nombre.js`
> (Indicar SIEMPRE esta referencia al archivo real de `ejemplos/` en cada ejemplo guiado.)

[Construir el ejemplo paso a paso. Cada paso: el código nuevo + qué hace + por qué.]

```js
// Paso 1: ...
const ejemplo = "...";
```

[Qué se ve al ejecutarlo:]

```
salida esperada
```

### Pruébalo tú

[Variación mínima que el lector hace sobre el ejemplo antes de seguir.
Una sola consigna corta, p. ej.: "Cambia X por Y. ¿Qué esperas que pase? Ejecútalo y verifica."]

## 🧠 [Concepto 2]

[Repetir el patrón: concepto → ejemplo guiado → pruébalo tú]

## ⚠️ Errores comunes

| Error | Por qué pasa | Cómo evitarlo |
|-------|-------------|---------------|
| [error típico 1] | ... | ... |
| [2 a 4 errores] | ... | ... |

## 📌 Resumen

- [idea clave 1, una línea]
- [3 a 6 ideas]

## 💼 Preguntas de entrevista técnica

Practicá respondiendo estas en voz alta o por escrito antes de buscar la respuesta. Son del tipo que hacen en entrevistas para puestos Semi-Senior/Senior.

1. [Pregunta de profundidad técnica: "Explicá cómo funciona X por debajo"]
2. [Pregunta de trade-offs: "¿Cuándo usarías X y cuándo no? ¿Qué desventajas tiene?"]
3. [Pregunta de debugging/performance: "¿Cómo detectarías / resolverías...?"]
4. [Pregunta de arquitectura: "¿Cómo organizarías / diseñarías...?"]
5. [Pregunta de código: snippet con comportamiento no obvio → "¿Qué imprime esto y por qué?"]

<details><summary>Ver respuestas orientativas</summary>

[Respuestas con razonamiento completo: no solo el "qué" sino el "por qué" y los trade-offs.]
</details>

## ➡️ Siguiente paso

Ahora ve a `practica/EJERCICIOS.md`. Cuando los termines, el proyecto del módulo está en `proyecto/PROYECTO.md`.
```

## Plantilla de EJERCICIOS.md

```markdown
# Ejercicios — Módulo NN: [tema]

Resuélvelos en orden. Los archivos starter están en `starter/`. Cada ejercicio trae su pista y su solución OCULTAS en bloques desplegables (spoiler): no las abras hasta intentarlo al menos 15 minutos. No se crea carpeta `soluciones/`: la solución vive aquí, plegada.

## Ejercicio 1: [nombre] ⭐
**Enunciado:** ...
**Ejemplo:** entrada `X` → salida `Y`
**Archivo:** `starter/01-nombre.js`

<details><summary>💡 Pista</summary>
[pista que orienta sin resolver]
</details>

<details><summary>✅ Solución (ábrela solo después de intentarlo)</summary>

```js
// solución comentada, explicando el porqué de cada decisión
```

[2-3 líneas sobre por qué se resuelve así.]
</details>

## Ejercicio 2: [nombre] ⭐⭐
[... dificultad creciente: ⭐ a ⭐⭐⭐ ...]
```

## Plantilla de PROYECTO.md

```markdown
# Proyecto: [nombre]

## Contexto
[2-3 líneas de historia que le dan sentido al proyecto]

## Requisitos funcionales
1. [requisito verificable]
2. [...]

## Criterios de aceptación
- [ ] [comportamiento observable que el estudiante puede auto-verificar]
- [ ] [...]

## Reglas
- Solo puedes usar conceptos vistos hasta el módulo NN.
- [otras restricciones si aplican]

## 🚀 Extras (opcionales)
- [reto adicional 1]
- [reto adicional 2]

## Cómo empezar
El esqueleto está en `starter/`. [Instrucciones para correrlo.]
```

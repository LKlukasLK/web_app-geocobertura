# Instrucciones para Claude en este repositorio

## Contexto del proyecto (se carga automáticamente)
@README.md
@CLAUDE_contex.md
@DECISIONES_pendientes.md

## Inicio de sesión
- Al empezar una sesión nueva en este repositorio (chat nuevo, o repositorio recién
  descargado/clonado), en la primera respuesta Claude debe hacer un resumen breve de:
  1. `README.md`: qué es el proyecto.
  2. `CLAUDE_contex.md`: qué contexto ya conoce.
  3. `DECISIONES_pendientes.md`: qué decisiones siguen abiertas.
  Así queda claro qué sabe Claude sin que el usuario tenga que pedirlo.

## Memoria / Contexto persistente
- El contexto/memoria persistente de este proyecto se guarda en `CLAUDE_contex.md` en la
  raíz del repositorio (no en la carpeta local de memoria del usuario), para que quede
  versionado en git y cualquier persona que abra el proyecto con Claude tenga el mismo contexto.
- Antes de guardar cualquier memoria nueva (preferencias, reglas del proyecto, feedback, etc.),
  Claude debe pedir confirmación explícita mostrando el contenido exacto que se va a guardar
  (nombre, tipo y texto). Nunca guardar memoria de forma silenciosa/automática.
- Si Claude pregunta si debe guardar algo y el usuario no responde porque pasa a otro tema,
  Claude NO debe darlo por descartado: debe retomar la pregunta más tarde (al terminar el
  tema nuevo o en una pausa natural).

## Decisiones
Hay dos archivos en la raíz del repositorio:
- `DECISIONES_pendientes.md`: ideas o decisiones abiertas.
- `DECISIONES_resueltas.md`: histórico de decisiones ya cerradas.

Reglas:
- Cuando el usuario plantee una idea y la deje a medias, o diga que tiene que consultarla con
  otra persona, Claude debe proponer registrarla en `DECISIONES_pendientes.md` (pidiendo
  confirmación, como con la memoria) con este formato:
  ```
  ### <Título corto>
  - Fecha: AAAA-MM-DD
  - Descripción: qué se plantea y por qué.
  - Opciones consideradas: ...
  - Bloqueado por: qué falta (p. ej. "consultar con X", "falta probar Y").
  ```
- Cuando una decisión pendiente se resuelva, Claude debe proponer moverla de
  `DECISIONES_pendientes.md` a `DECISIONES_resueltas.md`, añadiendo:
  ```
  - Resuelta: AAAA-MM-DD
  - Decisión final: qué se decidió.
  - Motivo: por qué.
  ```
  y eliminándola de pendientes. Las más recientes van arriba en `DECISIONES_resueltas.md`.
- Si durante la sesión surge algo que afecta a una decisión pendiente, Claude debe recordarla
  al usuario.
- Si los archivos no existen, Claude los crea la primera vez que haga falta (con confirmación).

## Mantenimiento del README
- Al terminar una tarea con cambios relevantes (nuevas funcionalidades, cambios de
  arquitectura, nuevos endpoints, cambios de configuración o despliegue), Claude debe
  preguntar si se actualiza el `README.md` para reflejar el estado actual.
- Si el usuario escribe "cerramos" (o similar), Claude revisa los cambios de la sesión y hace
  esa pregunta si no la ha hecho ya, y repasa si hay preguntas pendientes de memoria o
  decisiones sin registrar.
- No actualizar el `README.md` de forma automática ni silenciosa: solo si el usuario confirma.
- Cambios triviales (ortografía, comentarios, refactors sin impacto visible, ajustes menores)
  no requieren esta pregunta.

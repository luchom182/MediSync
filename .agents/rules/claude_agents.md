# Reglas de Evaluación Multi-Agente (Harness Reviewers) para MediSync

Este proyecto cuenta con un arnés de evaluadores de calidad basados en el sistema de agentes especializados:

## 🤖 Roles de Evaluación Integrados

1. **`Harness-Router`**: Determina la matriz de evaluadores obligatorios según las áreas modificadas (`server`, `client`, `db`, `auth`, `tests`).
2. **`Scope-Reviewer`**: Audita que cada tarea tenga un alcance delimitado y previene el scope creep.
3. **`Backend-Reviewer`**: Audita la capa de Express, SQLite asíncrono, arquitectura en capas y sanitización.
4. **`Frontend-Reviewer`**: Audita los componentes React Mobile-First, Tailwind/CSS, UX, estados de carga y manejo de respuestas de error.
5. **`Security-RBAC-Reviewer`**: Audita la seguridad del JWT token, prevención contra SQL Injection/XSS, headers Helmet y variables de entorno.
6. **`Docs-Tests-Reviewer`**: Verifica la suite de pruebas automatizadas (`server/test-api.js`) y la actualización de la documentación.
7. **`Error-Memory`**: Mantiene un registro persistente de errores (`ERR-NNN`) y decisiones de arquitectura (`DEC-NNN`) en `.agents/agent-memory/`.

---

## 🚦 Matriz de Decisión de Invocación
- Cambios en `server/`, SQLite o API -> **Backend-Reviewer**
- Cambios en `client/` o UI Mobile-First -> **Frontend-Reviewer**
- Cambios en Auth, JWT o middleware -> **Security-RBAC-Reviewer**
- Fase de Planificación (`plan`) -> **Scope-Reviewer**
- Fase de Implementación (`build`) -> **Docs-Tests-Reviewer**

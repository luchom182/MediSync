# Graph Report - APP_CITAS  (2026-07-23)

## Corpus Check
- 45 files · ~16,389 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 362 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f35f145`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DashboardPage.jsx
- get
- dependencies
- client/package.json
- authController.js
- backend:routes:api
- app.js
- 🏥 CitaMed & Docs Checklist - Plataforma de Gestión de Citas Médicas
- usersRoutes.js
- test-api.js
- rules/graphify.md
- workflows/graphify.md
- frontend:app
- frontend:component:appointment-card
- architect:system-spec
- backend:controller:services
- Operations
- Reglas de Evaluación Multi-Agente (Harness Reviewers) para MediSync
- backend-reviewer.md
- docs-tests-reviewer.md
- frontend-reviewer.md
- harness-router.md
- security-rbac-reviewer.md
- scope-reviewer.md
- ☁️ Guía de Despliegue Gratuito y Gestión de Archivos (Fotos & PDFs) - MediSync
- authController.js

## God Nodes (most connected - your core abstractions)
1. `get()` - 22 edges
2. `run()` - 18 edges
3. `useAuth()` - 9 edges
4. `query()` - 8 edges
5. `Persistent Agent Memory` - 8 edges
6. `api` - 7 edges
7. `createCita()` - 7 edges
8. `Your Core Responsibilities` - 7 edges
9. `updateCita()` - 6 edges
10. `verifyToken()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `getFamiliares()` --calls--> `query()`  [EXTRACTED]
  server/src/controllers/familiaresController.js → server/src/config/database.js
- `getMe()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js
- `googleAuth()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js
- `login()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "DashboardPage.jsx"
Cohesion: 0.16
Nodes (14): App(), AppContent(), AppointmentCard(), AppointmentDetailModal(), CreateAppointmentModal(), DocumentChecklist(), FamilyManagerModal(), Navbar() (+6 more)

### Community 1 - "get"
Cohesion: 0.21
Nodes (15): query(), createCita(), { generateGoogleCalendarUrl, syncToGoogleCalendarAPI }, getCitaById(), getCitas(), { query, get, run }, updateCita(), { addDocumento } (+7 more)

### Community 2 - "dependencies"
Cohesion: 0.08
Nodes (24): bcryptjs, cors, dotenv, express, google-auth-library, googleapis, jsonwebtoken, dependencies (+16 more)

### Community 3 - "client/package.json"
Cohesion: 0.10
Nodes (20): dependencies, lucide-react, react, react-dom, devDependencies, vite, @vitejs/plugin-react, name (+12 more)

### Community 4 - "authController.js"
Cohesion: 0.11
Nodes (29): db, dbPath, get(), path, run(), sqlite3, register(), deleteCita() (+21 more)

### Community 5 - "backend:routes:api"
Cohesion: 0.13
Nodes (16): architect:db-schema, backend:config:db, backend:controller:appointments, backend:controller:auth, backend:middleware:auth, backend:middleware:security, backend:model:appointment, backend:model:user (+8 more)

### Community 6 - "app.js"
Cohesion: 0.14
Nodes (11): app, authRoutes, citasRoutes, cors, documentosRoutes, dotenv, errorHandler, express (+3 more)

### Community 7 - "🏥 CitaMed & Docs Checklist - Plataforma de Gestión de Citas Médicas"
Cohesion: 0.20
Nodes (9): 🏛️ Arquitectura y Roles de Agentes Especializados, 🔒 Características de Seguridad & UX Destacadas, 📁 Estructura del Proyecto, 🚀 Guía de Instalación y Ejecución Local, 🏥 MediSync - Plataforma de Gestión de Citas Médicas & Checklist Documental, Paso 1: Iniciar el Servidor Backend, Paso 2: Iniciar la Aplicación Frontend, Paso 3: Ejecutar Pruebas Automatizadas QA & Security (+1 more)

### Community 8 - "usersRoutes.js"
Cohesion: 0.10
Nodes (19): 1. Understand Before Building, 2. Table Quality Standard, 3. File Structure, 4. Code Rules (from CLAUDE.md), 5. Tailwind Conventions, 6. Testing Standard, Before recommending from memory, Decision Framework (+11 more)

### Community 9 - "test-api.js"
Cohesion: 0.67
Nodes (3): http, request(), runAudit()

### Community 17 - "Operations"
Cohesion: 0.25
Nodes (7): lookup <query>, Operations, record decision, record error, Rules, summary, update <id> <field>=<value>

### Community 18 - "Reglas de Evaluación Multi-Agente (Harness Reviewers) para MediSync"
Cohesion: 0.50
Nodes (3): 🚦 Matriz de Decisión de Invocación, Reglas de Evaluación Multi-Agente (Harness Reviewers) para MediSync, 🤖 Roles de Evaluación Integrados

### Community 19 - "backend-reviewer.md"
Cohesion: 0.50
Nodes (3): Mandatory references, Output format, Review checklist

### Community 20 - "docs-tests-reviewer.md"
Cohesion: 0.50
Nodes (3): Mandatory references, Output format, Review checklist

### Community 21 - "frontend-reviewer.md"
Cohesion: 0.50
Nodes (3): Mandatory references, Output format, Review checklist

### Community 22 - "harness-router.md"
Cohesion: 0.50
Nodes (3): CRITICAL RULES, Decision rules, Output format (EXACT — do not deviate)

### Community 23 - "security-rbac-reviewer.md"
Cohesion: 0.50
Nodes (3): Mandatory references, Output format, Review checklist

### Community 25 - "☁️ Guía de Despliegue Gratuito y Gestión de Archivos (Fotos & PDFs) - MediSync"
Cohesion: 0.33
Nodes (5): 🏛️ Arquitectura de Producción Recomendada (Tier Gratuito), 📋 Decisiones Arquitectónicas Registradas, 📸 Flujo Futuro de Carga de Archivos (Fotos & PDFs), ☁️ Guía de Despliegue Gratuito y Gestión de Archivos (Fotos & PDFs) - MediSync, 📊 Matriz de Servicios Gratuitos

### Community 26 - "authController.js"
Cohesion: 0.11
Nodes (19): bcrypt, client, { get, run }, getMe(), googleAuth(), jwt, { JWT_SECRET }, login() (+11 more)

## Knowledge Gaps
- **132 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get()` connect `authController.js` to `get`, `authController.js`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `run()` connect `authController.js` to `get`, `authController.js`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `authController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10588235294117647 - nodes in this community are weakly interconnected._
- **Should `backend:routes:api` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
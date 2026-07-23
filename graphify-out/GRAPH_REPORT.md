# Graph Report - APP_CITAS  (2026-07-22)

## Corpus Check
- 30 files · ~7,673 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 179 nodes · 254 edges · 17 communities (11 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `get()` - 17 edges
2. `run()` - 13 edges
3. `useAuth()` - 9 edges
4. `api` - 6 edges
5. `query()` - 6 edges
6. `createCita()` - 5 edges
7. `updateCita()` - 5 edges
8. `verifyToken()` - 5 edges
9. `🏥 MediSync - Plataforma de Gestión de Citas Médicas & Checklist Documental` - 5 edges
10. `🚀 Guía de Instalación y Ejecución Local` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AppContent()` --calls--> `useAuth()`  [EXTRACTED]
  client/src/App.jsx → client/src/context/AuthContext.jsx
- `getMe()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js
- `login()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js
- `register()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/authController.js → server/src/config/database.js
- `getProfile()` --calls--> `get()`  [EXTRACTED]
  server/src/controllers/usersController.js → server/src/config/database.js

## Import Cycles
- None detected.

## Communities (17 total, 6 thin omitted)

### Community 0 - "DashboardPage.jsx"
Cohesion: 0.17
Nodes (13): App(), AppContent(), AppointmentCard(), AppointmentDetailModal(), CreateAppointmentModal(), DocumentChecklist(), Navbar(), AuthContext (+5 more)

### Community 1 - "get"
Cohesion: 0.17
Nodes (22): db, dbPath, get(), path, query(), run(), sqlite3, createCita() (+14 more)

### Community 2 - "dependencies"
Cohesion: 0.10
Nodes (20): bcryptjs, cors, dotenv, express, jsonwebtoken, dependencies, bcryptjs, cors (+12 more)

### Community 3 - "client/package.json"
Cohesion: 0.10
Nodes (20): dependencies, lucide-react, react, react-dom, devDependencies, vite, @vitejs/plugin-react, name (+12 more)

### Community 4 - "authController.js"
Cohesion: 0.12
Nodes (17): bcrypt, { get, run }, getMe(), jwt, { JWT_SECRET }, login(), register(), jwt (+9 more)

### Community 5 - "backend:routes:api"
Cohesion: 0.13
Nodes (16): architect:db-schema, backend:config:db, backend:controller:appointments, backend:controller:auth, backend:middleware:auth, backend:middleware:security, backend:model:appointment, backend:model:user (+8 more)

### Community 6 - "app.js"
Cohesion: 0.15
Nodes (10): app, authRoutes, citasRoutes, cors, documentosRoutes, dotenv, errorHandler, express (+2 more)

### Community 7 - "🏥 CitaMed & Docs Checklist - Plataforma de Gestión de Citas Médicas"
Cohesion: 0.20
Nodes (9): 🏛️ Arquitectura y Roles de Agentes Especializados, 🔒 Características de Seguridad & UX Destacadas, 📁 Estructura del Proyecto, 🚀 Guía de Instalación y Ejecución Local, 🏥 MediSync - Plataforma de Gestión de Citas Médicas & Checklist Documental, Paso 1: Iniciar el Servidor Backend, Paso 2: Iniciar la Aplicación Frontend, Paso 3: Ejecutar Pruebas Automatizadas QA & Security (+1 more)

### Community 8 - "usersRoutes.js"
Cohesion: 0.24
Nodes (8): bcrypt, { get, run }, getProfile(), updateProfile(), express, { getProfile, updateProfile }, router, { verifyToken }

### Community 9 - "test-api.js"
Cohesion: 0.67
Nodes (3): http, request(), runAudit()

## Knowledge Gaps
- **75 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get()` connect `get` to `usersRoutes.js`, `authController.js`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `run()` connect `get` to `usersRoutes.js`, `authController.js`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `client/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `authController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Should `backend:routes:api` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
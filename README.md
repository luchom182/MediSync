# 🏥 MediSync - Plataforma de Gestión de Citas Médicas & Checklist Documental

Plataforma web sincronizada para la gestión de citas médicas y listas de chequeo de documentos, construida con arquitectura **Mobile-First** optimizada para ser portada directamente a **React Native (APK)**.

---

## 🏛️ Arquitectura y Roles de Agentes Especializados

Proyecto desarrollado bajo el **Sistema Orchestrator Multiagente Anti-Gravity 2.0**:

1. **[Architect-Agent]**: Diseñó la arquitectura de carpetas, esquemas SQL en SQLite y especificación del Contrato REST API.
2. **[Graphify-Agent]**: Mapeó las dependencias AST y generó la memoria persistente del mapa en [`graphify-out/GRAPH_REPORT.md`](file:///c:/Users/Usuario/Desktop/APP_CITAS/graphify-out/GRAPH_REPORT.md).
3. **[Backend-Agent]**: Construyó el servidor Node.js + Express en `/server` con SQLite, JWT auth y endpoints CRUD para `/api/users`, `/api/citas` y `/api/documentos`.
4. **[Frontend-Agent]**: Desarrolló la aplicación React Mobile-First en `/client` con Auth, Dashboard, Checklist interactivo y modal de creador.
5. **[QA-Security-Agent]**: Auditó la seguridad de endpoints, estandarización de respuestas de error, resiliencia ante errores de red y creó la suite de verificación automatizada (`server/test-api.js`).

---

## 📁 Estructura del Proyecto

```text
APP_CITAS/
├── graphify-out/              # Grafo de conocimiento y dependencias AST (Graphify)
│   ├── graph.json
│   └── GRAPH_REPORT.md
├── server/                    # Backend Node.js + Express + SQLite
│   ├── src/
│   │   ├── config/            # Base de datos SQLite y helpers asíncronos
│   │   ├── controllers/       # Auth, Citas, Documentos, Usuarios
│   │   ├── middlewares/       # JWT Auth & Error Handler
│   │   ├── routes/            # Definición de rutas Express
│   │   └── app.js             # Entrada del servidor (Puerto 5000)
│   ├── test-api.js            # Script de pruebas automatizadas QA
│   └── package.json
├── client/                    # Frontend React + Vite Mobile-First
│   ├── src/
│   │   ├── components/        # Navbar, AppointmentCard, DocumentChecklist, Modals
│   │   ├── context/           # AuthContext (Estado global de sesión)
│   │   ├── pages/             # AuthPage, DashboardPage
│   │   ├── services/          # Cliente API HTTP
│   │   ├── index.css          # Design System Glassmorphism Mobile-First
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Guía de Instalación y Ejecución Local

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

---

### Paso 1: Iniciar el Servidor Backend

En una terminal:
```bash
cd server
npm start
```
> El servidor iniciará en: `http://localhost:5000`  
> Health Check disponible en: `http://localhost:5000/api/health`

---

### Paso 2: Iniciar la Aplicación Frontend

En otra terminal:
```bash
cd client
npm run dev
```
> La aplicación web abrirá en: `http://localhost:3000` (Mobile-First Interface)

---

### Paso 3: Ejecutar Pruebas Automatizadas QA & Security

Con el servidor ejecutándose en la puerta 5000:
```bash
cd server
node test-api.js
```

---

## 🔒 Características de Seguridad & UX Destacadas
- **Token JWT en Headers**: Protege los endpoints del servidor contra acceso no autorizado.
- **SQL Inyection Prevention**: Consultas preparadas y parametrizadas mediante SQLite helper.
- **Checklist Dinámico**: Permite alternar la lista de chequeo de exámenes y documentos en tiempo real (`PATCH /api/documentos/:id/toggle`).
- **Resiliencia Frontend**: Estados de carga con skeletons animadas, manejo centralizado de errores y respuesta táctil Mobile-First.

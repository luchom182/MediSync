# ☁️ Guía de Despliegue Gratuito y Gestión de Archivos (Fotos & PDFs) - MediSync

Documentación de arquitectura recomendada para el alojamiento 100% gratuito en producción y la carga de archivos adjuntos (imágenes y PDFs) para cualquier usuario en internet.

---

## 🏛️ Arquitectura de Producción Recomendada (Tier Gratuito)

```mermaid
graph TD
    User([👤 Usuarios en Internet / Móvil]) -->|HTTPS| Vercel[⚡ Vercel / Netlify<br/>Frontend React App]
    Vercel -->|API REST Calls| Render[🚀 Render.com<br/>Backend Node.js Express API]
    Render -->|Guarda Datos y URLs| Turso[(🗄️ Turso Cloud<br/>SQLite en la Nube)]
    Render -->|Upload Fotos / PDFs| Cloudinary[☁️ Cloudinary Storage<br/>Almacenamiento de Archivos (25GB)]
    Cloudinary -->|URL pública HTTPS| Render
```

---

## 📊 Matriz de Servicios Gratuitos

| Componente | Servicio | Plan Gratuito | Rol en MediSync |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** / Netlify | Ilimitado (100GB ancho de banda) | Alojamiento del cliente React, SSL gratis y despliegue automático desde GitHub. |
| **Backend** | **Render.com** | 750 horas/mes (Servidor 24/7) | Alojamiento del servidor Node.js + Express en `/server`. |
| **Archivos** | **Cloudinary** | 25 GB almacenamiento | Almacenamiento e inserción de enlaces HTTPS para visualización de Fotos y PDFs. |
| **Base de Datos** | **Turso** | 9 GB almacenamiento | SQLite hospedado en la nube. Compatible 100% con las sentencias SQL actuales. |

---

## 📸 Flujo Futuro de Carga de Archivos (Fotos & PDFs)

1. **Selección**: El usuario selecciona un archivo (JPEG, PNG, PDF) desde el cliente React o móvil.
2. **Transferencia**: El backend procesa la carga mediante `multer` y envía el archivo al SDK de **Cloudinary**.
3. **Persistencia**: Cloudinary retorna una URL segura (ej: `https://res.cloudinary.com/.../orden_medica.pdf`).
4. **Registro DB**: Se almacena la URL devuelta en la columna `url_archivo` de la tabla `documentos`.
5. **Visualización**: El usuario puede abrir la foto o descargar el PDF desde la vista de detalle de la cita.

---

## 📋 Decisiones Arquitectónicas Registradas
- **ID**: `DEC-001`
- **Título**: Selección de Stack Gratuito de Producción y Servicio de Archivos en la Nube
- **Módulos Afectados**: `/server`, `/client`, `documentosController.js`, `DocumentChecklist.jsx`.

# CampusTasks
Descripcion: lista de tareas.

## Requisitos

- Node.js 24.x

## Ejecución

Usa dos terminales.

### Terminal A (backend)

```bash
cd backend
npm ci
npm run start:dev
```

Configura `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` en `backend/.env` para conectar con una base de datos PostgreSQL existente. Al iniciar, el backend crea la tabla `tareas` si todavía no existe. Una base vacía comienza sin tareas.

### Terminal B (frontend)

```bash
cd frontend
npm ci
npm start
```




## Resultado esperado

- http://localhost:3000/tareas devuelve las tareas guardadas en PostgreSQL.
- http://localhost:4200 las muestra.


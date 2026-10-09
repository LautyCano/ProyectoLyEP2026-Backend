# Panel de Control de Clientes

Frontend desarrollado con React y Vite. Para mostrar y administrar clientes se conecta a la API del proyecto ubicada en `../server`.

## Requisitos

- Node.js y npm.
- Backend en ejecución y MongoDB configurado según las instrucciones de `../README.md`.

## Configuración y ejecución

1. Instala las dependencias desde esta carpeta:

   ```bash
   npm install
   ```

2. Copia `.env.example` como `.env` y configura la URL base de la API:

   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

   La variable debe terminar en `/api`; el frontend agrega `/clientes` a esa base. Vite carga las variables al iniciar, por lo que debes reiniciarlo después de cambiar `.env`.

3. Configura MongoDB y `server/.env` siguiendo `../README.md`. En otra terminal, desde la raíz del repositorio, instala las dependencias y arranca el backend:

   ```bash
   cd server
   npm install
   npm run dev
   ```

4. Desde `client/`, inicia el frontend:

   ```bash
   npm run dev
   ```

   Abre la URL local que informa Vite (por defecto, `http://localhost:5173`).

## Validaciones

```bash
npm run lint
npm run build
```

# Documentos y Datos de Semilla (Seed Data)

Este directorio contiene los datos simulados iniciales de clientes (`clients.json`) tomados de la API de prueba (FakeStoreAPI) para su migración y persistencia en la base de datos real en la nube (MongoDB Atlas).

## Estructura del Archivo `clients.json`
Cada objeto de cliente cumple con la estructura esperada por el modelo de Mongoose (`clientModel.js`) y las vistas del frontend (`client/`):

- `name`: Subdocumento con `firstname` y `lastname`.
- `email`: Correo electrónico del cliente.
- `username`: Nombre de usuario.
- `password`: Contraseña.
- `phone`: Teléfono de contacto.
- `address`: Subdocumento con `city`, `street`, `number`, `zipcode` y `geolocation`.

## Ejecución del Script de Migración
Para popular o restablecer la base de datos de MongoDB Atlas con estos datos:

```bash
cd server
npm run seed
```

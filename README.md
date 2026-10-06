# Guía de Configuración y Ejecución del Backend (`server/`)

Sigue estos pasos para configurar la base de datos MongoDB Atlas y levantar el servidor backend localmente.

---

## Requisitos Previos

* Tener instalado **Node.js** (versión 18 o superior).
* Contar con una cuenta en **MongoDB Atlas**.

---

## Paso 1: Configurar la Base de Datos en MongoDB Atlas

1. Inicia sesión en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crea un Cluster gratuito (**M0 Free Sandbox**) si no tienes uno.
3. apenas creas el cluster se te despliega una ventana para descargar el .env, el cual tiene que descargalo
---

## Paso 2: Configurar las Variables de Entorno

1. Ubícate dentro de la carpeta `server/`.
2. Duplica o renombra el archivo `.env.example` para crear el archivo `.env`:
   ```bash
   cp .env.example .env
3. Reemplaza las credenciales del .env.mongo con el del .env

## Paso 3: Instalacion de librerias
* Ubicarte dentro de la carpeta server y hacer
  ```bash
   npm install

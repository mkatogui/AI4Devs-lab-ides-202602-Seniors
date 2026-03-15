# LTI - Talent Tracking System  | EN

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is initiated with Create React App, and the backend is written in TypeScript.

## Directory and File Explanation

- `backend/`: Contains the server-side code written in Node.js.
  - `src/`: Contains the source code for the backend.
    - `index.ts`:  The entry point for the backend server.
  - `prisma/`: Contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
  - `.env`: Contains the environment variables.
- `frontend/`: Contains the client-side code written in React.
  - `public/index.html`: **Single HTML entry point** — app shell, meta tags, and UDS theme (`data-theme="corporate"`). Edit this to change title, description, or palette.
  - `src/`: Contains the source code for the frontend.
  - `public/`: Contains static files (favicon, manifest, images).
  - `build/`: Contains the production-ready build of the frontend.
- `docker-compose.yml`: Contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: `frontend` and `backend`.

### Frontend

The frontend is a React (Create React App) app. The single HTML entry is `frontend/public/index.html`; app code lives in `frontend/src/` (components, pages, context, services). The build output goes to `frontend/build/`.

The UI is built with **[Universal Design System (UDS)](https://mkatogui.github.io/universal-design-system/)** via:
- `@mkatogui/uds-react` — 43 accessible components (Button, Card, Input, Modal, etc.) and styles
- `@mkatogui/uds-tokens` — design tokens (CSS custom properties)

The active palette is set with `data-theme` on `<html>` (this project uses `data-theme="corporate"`). You can switch palettes in `frontend/public/index.html`. Available palettes: `minimal-saas`, `corporate`, `dashboard`, `ai-futuristic`, `gradient-startup`, and others (see [UDS docs](https://mkatogui.github.io/universal-design-system/)).

### Backend

El backend es una aplicación Express escrita en TypeScript.
- The `src` directory contains the source code
- The `prisma` directory contains the Prisma schema.

## First steps

To get started with this project, follow these steps:

1. Clone the repo
2. install the dependencias for frontend and backend
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Build the backend server
```
cd backend
npm run build
````
4. Run the backend server
```
cd backend
npm run dev 
```

5. In a new terminal window, build the frontend server:
```
cd frontend
npm run build
```
6. Start the frontend server
```
cd frontend
npm start
```

The backend server will be running at http://localhost:3010, and the frontend will be available at http://localhost:3000.

## Test users (created/updated)

You can log in at http://localhost:3000/login with either:

| Email | Password |
|-------|----------|
| recruiter@lti.demo | demo123 |
| test@lti.demo | test123 |

(Run `npm run prisma:seed` in the `backend` folder to create or reset these users.)

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here's how to get it up and running:

Install Docker on your machine if you haven't done so already. You can download it here.
Navigate to the root directory of the project in your terminal.
Run the following command to start the Docker container:
```
docker-compose up -d
```
This will start a PostgreSQL database in a Docker container. The -d flag runs the container in detached mode, meaning it runs in the background.

To access the PostgreSQL database, use the same credentials as in `docker-compose.yml` and `backend/.env`:
 - Host: localhost
 - Port: 5432
 - User: LTIdbUser
 - Password: D1ymf8wyQEGthFR1E9xhCq
 - Database: LTIdb

To stop the Docker container, run the following command:
```
docker-compose down
```

# LTI - Sistema de Seguimiento de Talento  | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
  - `.env`: Contiene las variables de entorno.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `public/index.html`: Punto de entrada HTML único (shell, tema UDS).
  - `src/`: Código fuente (components, pages, context, services).
  - `public/`: Archivos estáticos. `build/`: Build de producción.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React (Create React App). Entrada: `frontend/public/index.html`; código en `frontend/src/`. La UI usa **Universal Design System (UDS)** con `@mkatogui/uds-react` y `@mkatogui/uds-tokens`; paleta en `data-theme="corporate"` en `frontend/public/index.html`.

### Backend

El backend es una aplicación Express escrita en TypeScript.
- El directorio `src` contiene el código fuente
- El directorio `prisma` contiene el esquema de Prisma.

## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias para el frontend y el backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Construye el servidor backend:
```
cd backend
npm run build
````
4. Inicia el servidor backend:
```
cd backend
npm run dev 
```

5. En una nueva ventana de terminal, construye el servidor frontend:
```
cd frontend
npm run build
```
6. Inicia el servidor frontend:
```
cd frontend
npm start
```

El servidor backend estará corriendo en http://localhost:3010 y el frontend estará disponible en http://localhost:3000.

## Usuarios de prueba (creados/actualizados)

Puedes iniciar sesión en http://localhost:3000/login con cualquiera de estos:

| Email | Contraseña |
|-------|------------|
| recruiter@lti.demo | demo123 |
| test@lti.demo | test123 |

(Ejecuta `npm run prisma:seed` en la carpeta `backend` para crear o restablecer estos usuarios.)

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, usa las mismas credenciales que en `docker-compose.yml` y `backend/.env`:
 - Host: localhost
 - Port: 5432
 - User: LTIdbUser
 - Password: D1ymf8wyQEGthFR1E9xhCq
 - Database: LTIdb

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

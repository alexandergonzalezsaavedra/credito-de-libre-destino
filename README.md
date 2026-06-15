# Solicitud Digital de Crédito de Libre Destino — Banco Caja Social

Prueba técnica desarrollada con **Next.js 15**, **Redux Toolkit**, **HeroUI** y **Tailwind CSS v4**.
Permite a los usuarios solicitar un crédito de libre destino de forma 100% digital, con simulación de oferta, registro automático y trazabilidad de eventos.

**Demo en producción:** [https://credito-de-libre-destino.netlify.app](https://credito-de-libre-destino.netlify.app)

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación y ejecución

### 1. Instalar dependencias

```bash
npm i
```

### 2. Vista en desarrollo

```bash
npm run dev
```

### 3. Compilar para producción

```bash
npm run build
```

### 4. Vista en producción

```bash
npm run start
```

> La aplicación siempre se visualiza en **[http://localhost:3000](http://localhost:3000)**

---

## Rutas principales

| Ruta                 | Descripción                               |
| -------------------- | ----------------------------------------- |
| `/`                  | Landing page — presentación del producto  |
| `/solicitar-credito` | Formulario wizard de solicitud (6 pasos)  |
| `/perfil`            | Registro y gestión del perfil del usuario |
| `/historial`         | Historial de solicitudes del usuario      |
| `/admin`             | Panel de administración                   |

---

## Panel de administración

Accede en **[http://localhost:3000/admin](http://localhost:3000/admin)**

| Campo      | Valor       |
| ---------- | ----------- |
| Usuario    | `admin`     |
| Contraseña | `admin2026` |

El panel permite visualizar todas las solicitudes realizadas, filtrar por número de cédula y paginar los resultados (10 registros por página).

---

## API REST

Los endpoints están disponibles bajo `/api/applications`:

| Método  | Ruta                                    | Descripción                       |
| ------- | --------------------------------------- | --------------------------------- |
| `POST`  | `/api/applications`                     | Crear solicitud                   |
| `GET`   | `/api/applications`                     | Listar solicitudes con filtros    |
| `GET`   | `/api/applications/{id}`                | Consultar detalle                 |
| `PATCH` | `/api/applications/{id}`                | Actualizar datos                  |
| `POST`  | `/api/applications/{id}/simulate-offer` | Obtener simulación preliminar     |
| `POST`  | `/api/applications/{id}/finalize`       | Finalizar solicitud               |
| `POST`  | `/api/applications/{id}/abandon`        | Abandonar solicitud               |
| `GET`   | `/api/applications/{id}/events`         | Consultar trazabilidad de eventos |

---

## Stack tecnológico

- **Next.js 15** — App Router, Server Components, API Routes
- **Redux Toolkit v2** — gestión de estado global con persistencia en `localStorage`
- **HeroUI v2** — componentes de interfaz
- **Tailwind CSS v4** — estilos utilitarios
- **TypeScript** — tipado estático
- **React Google reCAPTCHA v3** — validación de identidad

---

## Autor

**Alexander González**  
[linkedin.com/in/alexander-gonzalez-saavedra](https://www.linkedin.com/in/alexander-gonzalez-saavedra)  
[github.com/alexandergonzalezsaavedra/credito-de-libre-destino](https://github.com/alexandergonzalezsaavedra/credito-de-libre-destino)

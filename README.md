# Gestión de Tareas (Frontend Angular)

Frontend para el proyecto **Sistema de Gestión de Tareas y Proyectos**.

## Requisitos
- Node.js LTS
- Angular CLI (compatible con Angular 20.x)
- Backend Spring Boot corriendo en `http://localhost:8080`

## Instalación
```bash
npm install
```

## Ejecutar (dev)
```bash
ng serve -o
```
Frontend: `http://localhost:4200`

## Swagger (backend)
`http://localhost:8080/swagger-ui/index.html`

## Build (producción)
```bash
ng build --configuration production
```
Salida en `dist/`.

## Arquitectura (PT)
- `src/app/core`: interceptors, config, servicios base
- `src/app/shared`: material, componentes compartidos, modelos
- `src/app/features`: módulos por feature (usuarios/proyectos/tareas/dashboard)

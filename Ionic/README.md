# Proyecto Ionic - Guía de Configuración y Ejecución

## Requisitos Previos

Antes de empezar, debes tener instalado en tu computadora:

### 1. **Node.js y npm**
- Descarga desde: https://nodejs.org/
- Elige la versión **LTS (Long Term Support)**
- La instalación incluye **npm** automáticamente
- Para verificar que están instalados, ejecuta en terminal:
  ```bash
  node --version
  npm --version
  ```

### 2. **Ionic CLI (interfaz de línea de comandos)**
- Es el programa que permite ejecutar el proyecto Ionic
- Instálalo globalmente con:
  ```bash
  npm install -g @ionic/cli
  ```

---

## Cómo Ejecutar el Proyecto

### Paso 1: Entra a la carpeta Ionic

Abre una terminal y navega a la carpeta Ionic. 

```bash
cd Ionic
```
Por ejemplo:

```bash
cd c:\Users\inahe\Downloads\AppWeb\Ionic
```
*(Reemplaza la ruta con la ubicación donde tengas el proyecto AppWeb en tu computadora)*

### Paso 2: Instala las dependencias del proyecto (solo la primera vez)

```bash
npm install
```

*Esto descargará todas las librerías que el proyecto necesita. Puede tomar unos minutos.*

### Paso 3: Inicia el servidor de desarrollo

```bash
ionic serve
```

**¡Listo!** El navegador se abrirá automáticamente en `http://localhost:8100` y podrás ver el proyecto funcionando.

---

## Notas Importantes

- Usa siempre `ionic serve` para ejecutar el proyecto (no `npm start`)
- Si necesitas actualizar dependencias en el futuro, ejecuta `npm install` nuevamente
- Para detener el servidor, presiona **Ctrl+C** en la terminal
- Los cambios en el código se recargan automáticamente en el navegador

---

## Solución de Problemas

**Si `ionic serve` no funciona:**

1. Verifica que Node.js esté instalado correctamente: `node --version`
2. Verifica que Ionic CLI esté instalado: `ionic --version`
3. Si aún no funciona, intenta: `npx ionic serve`

---

## Comandos Útiles

| Comando | Descripción |
|---------|-------------|
| `ionic serve` | Ejecuta el proyecto en desarrollo |
| `npm install` | Instala las dependencias |
| `ionic --version` | Muestra la versión de Ionic instalada |

---

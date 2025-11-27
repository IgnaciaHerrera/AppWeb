# Flutter — Cómo ejecutar el proyecto

Este pequeño README explica cómo ejecutar el proyecto Flutter dentro de la carpeta `flutter_application_1` usando Android Studio. También incluyo atajos por línea de comandos y una nota rápida sobre VS Code (sé que usas la extensión de debug en VS Code).

Requisitos previos
- Instalar Flutter (https://flutter.dev) y añadir `flutter` al `PATH`.
- Tener instalado Android Studio con el SDK de Android y un AVD (emulador) o un dispositivo físico conectado.
- Instalar los plugins **Flutter** y **Dart** en Android Studio.
- Java/JDK compatible (normalmente instalado por Android Studio).

Comprobar el entorno
Abre una terminal y ejecuta:

```bash
flutter doctor -v
```

Corrige cualquier advertencia (por ejemplo aceptar licencias con `flutter doctor --android-licenses`, configurar `ANDROID_HOME`/`ANDROID_SDK_ROOT`, etc.).

Abrir en Android Studio
1. Abre Android Studio.
2. Selecciona **Open** (o **Open an existing project**) y navega a la carpeta:

```
.../AppWeb/Flutter/flutter_application_1
```

3. Android Studio detectará el proyecto Flutter. Si te pide instalar plugins (Flutter/Dart), instálalos.
4. Espera a que termine `flutter pub get` (Android Studio lo ejecuta automáticamente al abrir el proyecto). Si no lo hace, abre la terminal integrada y ejecuta:

```bash
flutter pub get
```

Configurar dispositivo
- Selecciona un dispositivo desde la barra superior (emulador AVD o dispositivo físico). Si no tienes un emulador, abre **AVD Manager** → crea uno y arráncalo.

Ejecutar la app (Android Studio)
1. Asegúrate de que el dispositivo/emulador está seleccionado.
2. Pulsa el botón verde **Run** (o **Debug** para iniciar en modo depuración).
3. Observa la consola de Run/Debug para logs. Usa **Hot Reload** (r) o el botón de Hot Reload en la barra de herramientas para aplicar cambios rápidamente.

Depuración y utilidades útiles
- Para ver logs en tiempo real usa **Logcat** en Android Studio.
- Si necesitas ejecutar una única vez desde la línea de comandos dentro de la carpeta del proyecto:

```powershell
# desde la carpeta flutter_application_1
flutter run           # ejecuta en el dispositivo conectado o primer emulador
flutter run -d all    # intenta en todos los dispositivos
flutter build apk     # para generar APK
```

Nota sobre VS Code
- Tú ejecutas usando la extensión de Debug en VS Code. Eso está bien — pasos rápidos:
  - Abre la carpeta `flutter_application_1` en VS Code.
  - Asegúrate de tener las extensiones **Dart** y **Flutter**.
  - Usa la paleta de comandos o el panel Run para iniciar `Run` o `Debug`.

Problemas comunes
- `No devices found`: inicia un AVD o conecta un dispositivo con depuración USB.
- `Android license status unknown`: ejecuta `flutter doctor --android-licenses`.
- `manifest & assets`: si cambias código nativo o assets, ejecuta `flutter clean` y luego `flutter pub get`.

Si quieres, puedo generar también un pequeño script `run-android.ps1` dentro de la carpeta para ejecutar `flutter pub get` y `flutter run` con un solo comando. ¿Lo añado?

---
Archivo del proyecto: `flutter_application_1` (abrir esa carpeta en Android Studio o VS Code).

Seleccionar dispositivo (emulador / dispositivo físico)
-----------------------------------------------
Si tienes varios dispositivos/emuladores conectados (por ejemplo, tú mencionaste que tienes 3), hay varias formas de escoger cuál usar:

- Usando `flutter` en la terminal (recomendado para scripts):
  - Listar dispositivos:

```bash
flutter devices
```

  - El comando anterior muestra una lista con `name` y `id` (p. ej. `emulator-5554` o `device1234`). Para ejecutar en un dispositivo concreto usa `-d <id>`:

```bash
flutter run -d emulator-5554
# o con el script PowerShell
.\run-android.ps1 -DeviceId "emulator-5554"
```

  - También puedes obtener salida en formato JSON (útil para scripts) con:

```bash
flutter devices --machine
```

- Desde Android Studio:
  - En la barra superior (o al lado del botón Run/Debug) hay un desplegable con los dispositivos disponibles. Simplemente selecciona el que quieras y pulsa **Run**.

- Desde VS Code (extensión Flutter):
  - En la esquina inferior derecha aparece el selector de dispositivos. Haz clic y elige el emulador o dispositivo que quieras usar antes de iniciar Debug/Run.

Consejo rápido
- Si sueles usar siempre el mismo emulador, puedes pasar su id a `run-android.ps1` para que no haga detección automática:

```powershell
.\run-android.ps1 -DeviceId "emulator-5554"
```

Esto garantiza que la app se lance en el dispositivo que prefieras cuando trabajas con varios targets.

Ejemplo de salida y cómo copiar el id
-----------------------------------
Aquí tienes un ejemplo de la salida que devuelve `flutter devices` y cómo extraer el `id` que necesitas para seleccionar un dispositivo:

Salida ejemplo (texto):

```
2 connected devices:
Android SDK built for x86 (mobile) • emulator-5554 • android-x86 • Android 12 (API 31) (emulator)
Pixel 4a (mobile)                   • 1234567890ABCDEF • android-arm64 • Android 13 (API 33)
```

- En este ejemplo hay 2 dispositivos:
  - Emulador con id `emulator-5554`
  - Dispositivo físico con id `1234567890ABCDEF`

- Para elegir uno en la terminal usa su `id`:

```powershell
flutter run -d emulator-5554
# o
.\run-android.ps1 -DeviceId "1234567890ABCDEF"
```

Si prefieres usar la salida en JSON, ejecuta:

```bash
flutter devices --machine
```

Esa salida contiene un campo `id` por cada objeto del array JSON.

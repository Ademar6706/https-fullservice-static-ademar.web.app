# Recepción de Vehículos · Full Service · Liqui Moly México

Esta es una aplicación web para la recepción de vehículos y control de servicios para talleres Full Service · Liqui Moly México.

## Requisitos Previos

Antes de empezar, necesitas tener instalado lo siguiente en tu computadora:

1.  **Node.js**: Es el entorno que ejecuta el código de la aplicación. [Descárgalo aquí](https://nodejs.org/en/download/). Se recomienda la versión LTS.
2.  **Cuenta de Google y Proyecto de Firebase**:
    *   Crea una cuenta de Google si no tienes una.
    *   Ve a la [Consola de Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto.
3.  **Google AI Studio API Key**:
    *   Ve a [Google AI Studio](https://aistudio.google.com/app/apikey) y crea una API key.

## Pasos para Configurar y Desplegar la Aplicación

Sigue estos pasos cuidadosamente. Solo necesitas copiar y pegar los comandos en tu terminal.

### 1. Clona el repositorio y entra en el directorio

Si has descargado el código como un archivo ZIP, descomprímelo. Luego, abre una terminal y navega hasta la carpeta del proyecto.

### 2. Configura las variables de entorno

Este paso es crucial para conectar la app con tu proyecto de Firebase y con la IA de Google.

1.  Busca el archivo llamado `.env` en la carpeta del proyecto.
2.  Ábrelo con un editor de texto.
3.  Rellena los valores con tus credenciales.

**Para Firebase:**

*   En la [Consola de Firebase](https://console.firebase.google.com/), ve a la configuración de tu proyecto (el ícono de engranaje).
*   En la pestaña "General", baja hasta "Tus apps".
*   Si no hay ninguna app web, crea una.
*   Copia las credenciales (`apiKey`, `authDomain`, etc.) en el archivo `.env`.

**Para Google AI:**

*   Copia la API key que creaste en Google AI Studio.

Tu archivo `.env` debería verse así, pero con tus datos:

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy...your-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:..."

GOOGLE_API_KEY="AIzaSy...your-google-ai-key"
```

### 3. Instala las dependencias

En tu terminal, dentro de la carpeta del proyecto, ejecuta este comando. Descargará todo el software necesario para que la app funcione.

```bash
npm install
```

### 4. Prueba la aplicación en tu computadora

Para ver la aplicación funcionando localmente antes de subirla a internet, ejecuta:

```bash
npm run dev
```

Abre tu navegador web y ve a `http://localhost:9002`. Deberías ver la aplicación.

### 5. Despliega la aplicación a Firebase

Este es el último paso para que tu aplicación esté en línea.

1.  **Instala las herramientas de Firebase:**
    ```bash
    npm install -g firebase-tools
    ```

2.  **Inicia sesión en Firebase:**
    ```bash
    firebase login
    ```
    Esto abrirá una ventana en tu navegador para que inicies sesión con tu cuenta de Google.

3.  **Compila la aplicación:**
    Este comando prepara tu app para producción.
    ```bash
    npm run build
    ```

4.  **Despliega en Firebase Hosting:**
    Este comando sube tu aplicación a internet.
    ```bash
    firebase deploy
    ```

Cuando el comando termine, te dará una URL. ¡Esa es la dirección de tu aplicación en línea!
# https-fullservice-static-ademar.web.app

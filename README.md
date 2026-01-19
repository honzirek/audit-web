# Audit Web

## Android Integration (Capacitor)

This project has been integrated with Capacitor to support Android.

### Prerequisites
- Android Studio
- Android SDK (API 24+)

### Dependencies
- `@capacitor/core`
- `@capacitor/cli`
- `@capacitor/android`

### Configuration
The Capacitor configuration is located in `capacitor.config.ts`.
- **App ID**: `com.deskbird.auditweb`
- **App Name**: AuditWeb
- **Web Dir**: `dist`

### Scripts

The following scripts have been added to `package.json` for Android development:

| Script | Description |
| :--- | :--- |
| `npm run cap:init` | Initialize Capacitor (if needed manually) |
| `npm run cap:add:android` | Add Android platform |
| `npm run cap:sync` | Sync web assets to native platforms |
| `npm run cap:open:android` | Open the project in Android Studio |
| `npm run android:build` | Build the web app and sync to Android |

### How to Run on Android

1.  **Build and Sync**:
    Run the following command to build the web application and sync the changes to the Android native project:
    ```bash
    npm run android:build
    ```

2.  **Open in Android Studio**:
    Open the native Android project in Android Studio:
    ```bash
    npm run cap:open:android
    ```

3.  **Run on Device/Emulator**:
    Once Android Studio opens, wait for Gradle sync to complete, then click the **Run** button (green play icon) to launch the app on your connected device or emulator.

## Desktop Integration (Electron)

This project also supports running as a desktop application using Electron.

### Scripts

The following scripts are available for Electron development:

| Script | Description |
| :--- | :--- |
| `npm run electron:dev` | Run the app in development mode with Electron (hot-reload) |
| `npm run electron:build` | Build the application for production (Windows NSIS) |
| `npm run compile:electron` | Compile the Electron main process TypeScript files |

### How to Run locally

To start the application in development mode:
```bash
npm run electron:dev
```

### How to Build

To build the application installer for Windows:
```bash
npm run electron:build
```
The output installer will be located in the `dist-electron_build` directory.

# IONIC Framework Tutorial

## 1. Lernziele

- Installation IONIC Framework
- Vorbereitungsarbeiten
- Bestandteile des Frameworks

---

## 2. Module und Bestandteile des IONIC Frameworks

### 2.1 AngularJS / Angular

**Was ist Angular?**

Angular ist ein TypeScript-basiertes Web-Anwendungs-Framework, entwickelt von Google. IONIC nutzt Angular als primäres Framework für die Anwendungslogik und UI-Komponenten.

**Hauptmerkmale:**
- **Component-basierte Architektur**: Die Anwendung wird in wiederverwendbare Komponenten aufgeteilt
- **Two-Way Data Binding**: Automatische Synchronisation zwischen Model und View
- **Dependency Injection**: Effizientes Management von Abhängigkeiten
- **TypeScript**: Typsichere Programmierung mit modernen JavaScript-Features
- **Direktiven**: Erweiterte HTML-Syntax für dynamische Inhalte

**Rolle in IONIC:**
- Bereitstellung der App-Struktur und -Logik
- State Management und Navigation
- Datenverarbeitung und Business-Logik
- Integration mit IONIC UI-Komponenten

---

### 2.2 Node.js

**Was ist Node.js?**

Node.js ist eine JavaScript-Runtime-Umgebung, die auf der V8 JavaScript-Engine von Chrome basiert. Sie ermöglicht die Ausführung von JavaScript außerhalb des Browsers.

**Hauptmerkmale:**
- **Event-driven und Asynchron**: Nicht-blockierende I/O-Operationen
- **NPM (Node Package Manager)**: Zugriff auf über 1 Million Pakete
- **Single-threaded mit Event Loop**: Effiziente Ressourcennutzung
- **Cross-Platform**: Läuft auf Windows, macOS, Linux

**Rolle in IONIC:**
- **Entwicklungsumgebung**: Bereitstellung der Tools für die Entwicklung
- **NPM**: Installation und Verwaltung von IONIC und Abhängigkeiten
- **Build-Prozess**: Kompilierung und Optimierung der Anwendung
- **Development Server**: Lokaler Server für Tests und Entwicklung
- **CLI-Tools**: Ionic CLI basiert auf Node.js

---

### 2.3 Apache Cordova

**Was ist Cordova?**

Apache Cordova (früher PhoneGap) ist ein Open-Source-Framework zur Entwicklung mobiler Anwendungen mit HTML, CSS und JavaScript. Es fungiert als Brücke zwischen Web-Technologien und nativen Gerätefunktionen.

**Hauptmerkmale:**
- **Cross-Platform**: Eine Codebasis für iOS, Android, Windows, etc.
- **Native APIs**: Zugriff auf Kamera, GPS, Dateisystem, etc.
- **WebView**: Führt die Web-App in einem nativen Container aus
- **Plugin-System**: Erweiterbare Architektur für zusätzliche Funktionen

**Rolle in IONIC:**
- **Native Compilation**: Verpackt die IONIC-App als native App
- **Hardware-Zugriff**: Ermöglicht Zugriff auf Gerätesensoren und -funktionen
- **Platform-spezifische Builds**: Erstellt .apk (Android) oder .ipa (iOS) Dateien
- **Native Shell**: Bereitstellung des nativen Containers für die Web-App

**Cordova Plugins (Beispiele):**
- `cordova-plugin-camera`: Kamerazugriff
- `cordova-plugin-geolocation`: GPS/Standort
- `cordova-plugin-contacts`: Kontakte
- `cordova-plugin-file`: Dateisystem

---

## 3. Installation

### 3.1 Node.js Installation (macOS)

**Methode 1: Direkt von nodejs.org**

1. Besuchen Sie [https://nodejs.org](https://nodejs.org)
2. Laden Sie die LTS-Version (Long Term Support) herunter
3. Öffnen Sie die heruntergeladene `.pkg`-Datei
4. Folgen Sie dem Installationsassistenten
5. Überprüfen Sie die Installation:

```bash
node --version
npm --version
```

**Methode 2: Homebrew (empfohlen für Entwickler)**

```bash
# Homebrew installieren (falls noch nicht installiert)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js installieren
brew install node

# Installation überprüfen
node --version
npm --version
```

**Methode 3: NVM (Node Version Manager) - für mehrere Node-Versionen**

```bash
# NVM installieren
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Terminal neu starten oder source durchführen
source ~/.zshrc

# Node.js installieren
nvm install --lts
nvm use --lts

# Installation überprüfen
node --version
npm --version
```

**Erwartete Ausgabe:**
```
node --version
v18.x.x (oder höher)

npm --version
9.x.x (oder höher)
```

---

### 3.2 Cordova und Ionic Installation

Nach erfolgreicher Node.js-Installation können Cordova und Ionic global installiert werden:

**Installation:**

```bash
# Cordova global installieren
npm install -g cordova

# Ionic CLI global installieren
npm install -g @ionic/cli

# Installation überprüfen
cordova --version
ionic --version
```

**Erwartete Ausgabe:**
```
cordova --version
12.x.x (oder höher)

ionic --version
7.x.x (oder höher)
```

**Hinweise:**
- Die `-g` Flag installiert die Pakete global
- Auf manchen Systemen kann `sudo` erforderlich sein: `sudo npm install -g cordova`
- Bei Verwendung von NVM ist `sudo` normalerweise nicht nötig

**Optionale zusätzliche Tools:**

```bash
# Native Build-Tools für iOS (nur macOS)
xcode-select --install

# Für Android-Entwicklung
brew install --cask android-studio
```

---

## 4. Demo App starten

### 4.1 Neue App erstellen

**IONIC App mit Tabs-Template erstellen:**

```bash
# Neue App erstellen
ionic start myApp tabs --type=angular

# In das Projektverzeichnis wechseln
cd myApp
```

**IONIC App mit Sidemenu-Template erstellen:**

```bash
# Neue App erstellen
ionic start myApp sidemenu --type=angular

# In das Projektverzeichnis wechseln
cd myApp
```

**Weitere verfügbare Templates:**
- `blank`: Leere Starter-App
- `tabs`: App mit Tab-Navigation
- `sidemenu`: App mit Seitenmenü
- `conference`: Konferenz-Demo-App
- `super`: Umfangreiche Starter-App mit vielen Beispielen

---

### 4.2 App im Browser testen

```bash
# Development Server starten
ionic serve
```

**Was passiert:**
- Die App wird kompiliert
- Ein lokaler Entwicklungsserver startet (normalerweise auf `http://localhost:8100`)
- Der Standard-Browser öffnet sich automatisch
- Live-Reload: Änderungen werden automatisch aktualisiert

**Nützliche Befehle:**

```bash
# Mit spezifischem Port
ionic serve --port=8200

# Mit Lab-Modus (iOS und Android Vorschau gleichzeitig)
ionic serve --lab

# Ohne automatisches Browser-Öffnen
ionic serve --no-open
```

---

### 4.3 App auf nativem Gerät testen

**Android:**

```bash
# Android-Platform hinzufügen
ionic cordova platform add android

# App bauen und auf Gerät installieren
ionic cordova run android

# Oder nur bauen
ionic cordova build android
```

**iOS (nur auf macOS):**

```bash
# iOS-Platform hinzufügen
ionic cordova platform add ios

# App bauen
ionic cordova build ios

# Das Projekt in Xcode öffnen
open platforms/ios/*.xcworkspace
```

---

### 4.4 Projektstruktur verstehen

Nach dem Erstellen einer IONIC-App sieht die Struktur so aus:

```
myApp/
├── src/
│   ├── app/
│   │   ├── app.component.ts      # Haupt-App-Komponente
│   │   ├── app.module.ts         # App-Modul-Definition
│   │   └── app-routing.module.ts # Routing-Konfiguration
│   ├── assets/                   # Bilder, Fonts, etc.
│   ├── environments/             # Umgebungsvariablen
│   ├── theme/                    # Globale Styles
│   └── index.html                # Haupt-HTML-Datei
├── www/                          # Kompilierte App (generiert)
├── platforms/                    # Native Platform-Code (generiert)
├── plugins/                      # Cordova-Plugins (generiert)
├── package.json                  # NPM-Abhängigkeiten
├── ionic.config.json             # IONIC-Konfiguration
├── angular.json                  # Angular-Konfiguration
└── tsconfig.json                 # TypeScript-Konfiguration
```

---

## 5. iOS App-Entwicklung mit IONIC

### 5.1 Systemvoraussetzungen

**Hardware:**
- **Mac mit macOS**: iOS-Apps können NUR auf einem Mac entwickelt und kompiliert werden
- **Mindestens 8 GB RAM**: Empfohlen sind 16 GB
- **50+ GB freier Speicherplatz**: Für Xcode und Simulatoren

**Betriebssystem:**
- **macOS Monterey oder neuer**: Aktuelle Version empfohlen

---

### 5.2 Benötigte Software

#### 5.2.1 Xcode

**Installation:**

1. **App Store Methode (empfohlen):**
   - Öffnen Sie den Mac App Store
   - Suchen Sie nach "Xcode"
   - Klicken Sie auf "Installieren" (ca. 12+ GB Download)

2. **Command Line Tools:**
   ```bash
   xcode-select --install
   ```

3. **Xcode akzeptieren:**
   ```bash
   sudo xcodebuild -license accept
   ```

**Was bietet Xcode:**
- iOS Simulatoren (verschiedene iPhone/iPad Modelle)
- Interface Builder
- Debugging-Tools
- Performance-Analyse
- Signing & Capabilities Management

---

#### 5.2.2 CocoaPods

CocoaPods ist ein Dependency Manager für iOS-Projekte:

```bash
# CocoaPods installieren
sudo gem install cocoapods

# Repository Setup
pod setup
```

---

#### 5.2.3 iOS Deploy

Für das Deployment auf echten Geräten:

```bash
npm install -g ios-deploy
```

---

### 5.3 Apple Developer Account

**Für Entwicklung/Testing:**
- **Kostenlos**: Sie können mit Ihrer Apple-ID kostenlos entwickeln und auf eigenen Geräten testen
- **Einschränkungen**: Apps laufen nur 7 Tage, begrenzte Services

**Für App Store Veröffentlichung:**
- **Apple Developer Program**: $99/Jahr
- **Vorteile:**
  - App Store Veröffentlichung
  - TestFlight für Beta-Testing
  - Zugriff auf alle Apple Services (Push Notifications, etc.)
  - Keine 7-Tage-Beschränkung
- **Anmeldung**: [developer.apple.com](https://developer.apple.com)

---

### 5.4 Build-Prozess für iOS

**Schritt-für-Schritt:**

```bash
# 1. iOS Platform hinzufügen
ionic cordova platform add ios

# 2. Erforderliche Plugins installieren
ionic cordova plugin add [plugin-name]

# 3. App für iOS bauen
ionic cordova build ios --prod

# 4. Projekt in Xcode öffnen
open platforms/ios/*.xcworkspace
```

**In Xcode:**
1. **Team auswählen**: Signing & Capabilities → Team (Apple-ID)
2. **Bundle Identifier**: Eindeutige ID für Ihre App (z.B. com.yourname.appname)
3. **Gerät auswählen**: Simulator oder echtes iOS-Gerät
4. **Build & Run**: Klicken Sie auf den Play-Button

---

### 5.5 Testen im Simulator

```bash
# Liste verfügbarer Simulatoren
ionic cordova emulate ios --list

# App im Simulator starten (Standard-Gerät)
ionic cordova emulate ios

# Spezifisches Gerät auswählen
ionic cordova emulate ios --target="iPhone-14-Pro"
```

---

### 5.6 Testen auf echtem Gerät

**Voraussetzungen:**
1. iPhone/iPad via USB verbunden
2. "Developer Mode" auf dem Gerät aktiviert (iOS 16+)
3. Gerät mit gleicher Apple-ID angemeldet

**Deployment:**
```bash
# App auf verbundenem Gerät installieren
ionic cordova run ios --device

# Mit Live-Reload
ionic cordova run ios --device --livereload
```

**Vertrauen des Entwicklers:**
- Auf dem Gerät: Einstellungen → Allgemein → VPN & Geräteverwaltung
- Ihrem Entwickler-Zertifikat vertrauen

---

### 5.7 iOS-spezifische Konfiguration

**config.xml anpassen:**

```xml
<platform name="ios">
    <!-- Mindest-iOS-Version -->
    <preference name="deployment-target" value="13.0" />
    
    <!-- App-Icons -->
    <icon src="resources/ios/icon/icon.png" width="57" height="57" />
    <icon src="resources/ios/icon/icon@2x.png" width="114" height="114" />
    
    <!-- Splash Screens -->
    <splash src="resources/ios/splash/Default@2x~iphone.png" width="640" height="960" />
    
    <!-- Swift Version -->
    <preference name="UseSwiftLanguageVersion" value="5.0" />
    
    <!-- WKWebView verwenden (empfohlen) -->
    <preference name="WKWebViewOnly" value="true" />
</platform>
```

---

### 5.8 Zusammenfassung: iOS-Entwicklung Checkliste

**Hardware & System:**
- ✅ Mac mit macOS Monterey oder neuer
- ✅ Mindestens 8 GB RAM (16 GB empfohlen)
- ✅ 50+ GB freier Speicherplatz

**Software:**
- ✅ Node.js installiert
- ✅ Ionic CLI installiert
- ✅ Cordova installiert
- ✅ Xcode aus dem App Store
- ✅ Xcode Command Line Tools
- ✅ CocoaPods installiert
- ✅ ios-deploy (für echte Geräte)

**Apple Account:**
- ✅ Apple-ID (kostenlos für Entwicklung)
- ✅ Apple Developer Program ($99/Jahr) für App Store

**Optional aber empfohlen:**
- ✅ Physisches iOS-Gerät für Tests
- ✅ TestFlight Account für Beta-Testing
- ✅ App Store Connect Zugang

---

## 6. Nützliche Befehle und Tipps

### 6.1 Ionic CLI Befehle

```bash
# Neue Seite erstellen
ionic generate page pageName

# Neuen Service erstellen
ionic generate service serviceName

# Komponente erstellen
ionic generate component componentName

# App-Informationen anzeigen
ionic info

# Projekt bereinigen
ionic cordova clean

# Plattformen verwalten
ionic cordova platform list
ionic cordova platform remove ios
ionic cordova platform update android
```

---

### 6.2 Debugging-Tipps

**Browser DevTools:**
- Beim Entwickeln mit `ionic serve` können Sie die Browser DevTools (F12) verwenden
- Console, Network, Elements, etc. wie bei normaler Web-Entwicklung

**Safari Web Inspector (für iOS):**
1. Safari → Einstellungen → Erweitert → "Entwicklermenü anzeigen"
2. Gerät/Simulator verbinden
3. Entwickeln → [Gerätename] → [App] auswählen

**Chrome Remote Debugging (für Android):**
1. Chrome öffnen: `chrome://inspect`
2. Android-Gerät via USB verbinden
3. USB-Debugging aktiviert
4. Gerät wird automatisch erkannt

---

### 6.3 Häufige Probleme und Lösungen

**Problem: `npm install` schlägt fehl**
```bash
# Cache leeren
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Problem: iOS Build-Fehler**
```bash
# Plattform neu installieren
ionic cordova platform remove ios
ionic cordova platform add ios

# CocoaPods neu installieren
cd platforms/ios
pod install
cd ../..
```

**Problem: Android Build-Fehler**
```bash
# Gradle bereinigen
cd platforms/android
./gradlew clean
cd ../..
```

---

## 7. Weiterführende Ressourcen

**Offizielle Dokumentation:**
- IONIC: [https://ionicframework.com/docs](https://ionicframework.com/docs)
- Angular: [https://angular.io/docs](https://angular.io/docs)
- Cordova: [https://cordova.apache.org/docs](https://cordova.apache.org/docs)

**Tutorials und Kurse:**
- IONIC Academy: [https://ionicacademy.com](https://ionicacademy.com)
- Udemy: Verschiedene IONIC-Kurse
- YouTube: Verschiedene Tutorial-Kanäle

**Community:**
- IONIC Forum: [https://forum.ionicframework.com](https://forum.ionicframework.com)
- Stack Overflow: Tag `ionic-framework`
- Discord: IONIC Community Server

**UI-Komponenten:**
- IONIC Components: [https://ionicframework.com/docs/components](https://ionicframework.com/docs/components)
- IONIC Native: [https://ionicframework.com/docs/native](https://ionicframework.com/docs/native)

---

## 8. Zusammenfassung

### Was Sie gelernt haben:

1. **Framework-Grundlagen:**
   - Angular für App-Logik und UI
   - Node.js für Entwicklungsumgebung
   - Cordova für native Kompilierung

2. **Installation:**
   - Node.js auf macOS installieren
   - Cordova und Ionic via npm
   - Verschiedene Installationsmethoden

3. **Projekt-Setup:**
   - Demo-Apps erstellen (tabs, sidemenu)
   - App im Browser testen
   - Projektstruktur verstehen

4. **iOS-Entwicklung:**
   - Mac und Xcode erforderlich
   - Apple Developer Account
   - Build und Deployment-Prozess
   - Testen auf Simulator und echten Geräten

### Nächste Schritte:

1. Erstellen Sie Ihre erste IONIC-App
2. Experimentieren Sie mit verschiedenen Templates
3. Erforschen Sie die IONIC-Komponenten
4. Fügen Sie Cordova-Plugins hinzu
5. Testen Sie auf echten Geräten
6. Veröffentlichen Sie im App Store / Google Play Store

---

**Viel Erfolg bei der IONIC-Entwicklung! 🚀**

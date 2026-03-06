# ITL_1_Felix_Heger

## Aufgabe: Datenbankanbindung mit UI

---

## Projektstruktur

```
ITL1/
├── server/                   # Node.js + Express + MySQL + Sequelize Backend
│   ├── config/config.json    # Datenbankverbindung (Sequelize)
│   ├── migrations/           # Datenbankmigrationen (Auto-generiert)
│   ├── models/               # Sequelize-Modelle (User)
│   ├── routes/users.js       # REST API Endpunkte (CRUD)
│   ├── seeders/              # Seed-Daten (optional)
│   └── index.js              # Express Server Einstiegspunkt
└── bestApp/bestApp/bestApp/  # Ionic Angular Frontend
    └── src/app/
        ├── tab1/             # Haupt-UI: Datenbankanbindung & CRUD
        └── services/
            └── user.service.ts  # HTTP Service für API-Kommunikation
```

---

## Entscheidungen (Decisions)

| Entscheidung | Gewählt | Begründung |
|---|---|---|
| Backend Framework | **Express.js** | Minimal, flexibel, weit verbreitet für Node.js REST APIs |
| ORM | **Sequelize** | Unterstützt MySQL, automatische Migration, JS-orientiert |
| Datenbankverbindung | **mysql2** | Offizieller, performanter MySQL-Client für Node.js |
| Datenbank | **MySQL** | Relationale DB, gut dokumentiert, weit verbreitet |
| Frontend Framework | **Ionic + Angular (Standalone)** | Bereits installiert; Standalone-Komponenten sind der moderne Angular-Standard |
| Angular Architektur | **Standalone Components** | Empfohlen seit Angular 14+, weniger Boilerplate als NgModules |
| HTTP-Client | **Angular HttpClient** | Standard in Angular, reaktiv via RxJS Observables |
| Port Backend | **3000** | Standardport für Node.js APIs, kein Konflikt mit Ionic (8100) |
| CORS | **cors Middleware** | Notwendig da Ionic (Port 8100) auf Backend (Port 3000) zugreift |
| MySQL Client | **XAMPP MariaDB 10.4** | Bereits installiert via XAMPP; Socket unter `/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock` |
| DB-Verbindung | **Unix Socket (dialectOptions)** | XAMPP nutzt Socket statt TCP → `socketPath` in Sequelize config nötig |

---

## Backend API Endpunkte

| Method | Endpunkt | Beschreibung |
|--------|----------|--------------|
| GET | `/api/users` | Alle User abrufen |
| GET | `/api/users/:id` | Einen User abrufen |
| POST | `/api/users` | Neuen User erstellen |
| PUT | `/api/users/:id` | User aktualisieren |
| DELETE | `/api/users/:id` | User löschen |

---

## Installation & Start

### Voraussetzungen
- Node.js installiert
- **XAMPP** läuft (MySQL/MariaDB auf Port 3306, Apache auf Port 80)
- MySQL Datenbank `ionic_taxi_dev` existiert (wird via XAMPP angelegt)

### 1. MySQL Datenbank erstellen
```bash
cd server
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```

### 2. Backend starten
```bash
cd server
npm start
# → Server läuft auf http://localhost:3000
```

### 3. Ionic App starten
```bash
cd bestApp/bestApp/bestApp
ionic serve
# → App läuft auf http://localhost:8100
```

---

## Tests & Ergebnisse

### Test 1: Node.js & npm Installation
- **Befehl:** `node --version` / `npm --version`
- **Ergebnis:** ✅ Node v24.x, npm v11.x
- **Entscheidung:** Methode 1 (direkt von nodejs.org) verwendet

### Test 2: Cordova & Ionic CLI Installation
- **Problem:** `EACCES: permission denied` bei globalem npm install
- **Lösung:** `sudo npm install -g cordova` und `sudo npm install -g @ionic/cli`
- **Ergebnis:** ✅ Beide installiert

### Test 3: Ionic Demo App erstellen
- **Befehl:** `ionic start bestApp tabs --type=angular`
- **Template:** Tabs gewählt (3 Tabs Navigation)
- **Angular Architektur:** Standalone Components gewählt (moderne Methode)
- **Ergebnis:** ✅ App läuft auf http://localhost:8100

### Test 4: npm install (Backend-Abhängigkeiten)
- **Problem:** `EACCES` Fehler beim npm install
- **Lösung:** `sudo npm cache clean --force`, dann `sudo npm install`
- **Ergebnis:** ✅ express, cors, morgan, sequelize, cookie-parser, mysql2 installiert

### Test 5: Sequelize CLI Init
- **Befehl:** `npx sequelize-cli init`
- **Ergebnis:** ✅ Ordner `config/`, `models/`, `migrations/`, `seeders/` erstellt

### Test 6: User Model generieren
- **Befehl:** `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string`
- **Ergebnis:** ✅ `models/user.js` und Migrationsdatei erstellt

### Test 7: Datenbankverbindung (Backend)
- **DB-Server:** XAMPP MariaDB 10.4.28 auf Port 3306
- **Socket:** `/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock`
- **Konfiguration:** `config/config.json` → username: root, password: null, database: ionic_taxi_dev
- **Problem:** Standard TCP-Verbindung schlägt fehl, da XAMPP Unix-Socket verwendet
- **Lösung:** `dialectOptions.socketPath` in `config/config.json` gesetzt
- **Ergebnis:** ✅ `Database connected and synced. Server running on http://localhost:3000`

### Test 8: REST API Endpunkte
- **POST** `/api/users` → 201 Created ✅
- **GET** `/api/users` → 200 OK, gibt alle User zurück ✅
- **Testuser:** Felix Heger (felix@itl1.at) mit ID 1 in DB gespeichert

### Test 9: Ionic CRUD UI
- **Tab 1:** Formular zum Hinzufügen von Usern
- **Tab 1:** Liste aller User aus der Datenbank
- **Tab 1:** Bearbeiten und Löschen von Usern
- **Fehlerbehandlung:** Zeigt Fehlermeldung wenn Backend nicht erreichbar

---

## iOS App Entwicklung – Voraussetzungen

| Anforderung | Details |
|---|---|
| Hardware | Mac mit macOS Monterey oder neuer |
| Xcode | Aus dem App Store installieren (~12 GB) |
| CocoaPods | `sudo gem install cocoapods` |
| Apple Developer Account | Kostenlos für Tests; $99/Jahr für App Store |
| ios-deploy | `npm install -g ios-deploy` (für echte Geräte) |

---

## Bekannte Probleme & Lösungen

| Problem | Lösung |
|---|---|
| `EACCES permission denied` bei npm | `sudo npm install -g ...` verwenden |
| MySQL connection refused | XAMPP starten; `dialectOptions.socketPath` in config/config.json prüfen |
| CORS Fehler im Browser | cors Middleware ist im Backend bereits aktiviert |
| Angular CLI nicht gefunden | Bei `ionic start`: Prompt mit `Y` bestätigen |

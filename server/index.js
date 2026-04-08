/**
 * @file index.js
 * @description Einstiegspunkt des Express-Backends für die TaxiApp.
 * Konfiguriert Middleware, Routen und startet den HTTP-Server nach
 * erfolgreicher Datenbankverbindung via Sequelize (MySQL/XAMPP).
 *
 * Kursanforderung Teil 1: DB-Setup mit Sequelize/MySQL
 * Kursanforderung Teil 2: JWT/Passport-Authentifizierung
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const db = require('./models');
const { passport } = require('./config/passport');

const app = express();
const PORT = 3000;

// ─── Middleware-Konfiguration ──────────────────────────────────────────────────
// cors() erlaubt Cross-Origin-Requests, damit das Ionic-Frontend (Port 8100)
// auf diese API (Port 3000) zugreifen kann – in Produktion auf spezifische Origins beschränken.
app.use(cors());

// morgan('dev') loggt HTTP-Requests im Dev-Modus (Methode, URL, Status, Antwortzeit).
app.use(morgan('dev'));

// express.json() parst den Request-Body als JSON – Pflicht für POST/PUT-Endpunkte.
app.use(express.json());

// cookieParser wird mitgeladen, auch wenn Cookies derzeit nicht aktiv genutzt werden;
// ermöglicht spätere Cookie-basierte Session-Erweiterungen ohne Umbau.
app.use(cookieParser());

// Passport-Middleware initialisieren – muss VOR den geschützten Routen registriert werden.
app.use(passport.initialize());

// ─── Routen-Registrierung ────────────────────────────────────────────────────
// /api/auth  → öffentliche Endpunkte (Register, Login) ohne JWT-Schutz
// /api/users → alle Endpunkte erfordern ein gültiges JWT (passport.authenticate als Inline-Middleware)
// Das Muster „Middleware direkt in app.use()" schützt die gesamte Router-Gruppe auf einmal,
// anstatt jeden einzelnen Handler separat zu schützen.
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
app.use('/api/auth', authRoutes);
app.use('/api/users', passport.authenticate('jwt', { session: false }), userRoutes);

// Health-Check-Endpunkt: gibt einen einfachen JSON-Status zurück, damit das Frontend
// und Monitoring-Tools prüfen können, ob der Server erreichbar ist.
app.get('/', (req, res) => {
  res.json({ message: 'Ionic Taxi API is running 🚀' });
});

// Sequelize synchronisiert das Schema mit { alter: true }:
// bestehende Tabellen werden sanft angepasst (fehlende Spalten ergänzt),
// aber KEINE Daten gelöscht. Für Produktion: Migrationen statt alter:true verwenden.
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database connected and synced.');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to connect to the database:', err);
  });

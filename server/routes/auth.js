/**
 * @file routes/auth.js
 * @description Authentifizierungs-Routen: Registrierung, Login, Profil und Token-Verifizierung.
 * POST /register und POST /login sind öffentlich (kein JWT erforderlich).
 * GET /profile und GET /verify sind durch passport.authenticate('jwt') geschützt.
 *
 * Kursanforderung Endabgabe: Registrierung UND Login mit JWT-Token-Rückgabe
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { passport } = require('../config/passport');
require('dotenv').config();

// POST /api/auth/register - Registrierung
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validierung: alle Felder sind Pflicht (entspricht der Frontend-Prüfung in register.page.ts)
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    // Prüfen ob Email bereits existiert
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email bereits registriert' });
    }

    // User erstellen (Passwort wird automatisch gehasht durch beforeCreate Hook in models/user.js)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    // JWT Token erstellen
    // issuer/audience müssen mit den passport.js-Optionen übereinstimmen (gegenseitige Validierung).
    // expiresIn '7d': Token ist 7 Tage gültig; danach muss sich der User neu anmelden.
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: process.env.JWT_ISSUER || 'accounts.itl1.com',
        audience: process.env.JWT_AUDIENCE || 'localhost'
      }
    );

    // token wird direkt in der Antwort zurückgegeben, damit der Client ihn sofort
    // in @capacitor/preferences speichern kann (kein zweiter Login-Request nötig).
    // user.toSafeObject() stellt sicher, dass kein Passwort-Hash übertragen wird.
    res.status(201).json({
      message: 'Registrierung erfolgreich',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
});

// POST /api/auth/login - Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validierung
    if (!email || !password) {
      return res.status(400).json({ error: 'Email und Passwort erforderlich' });
    }

    // User suchen
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Absichtlich identische Fehlermeldung wie bei falschem Passwort:
      // Angreifer sollen nicht erfahren, ob eine E-Mail-Adresse registriert ist (User Enumeration).
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Passwort prüfen (bcrypt.compare via validatePassword-Methode des User-Modells)
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen (identische Optionen wie bei /register)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: process.env.JWT_ISSUER || 'accounts.itl1.com',
        audience: process.env.JWT_AUDIENCE || 'localhost'
      }
    );

    res.json({
      message: 'Login erfolgreich',
      token,
      user: user.toSafeObject()
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ error: 'Login fehlgeschlagen' });
  }
});

// GET /api/auth/profile - Geschütztes Profil (benötigt JWT)
// req.user wird von passport mit dem Ergebnis des Verify-Callbacks befüllt (toSafeObject())
router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      console.error('Profil-Fehler:', error);
      res.status(500).json({ error: 'Profil konnte nicht geladen werden' });
    }
  }
);

// GET /api/auth/verify - Token validieren
// Wird vom Frontend (AuthService.verifyToken()) genutzt, um abgelaufene Tokens zu erkennen.
router.get('/verify',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      valid: true,
      user: req.user
    });
  }
);

module.exports = router;

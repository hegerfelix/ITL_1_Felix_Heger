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
    
    // Validierung
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    // Prüfen ob Email bereits existiert
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email bereits registriert' });
    }

    // User erstellen (Passwort wird automatisch gehasht durch beforeCreate Hook)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    // JWT Token erstellen
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: process.env.JWT_ISSUER || 'accounts.itl1.com',
        audience: process.env.JWT_AUDIENCE || 'localhost'
      }
    );

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
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Passwort prüfen
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // JWT Token erstellen
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

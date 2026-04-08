/**
 * @file routes/users.js
 * @description CRUD-Routen für die Benutzerverwaltung.
 * WICHTIG: Alle Endpunkte in dieser Datei sind durch JWT-Authentifizierung geschützt –
 * passport.authenticate('jwt') wird in index.js auf den gesamten /api/users-Prefix angewendet.
 *
 * Kursanforderung Teil 1: Datenbankoperationen mit Sequelize (CRUD)
 */

const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET / – Gibt alle Benutzer zurück.
// Für Produktion: User.findAll({ attributes: { exclude: ['password'] } }) verwenden,
// damit kein Passwort-Hash in der Antwort enthalten ist.
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /:id – Sucht per Primärschlüssel (findByPk ist effizienter als findOne({ where: { id } })).
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / – Erstellt einen neuen Benutzer ohne Passwort (direkter CRUD-Endpunkt).
// Für Benutzer MIT Passwort und Auth-Flow: POST /api/auth/register verwenden.
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.create({ firstName, lastName, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /:id – Aktualisiert firstName, lastName und email.
// user.update() löst den beforeUpdate-Hook aus, falls das Passwort übergeben wird (Rehashing).
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { firstName, lastName, email } = req.body;
    await user.update({ firstName, lastName, email });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /:id – Löscht den Benutzer permanent.
// Bestätigung erfolgt im Frontend via AlertController (deleteUser in tab1.page.ts).
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

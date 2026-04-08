'use strict';

/**
 * @file 20260311111651-add-password-to-users.js
 * @description Migration Teil 2: Fügt das Passwort-Feld zur Users-Tabelle hinzu.
 * Kursanforderung Teil 2: JWT/Passport-Authentifizierung setzt ein Passwort-Feld voraus.
 * allowNull: true schützt bestehende User-Datensätze aus Migration 1 vor Validierungsfehlern.
 * up(): Spalte hinzufügen | down(): Spalte entfernen (Rollback zu Teil 1)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: true, // Existing users don't have passwords yet
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'password');
  }
};

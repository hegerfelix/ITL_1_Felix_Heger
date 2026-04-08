'use strict';

/**
 * @file 20260225104548-create-user.js
 * @description Migration Teil 1: Erstellt die initiale Users-Tabelle.
 * Kursanforderung Teil 1: DB-Setup mit Sequelize – diese Migration legt die
 * Grundstruktur der Datenbank fest (Vorname, Nachname, E-Mail, Timestamps).
 * up(): Tabelle erstellen | down(): Tabelle wieder löschen (Rollback)
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
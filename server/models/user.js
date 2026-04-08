'use strict';

/**
 * @file models/user.js
 * @description Sequelize-Modell für den Benutzer (User).
 * Enthält Felder, Validierungsregeln und Passwort-Hashing-Hooks.
 *
 * Kursanforderung Teil 2: Passwort wird mit bcrypt (10 Runden) gehasht –
 * niemals im Klartext in der Datenbank gespeichert.
 */

const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
   * @class User
   * @extends Model
   * @description Repräsentiert einen registrierten Benutzer der TaxiApp.
   */
  class User extends Model {
    static associate(models) {
      // define association here
    }

    /**
     * Vergleicht ein Klartext-Passwort mit dem gespeicherten bcrypt-Hash.
     * bcrypt.compare() ist timing-safe und verhindert Timing-Angriffe.
     * @param {string} password - Das eingegebene Klartext-Passwort
     * @returns {Promise<boolean>} true wenn das Passwort korrekt ist
     */
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    /**
     * Gibt ein Benutzerobjekt ohne das Passwort-Hash-Feld zurück.
     * Wird in JWT-Payloads und API-Responses verwendet, um sicherzustellen,
     * dass der Passwort-Hash niemals an den Client übertragen wird.
     * @returns {{ id, firstName, lastName, email, createdAt, updatedAt }}
     */
    toSafeObject() {
      return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    // email: unique + isEmail-Validierung verhindert doppelte Accounts und ungültige Formate
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    // password: allowNull:true ermöglicht User-Datensätze ohne Passwort (z.B. aus Migration 1)
    password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    // ─── Lifecycle-Hooks ────────────────────────────────────────────────────────
    // beforeCreate: Passwort wird VOR dem ersten Speichern gehasht.
    // beforeUpdate: Passwort wird nur neu gehasht, wenn es tatsächlich geändert wurde
    //               (user.changed('password') verhindert unnötiges Rehashing bei anderen Updates).
    // bcrypt.genSalt(10): Kostenfaktor 10 ist der empfohlene Standard-Kompromiss zwischen
    // Sicherheit und Performance (2^10 = 1024 Iterationen).
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
};

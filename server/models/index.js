'use strict';

/**
 * @file models/index.js
 * @description Sequelize-Initialisierung und dynamischer Modell-Loader.
 * Liest die Datenbankverbindungsparameter aus config/config.json (umgebungsabhängig),
 * lädt alle Modell-Dateien im selben Verzeichnis automatisch und registriert Assoziationen.
 *
 * Kursanforderung Teil 1: DB-Setup mit Sequelize/MySQL
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
// Verbindung entweder über eine einzelne Umgebungsvariable (DATABASE_URL-Stil, z.B. Heroku)
// oder klassisch mit separaten Credentials aus config.json aufbauen.
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Alle .js-Dateien in diesem Verzeichnis werden als Sequelize-Modelle geladen,
// ausgenommen: Dateien die mit '.' beginnen, diese Datei selbst (basename) und Test-Dateien.
// Das ermöglicht das Hinzufügen neuer Modelle ohne Änderung dieser Datei.
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Assoziationen (hasMany, belongsTo etc.) werden NACH dem Laden aller Modelle registriert,
// damit gegenseitige Referenzen (z.B. User hasMany Orders) problemlos funktionieren.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// db.sequelize  → die aktive Verbindungsinstanz (für sync(), authenticate(), Transaktionen)
// db.Sequelize  → die Sequelize-Klasse selbst (für DataTypes, Op usw. in anderen Dateien)
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

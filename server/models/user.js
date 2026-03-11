'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    // Method to validate password
    async validatePassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    // Method to get safe user data (without password)
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
    email: { 
      type: DataTypes.STRING, 
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
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

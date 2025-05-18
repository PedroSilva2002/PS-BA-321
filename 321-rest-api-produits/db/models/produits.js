'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('produits', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Le nom du produit ne doit pas être null" },
      notEmpty: { msg: "Le nom du produit ne doit pas être vide" }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  prix: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notNull: { msg: "Le prix du produit ne doit pas être null" },
      isDecimal: { msg: "Le prix doit être un nombre décimal" },
      min: {
        args: [0.01],
        msg: "Le prix doit être supérieur à 0"
      }
    }
  },
  quantite_en_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "La quantité en stock ne doit pas être null" },
      isInt: { msg: "La quantité doit être un nombre entier" },
      min: {
        args: [1],
        msg: "La quantité en stock doit être supérieure à 0"
      }
    }
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, {
  freezeTableName: true,
  modelName: 'produits'
});

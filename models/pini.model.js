const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../sequelize.config');

const Pini = sequelize.define('Pini', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    Nome: DataTypes.STRING,
    Descricao: DataTypes.STRING,
    DescricaoCombo: DataTypes.STRING,
    Valor: DataTypes.FLOAT
});

module.exports = Pini;

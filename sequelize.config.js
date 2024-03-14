const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'mssql', 
    port: 1433, 
    username: 'SA', 
    password: 'abc123.,', 
    database: 'PINI' 
});

module.exports = sequelize;

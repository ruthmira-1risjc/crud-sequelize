const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mssql',
    host: 'mssql', 
    port: 1433, // A porta padrão do SQL Server
    username: 'SA', // O usuário SA padrão
    password: 'abc123.,', // A senha configurada para o usuário SA
    database: 'PINI' // O nome do banco de dados que você deseja acessar
});

module.exports = sequelize;

const Sequelize = require("sequelize");
const connection = require("../database/database");


const Venda = connection.define("vendas", {
    idUser:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    desc: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
    },valor: {
        type: Sequelize.STRING,
        allowNull: false,
    },endereco: {
        type: Sequelize.STRING,
        allowNull: false,
    
    },idCompra: {
        type: Sequelize.STRING,
        allowNull: false,
    
    }
})
Venda.sync({force:false})
module.exports = Venda;
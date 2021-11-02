const Sequelize = require("sequelize");
const connection = require("../database/database");




const VendaC = connection.define("vendasFinalizadas", {
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

});


VendaC.sync({force:false})


module.exports = VendaC;

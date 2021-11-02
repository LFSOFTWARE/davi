const Sequelize = require("sequelize");
const connection = require("../database/database");




const prod = connection.define("Produtos", {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  price: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  estoque: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  material: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ponta1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
   ponta2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
   peso: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  comprimento: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  desc: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
     img: {
    type: Sequelize.STRING,
    allowNull: false,
  },

});


prod.sync({force:false})


module.exports = prod;

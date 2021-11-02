const Sequelize = require("sequelize");
const connection = require("../database/database");
const Produto = require("./prod.js");



const Photo = connection.define("Photo", {
    idProd:{
    type: Sequelize.STRING,
    allowNull: false,
    },
    img:{
    type: Sequelize.STRING,
    allowNull: false,
    },
});


Photo.sync({force:false})





module.exports = Photo;

const Sequelize = require("sequelize")


const Connection = new Sequelize('lojamuri','luizediego','Fernandinho123',{

    host:'db4free.net',
    dialect: 'mysql',
    timezone:"-03:00"

})


module.exports = Connection
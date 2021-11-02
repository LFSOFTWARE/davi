var knex = require('knex')({
    client:'mysql2',
    connection:{
        host:'db4free.net',
        user: 'luizediego',
        password:'Fernandinho123',
        database: 'lojamuri'
    }
})


module.exports = knex;


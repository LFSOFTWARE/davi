const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/users");
const userAuth = require("../middle/userAuth.js")
const MercadoPago = require("mercadopago");

MercadoPago.configure({
  sandbox: true,
  access_token:
    "TEST-7648723658090627-082915-8dfc494a6546d77c2d75196366d07bd1-815379202",
});



async function base(valor, desc, id) {
          var dados = {
            items: [
              (item = {
                id: id,
                title: desc,
                quantity: 1,
                currency_id: "BRL",
                unit_price: parseFloat(valor),
              }),
            ],
            payer: {
              email: email,
            },
            external_reference: id,
          };

          try {
            var pagamento = await MercadoPago.preferences.create(dados);
            return res.redirect(pagamento.body.init_point);
          } catch (err) {
            res.send(err);
          }
        }




router.get("/modal",(req,res)=>{
  res.render("testeModal")
})



router.get("/login", (req, res) => {
  var credenciaisInvalidas = req.flash("credenciaisInvalidas");
  credenciaisInvalidas =
    credenciaisInvalidas == undefined || credenciaisInvalidas.length == 0
      ? undefined
      : credenciaisInvalidas;
  res.render("user/login", { credenciaisInvalidas });
});
router.post("/login", (req, res) => {
  var email = req.body.email;
  var pass = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  })
    .then((result) => {
      if (result != undefined) {
        var correct = bcryptjs.compareSync(pass, result.password);

        if (correct) {
          req.session.user = result;

          if (result.status != "1") {
            res.redirect("/");
          } else {
            res.redirect("/adm");
          }
        } else {
          res.redirect("/login");
        }
      } else {
        var credenciaisInvalidas = "As credencias inválidas!";
        req.flash("credenciaisInvalidas", credenciaisInvalidas);
        res.redirect("/login");
      }
    })
    .catch((err) => {
      res.redirect("/login");
    });
});

router.get("/register", (req, res) => {
  var erros = req.flash("erros");
  var email = req.flash("email");
  var nome = req.flash("nome");

  email = (email == undefined || email.length == 0 )? "" : email;
  nome = (nome == undefined || nome.length == 0)?"":nome
  if (erros.length == 0) {
    erros = undefined;
  } else {
    erros = erros;
  }
  
  res.render("user/register", { erros,email:email ,nome:nome});
});

router.post("/register", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var fullname = req.body.nome;
  var confirmP = req.body.confirmP;
  var nome = fullname.split(" ");

  var erros = [];
  req.flash("email", email);
  req.flash("nome", fullname);

  if (email == undefined) {
    erros.push({ msg: "Email invalido" });
  }

  if (password != confirmP) {
    erros.push({ msg: "As senhas não se correspondem." });
  }

  if (fullname == undefined || fullname.length == 0) {
    erros.push({ msg: "Nome invalido" });
  }

  if (erros.length > 0) {
    req.flash("erros", erros);
    res.redirect("/register");
  } else {
    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, salt);

    User.create({
      email: email,
      password: hash,
      nome: nome[0],
      fullname: fullname,
      status: "0",
    })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        res.send(err);
      });
  }
});


router.get("/cursos",(req,res)=>{
  res.render("cursos.ejs")
})
router.get("/cursos-info",(req,res)=>{
  res.render("infoCorse.ejs")
})

router.get("/dados",(req,res)=>{
  const database = require("../database/databaseKnex.js")

    database.raw("SELECT month(createdAT) as mes,count(month(createdAT)) as qtd FROM vendasFinalizadas group by month(createdAT) order by  mes asc ").then((result) => {
          res.json(result[0])
    }).catch((err) => {
      
    });

})



router.post("/pagamento",userAuth, (req, res) => {
  var desc = req.body.desc;
  
  var email = req.session.user.email ;
  var idUser = req.session.user.id;
  try {
    desc = JSON.parse(desc);
    desc.map((e) => {
      idProds.push(parseInt(e.id));
    });
  }catch(error) {
    res.redirect("/checkOut");
  }

  
});








module.exports = router;

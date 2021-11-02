const express = require("express");
const router = express.Router();
const axios = require("axios");
const Produto = require("../models/prod.js");
const Photos = require("../models/photos.js");
const Vendas = require("../models/venda.js");
const Users = require("../models/users.js");
const VendaFinalizada = require("../models/vendaComcluida.js");
const admAuth = require("../middle/admAuth.js");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", admAuth, (req, res) => {
  Produto.findAll()
    .then((result) => {
      res.render("adm/index", { produto: result });
    })
    .catch((err) => {
      res.redirect("/adm");
    });
});

router.get("/prod/:id", admAuth, (req, res) => {
  var id = req.params.id;
  Produto.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      Photos.findAll({ where: { idProd: result.id } })
        .then((photos) => {
          res.render("adm/editProd", { produto: result, photos: photos });
        })
        .catch((err) => {});
    })
    .catch((err) => {
      res.redirec("/adm");
    });
});

router.post("/prod", admAuth, upload.array("file", 3), (req, res) => {
  var id = req.body.id;
  var photos = req.files;

  var {
    nome,
    price,
    peso,
    material,
    estoque,
    ponta1,
    ponta2,
    comprimento,
    desc,
  } = req.body;

  Photos.findAll({
    where: { idProd: id },
  })
    .then((result) => {
      var i = 0;
      result.map((e) => {
        Photos.update({ img: photos[i].filename }, { where: { idProd: id } })
          .then((result) => {
            i++;
          })
          .catch((err) => {});
      });
    })
    .catch((err) => {});

  Produto.update(
    {
      nome: nome,
      price: price,
      peso: peso,
      material: material,
      estoque: estoque,
      ponta1: ponta1,
      ponta2: ponta2,
      peso: peso,
      desc: desc,
      comprimento: comprimento,
    },
    { where: { id: id } }
  )
    .then((result) => {
      res.redirect("/adm");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/Adicionar", admAuth, (req, res) => {
  res.render("adm/addProd");
});

router.post("/Adicionar", admAuth, upload.array("file", 4), (req, res) => {
  var photos = req.files;
  var imgProd = photos[0].filename;

  var {
    nome,
    price,
    peso,
    material,
    estoque,
    ponta1,
    ponta2,
    comprimento,
    desc,
  } = req.body;

  Produto.create({
    nome: nome,
    price: price,
    peso: peso,
    material: material,
    estoque: estoque,
    ponta1: ponta1,
    ponta2: ponta2,
    peso: peso,
    desc: desc,
    comprimento: comprimento,
    img: imgProd,
  })
    .then((result) => {
      photos.map((e) => {
        Photos.create({
          idProd: result.id,
          img: e.filename,
        })
          .then((result) => {})
          .catch((err) => {
            console.log(err);
            res.redirec("/");
          });
      });
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/produto/:id", admAuth, (req, res) => {
  var id = req.params.id;

  Produto.destroy({ where: { id: id } })
    .then((result) => {
      res.status(200);
      res.redirect("/adm");
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.get("/pedidos", admAuth, (req, res) => {
  Vendas.findAll()
    .then((result) => {
      res.render("adm/pedidos", { pedidos: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/vendas", admAuth, (req, res) => {
  Vendas.findAll()
    .then((result) => {
      res.render("adm/venda", { pedidos: result });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/vendasFinalizadas/:asc?", admAuth, (req, res) => {
  var asc = req.params.asc;

  if (asc == "date") {
  }

  VendaFinalizada.findAll({ order: [["createdAt", "desc"]] })
    .then((result) => {
      res.render("adm/finalizadas", { pedidos: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/info/:id", admAuth, (req, res) => {
  var id = req.params.id;
  Vendas.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      var cep = result.endereco.split(" ")
      console.log('====================================');
      console.log(cep);
      console.log('====================================');

      axios
        .get(`https://terapias-muri.herokuapp.com/cep/${cep[1]}`)
        .then((end) => {
          var local = {
            rua: end.data.logradouro,
            cep: result.endereco,
            city: end.data.localidade,
          };
          
          Users.findOne({where:{id:result.idUser}}).then((user) => {
             res.render("adm/infoVenda", { venda: result, local: local,user:user });
          }).catch((err) => {
            console.log(err);
            res.redirec("/")
          });
         
        })
        .catch((err) => {});
    })
    .catch((err) => {
      res.redirect("/adm");
    });
});

router.post("/finalizar/:id", admAuth, (req, res) => {
  var id = req.params.id;

  Vendas.findOne({ where: { id: id } })
    .then((result) => {
      if (result.status != "P") {
        res.redirec("/");
      }

      var { idUser, desc, status, valor, endereco, idCompra } = result;
      VendaFinalizada.create({
        idUser,
        desc,
        status: "enviado",
        valor,
        endereco,
        idCompra,
      })
        .then((result) => {
          Vendas.destroy({ where: { id: id } })
            .then((result) => {
              res.status(200);
              res.redirect("/adm");
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/");
            });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
});


router.get("/curso",(req,res)=>{
  res.render("corse/curso.ejs")
})

router.get("/teste",(req,res)=>{
  res.render("testeModal.ejs")
})

module.exports = router;

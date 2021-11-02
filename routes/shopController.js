const express = require("express");
const router = express.Router();
const Produto = require("../models/prod");
const MercadoPago = require("mercadopago");
const Photos = require("../models/photos.js");
const Venda = require("../models/venda.js");
const { calcularPrecoPrazo } = require("correios-brasil");
const userAuth = require("../middle/userAuth.js")
MercadoPago.configure({
  sandbox: true,
  access_token:
    "TEST-7648723658090627-082915-8dfc494a6546d77c2d75196366d07bd1-815379202",
});

router.get("/", (req, res) => {
  Produto.findAll({ limit: 8 })
    .then((produtos) => {
      res.render("index", { produtos: produtos });
    })
    .catch((err) => {
      res.redirect("/");
    });
});

router.get("/Produtos", (req, res) => {
 
  if(req.query.produto != undefined){
    var nome = req.query.produto
     Produto.findAll({where:{nome:nome}})
    .then((produtos) => {
      
      res.render("shop", { produtos: produtos });
    })
    .catch((err) => {
      res.redirect("/");
    });
  }else{
  Produto.findAll()
    .then((produtos) => {
      res.render("shop", { produtos: produtos });
    })
    .catch((err) => {
      res.redirect("/");
    });
  }



});

router.get("/Produto/:id", (req, res) => {
  let id = req.params.id;

  Produto.findOne({ where: { id: id } })
    .then((result) => {
      Produto.findAll({ limit: 4 })
        .then((produtos) => {
          Photos.findAll({ where: { idProd: result.id } })
            .then((photos) => {

              
              res.render("infoProd", {
                prod: result,
                produtos: produtos,
                photos: photos,
              });
            })
            .catch((err) => {});
        })
        .catch((err) => {
          res.redirect("/");
        });
    })
    .catch((err) => {
      res.redirec("/");
    });
});

router.get("/checkOut",userAuth, (req, res) => {
  res.render("checkout");
});

router.get("/prodsJson/:ids", (req, res) => {
  var ids = req.params.ids;

  ids = ids.split(",");

  Produto.findAll({ where: { id: ids } })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.redirec("/");
    });
});

router.get("/cep/:cep", (req, res) => {
  const { consultarCep } = require("correios-brasil");
  const { calcularPrecoPrazo } = require("correios-brasil");
  const cep = req.params.cep;

  let args = {
    // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
    sCepOrigem: "06333395",
    sCepDestino: cep,
    nVlPeso: "1",
    nCdFormato: "1",
    nVlComprimento: "20",
    nVlAltura: "20",
    nVlLargura: "20",
    nCdServico: ["04014", "04510"], //Array com os códigos de serviço
    nVlDiametro: "0",
  };

  consultarCep(cep).then((response) => {
    calcularPrecoPrazo(args).then((response2) => {
      var dados = Object.assign({}, response, response2);
      res.json(dados);
    });
  });
});

router.post("/pagamento",userAuth, (req, res) => {
  var desc = req.body.desc;
  var cep = req.body.cep;
  var house_n = req.body.number;
  var idProds = [];
  var descricao = [];
  var email = req.session.user.email ;
  var idUser = req.session.user.id;
  try {
    desc = JSON.parse(desc);
    desc.map((e) => {
      idProds.push(parseInt(e.id));
    });
  } catch (error) {
    res.redirect("/checkOut");
  }

  Produto.findAll({
    where: {
      id: idProds,
    },
  })
    .then((result) => {
      var valorCompra = 0;

      result.map((produto) => {
        var index = desc
          .map((eDesc) => {
            return eDesc.id;
          })
          .indexOf(produto.id);

        valorCompra +=
          parseInt(desc[index].quantidade) * parseInt(produto.price);

        descricao.push(
          `${produto.nome} Qtd ${desc[index].quantidade} 
          `
        );
      });

      let args = {
        // Não se preocupe com a formatação dos valores de entrada do cep, qualquer uma será válida (ex: 21770-200, 21770 200, 21asa!770@###200 e etc),
        sCepOrigem: "06333395",
        sCepDestino: cep,
        nVlPeso: "1",
        nCdFormato: "1",
        nVlComprimento: "20",
        nVlAltura: "20",
        nVlLargura: "20",
        nCdServico: ["04014", "04510"], //Array com os códigos de serviço
        nVlDiametro: "0",
      };

      calcularPrecoPrazo(args).then((response) => {
        if (req.body.flexRadioDefault == 1) {
          valor2 = response[1].Valor.toString().replace(",", ".");
          valorCompra = parseFloat(valor2) + parseFloat(valorCompra);
          descricao.push("PAC");
        } else {
          valor2 = response[0].Valor.toString().replace(",", ".");
          valorCompra = parseFloat(valor2) + parseFloat(valorCompra);
          descricao.push("SEDEX");
        }
        descricao.push(`R$ ${valorCompra}`);

        var descri = descricao.join(" ");
        var id = "" + Date.now();
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

        Venda.create({
          idUser: idUser,
          desc: descri,
          status: "A",
          valor: valorCompra,
            endereco: `Cep ${cep} Number ${house_n}`,
          idCompra: id,
        })
          .then((result) => {})
          .catch((err) => {
            console.log(err);
            res.redirect("/");
          });

        base(valorCompra, descri, id);
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/checkOut");
    });
});


router.post("/not",(req,res)=>{
  var id = req.query.id

  setTimeout(() => {
    var filtro = {
      "order.id":id
    }


    MercadoPago.payment.search({
      qs:filtro
    }).then((result) => {

        var pagamento = result.body.results[0];


        if(pagamento != undefined ){
          if(pagamento.status === "approved"){
               Venda.update({status:'P'},{where:{idCompra:pagamento.external_reference}}).then((result) => {
                 console.log("oiiiiiiiiiiiiii")
          }).catch((err) => {
            console.log(err)
          });
          }
        }
      
    }).catch((err) => {
      console.log(err);
      res.redirect("/");
    });
  }, 20000);


  res.status(200)
  res.send("ok");
})

module.exports = router;

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const MercadoPago = require("mercadopago");
MercadoPago.configure({
  sandbox: true,
  access_token:
    "TEST-7648723658090627-082915-8dfc494a6546d77c2d75196366d07bd1-815379202",
});
const Vendas = require("./models/venda.js");

const bcryptjs = require("bcryptjs");
const Connection = require("./database/database");
const Produto = require("./models/prod");
const { calcularPrecoPrazo } = require("correios-brasil");
const User = require("./models/users");

//View Engine
app.set("view engine", "ejs");

//Database
Connection.authenticate()
  .then(() => {
    console.log("Conected in MYSQL");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cookieParser("asdasdas"));

//Sessions

app.use(
  session({
    secret: "Senhasecretinha",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    resave: true,
    saveUninitialized: true,
  })
);
//Static
app.use(express.static("public"));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(flash());
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

//Routers
const shop = require("./routes/shopController");
const adm = require("./routes/admController");
const user = require("./routes/userController");

app.use("/", shop);
app.use("/adm", adm);
app.use("", user);

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log("Server escutando");
});

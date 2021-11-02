//Ajax
var xhr = new XMLHttpRequest();

var carrinho = JSON.parse(localStorage.getItem("cartUser")) || [];

//Salva carrinho no storage 
function salvarStorage(carrinho) {
  localStorage.setItem("cartUser", JSON.stringify(carrinho));
}
//Busca os ids para pegar na API
var idPords = [];
carrinho.map((e) => {
  idPords.push(e.id+',');
});

console.log(idPords)
//Inicio Ajax
xhr.open("GET", `https://terapias-muri.herokuapp.com/prodsJson/${idPords}`);

xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
xhr.onprogress = () => {
 var cart = document.querySelector("#lista")

 cart.innerHTML += `
 
   <div class="spinner-border" role="status">
  <span class="sr-only">Loading...</span>
</div>
 `
 
};

//Ao Carregar o ajax s
xhr.onload = function () {

  var items = JSON.parse(xhr.responseText);
  var carrinho = JSON.parse(localStorage.getItem("cartUser")) || [];

  function listarCart() {
      var carrinho = JSON.parse(localStorage.getItem("cartUser")) || [];
      var icon = document.querySelector("#icon_cart");
       var cartInfo = document.querySelector("#cart-info");
      var somaItens = 0;
      var desc = document.querySelector("#desc");
      desc.value = JSON.stringify(carrinho);  
      carrinho.map((e) => {
        somaItens += e.quantidade;
      });

      icon.textContent = somaItens;
    cartInfo.textContent = somaItens;
      var cart = document.querySelector("#lista");
      cart.innerHTML = "";

      var somaCart = 0;

      carrinho.map((e) => {
        let prod = items
          .map((pr) => {
            return pr.id;
          })
          .indexOf(parseInt(e.id));
       
        cart.innerHTML += ` <li class="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <img src="/img/${items[prod].img}" width="100px" alt="">

                </div>
                <div style="padding-right:15%">
                  <h6 class="my-0">${items[prod].nome}</h6>
                  <small class="text-muted">Qtd ${e.quantidade}</small>
                    <h6 class="my-0">R$ ${items[prod].price}</h6>
                <a   class="key btn btn-danger excluir" key="${e.id}" href="#">X</a>
                    </div>
              </li>`;

        somaCart += parseInt(items[prod].price) * parseInt(e.quantidade);
      });

    cart.innerHTML += `
                <li class="list-group-item d-flex justify-content-between">
                  <span>Total (BRL)</span>
                  <strong>R$  <b id="total">${somaCart}</b></strong>
                 
                    <input  id="back" value="${somaCart}" type="hidden"></input>
                </li>`;

    base();
  }

  listarCart();

  function base() {
    var carrinho = JSON.parse(localStorage.getItem("cartUser")) || [];
    var links = document.getElementsByClassName("key");

    for (let index = 0; index < links.length; index++) {
      links[index].addEventListener("click", function () {
        let key = this.getAttribute("key");

        let test = carrinho
          .map((e) => {
            
            return e.id;
          })
          .indexOf(parseInt(key));

        if (carrinho[test].quantidade > 1) {
          carrinho[test].quantidade--;
        } else {
          carrinho.splice(test, 1);
        }

        salvarStorage(carrinho);
        listarCart();

        return false;
      });
    }
  }
};

xhr.send();

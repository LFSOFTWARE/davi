



var carrinhoUser = JSON.parse(localStorage.getItem('cartUser'))|| [];
var btn_add = document.querySelector("#btn-add");
var icon_cart = document.querySelector("#icon_cart");

var somaQtd = 0;

var qtddItem = carrinhoUser.map((prod)=>{
    somaQtd += prod.quantidade


})


icon_cart.textContent =  somaQtd;


function salvarStorage(carrinho) {
    localStorage.setItem('cartUser',JSON.stringify(carrinho));
}

function updateCartIcon(){
    
    icon_cart.textContent = parseInt(icon_cart.textContent) + 1;

}

try {
    btn_add.onclick =  function add_cart(){
    
    var id_item = document.querySelector("#id_item").textContent;

    var indexCart =  carrinhoUser.map((e)=>{
        return e.id
    }).indexOf(parseInt(id_item))

   
    
    if (indexCart != -1) {
          carrinhoUser[indexCart].quantidade += 1;  
    }else{
        var item  = {
            id: parseInt(id_item),
            quantidade: 1
        }

        carrinhoUser.push(item);
    }

    

    salvarStorage(carrinhoUser);
    updateCartIcon()

}
} catch (error) {
    
}






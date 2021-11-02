
var imgs = document.querySelectorAll(".imgcarro")
var divs = document.querySelectorAll(".paleta")

divs[1].onclick = function(){
    
    for (var i = 0 ; i < imgs.length ;i++){
      imgs[i].src = "/img/pe2.jpg"
    }
    
}

var paleta_hero =  document.querySelector(".paleta_hero")
var nome = document.querySelector(".nome").innerHTML

var nomes = nome.split(" ")

if(nomes[1] != "PÉ"){
  paleta_hero.style.display = "none"
}



function modal_troca(img) {
   var imgClick = img
   var imgModal = document.querySelector(".imgModal")

  imgModal.src = imgClick.src
}

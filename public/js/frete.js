
  
    var cep = document.querySelector("#zip");

    cep.onchange = function (){
        teste(cep.value)
    }


    function teste(cep){
        var xhr = new XMLHttpRequest();

          var form2 = document.querySelector("#form-adress")
              console.log(form2)
          form2.innerHTML =  `   <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span><img width="50px" src="/img/box.png" alt="">
            </div>`







        xhr.open("GET", `https://terapias-muri.herokuapp.com/cep/${cep}`);

        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onprogress = () => {
            
 
         
        };

        xhr.onload = function () {
            var frete = JSON.parse(xhr.responseText)
            var state = document.querySelector("#state");
            var city = document.querySelector("#city");
            var address = document.querySelector("#address");
            var form = document.querySelector("#form-adress")
         
            
            state.value = frete.uf
            address.value = `Rua: ${frete.logradouro} ${frete.bairro}`
            city.value = `${frete.localidade}`
            form.innerHTML = ""

            form.innerHTML += `
            <div class="form-check">
            <h3>Frete</h3>
                    <input  onclick="updatePrice(this)" value="0" valor="${frete[0].Valor} "  class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                    <label class="form-check-label" for="flexRadioDefault1">
                      Sedex R$ ${frete[0].Valor} 
                    </label>
                  </div>
                  <div class="form-check">
                    <input onclick="updatePrice(this)" valor="${frete[1].Valor} " value="1" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked>
                    <label class="form-check-label" for="flexRadioDefault2">
                     Pac   R$ ${frete[1].Valor} 
                    </label>
                  </div>`
        }


        xhr.send()
    }


   

function updatePrice(element){
    var total = document.querySelector("#total");
    var back = document.querySelector("#back").value;
    var valor = element.getAttribute('valor');
    
    valor = valor.toString().replace(",",".");
        
     total.textContent = parseFloat(back) + parseFloat(valor)
    
    
         
}
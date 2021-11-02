var myModal = document.getElementById('prod_img')
var myInput = document.getElementById('teste')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})
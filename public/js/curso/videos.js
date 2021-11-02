

function  trocarVideo(aula) {
    var video = aula.getAttribute("data-aula");
    var play = document.getElementById("play");
    var src = play.src.split("video");
    var newSrc = src[0] + 'video/'+video

    play.src = newSrc;
  

     
					

}



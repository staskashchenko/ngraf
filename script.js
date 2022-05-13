//graf init
var graf = document.getElementById("myGraf");
var gcordX = graf.width/1000;
var gcordY = graf.height/1000;
var gctx = graf.getContext("2d");
//left init
var left = document.getElementById("myLeftBlock");
var lcordX = left.width/1000;
var lcordY = left.height/1000;
var lctx = left.getContext("2d");
//bottom init
var bottom = document.getElementById("myBottomBlock");
var bcordX = bottom.width/1000;
var bcordY = bottom.height/1000;
var bctx = bottom.getContext("2d");
//VAR's
var T;  //период между самой левой и самой правой точкой отображается на графе
var dt; //время между изменениями периода T
var u;  //величина изменения T в миллисекундах каждые dt миллисекунд
var wst; //величина промежутка времени между поступлением времени
//input
document.forms.inx.onsubmit = function(){
    var message = this.message.value;
    console.log(message);
    return false;
  };
function input(){
    
}
//WS
function WS(){

}
//draw
function draw(){

}


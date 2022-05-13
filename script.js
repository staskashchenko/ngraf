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
var points=[];//двумерный массив точек
var startTime=new Date();
var timeIterator=0;
//input
//input T
document.forms.inT.onsubmit = function(){
    var message = this.message.value;
    T=message;
    console.log(message);
    return false;
};
//input dt
document.forms.indt.onsubmit = function(){
    var message = this.message.value;
    dt=message;
    console.log(message);
    return false;
};
//input u
document.forms.inu.onsubmit = function(){
    var message = this.message.value;
    u=message;
    console.log(message);
    return false;
};
//input wst
document.forms.inwst.onsubmit = function(){
    var message = this.message.value;
    wst=message;
    console.log(message);
    return false;
};
//WS
//random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max * 100)/100;
}
function WS(){
    points[timeIterator]=[startTime+timeIterator*u,getRandomInt(100)];
    timeIterator++;
    setTimeout(WS,wst);
}
WS();
//draw
function draw(){

}


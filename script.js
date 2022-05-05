var canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//cords
var cordX = canvas.width/1000;
var cordY = canvas.height/1000;
//font size
var fontSize =  cordY*33*cordX/cordY;
if (fontSize>cordY*33){
    fontSize = cordY*33;
}
var ctx = canvas.getContext("2d");

//ctx.lineWidth=5;
//ctx.strokeStyle="red";
//ctx.strokeRect(200,200,200,500);
//ctx.lineWidth=1;
//ctx.strokeStyle="blue";
//ctx.strokeRect(300,300,300,700);

//graf basis
ctx.beginPath();
ctx.moveTo(100*cordX,100*cordY);
ctx.lineWidth=5;
ctx.lineTo(100*cordX,900*cordY);
ctx.lineTo(900*cordX,900*cordY);
ctx.stroke();




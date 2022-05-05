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

var newValue;
var newTime=new Date();
var grafTimes=["0s", "10s", "20s", "30s", "40s", "50s", "60s"];
var grafValues=[0, 59, 75, 20, 20, 55, 40];
var iterations=0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max * 100)/100;
}

function psevdoWS(){
    newValue = getRandomInt(100);
    grafValues[grafValues.length]=newValue;
    //newTime =new Date(newTime.getTime()+getRandomInt(1000));
    newTime=new Date();
    console.log(newTime);    
    grafTimes[grafTimes.length]="[ "+newTime.getHours()+":"+newTime.getMinutes()+":"+newTime.getSeconds()+"."+newTime.getMilliseconds()+" ]";  
    //grafHours 
    //grafMinutes
    //grafSeconds
    //grafMilliseconds
    //сделать вывод столбиком
}

//ctx.lineWidth=5;
//ctx.strokeStyle="red";
//ctx.strokeRect(200,200,200,500);
//ctx.lineWidth=1;
//ctx.strokeStyle="blue";
//ctx.strokeRect(300,300,300,700);

function valToY(value){
    return (850-7.5*value)*cordY;
}

function valToX(Ys,i){
    return (100+i*800/(Ys-1))*cordX;
}

function dynamicDraw(){
    var Ys=grafTimes.length;
    //y lines
    ctx.beginPath();
    ctx.strokeStyle="#C0C0C0";
    ctx.lineWidth=1;
    for(let i=1; i< Ys; i++){
        ctx.moveTo(valToX(Ys,i),860*cordY);
        ctx.lineTo(valToX(Ys,i),100*cordY);
    }
    ctx.stroke();
    //graf lines
    ctx.beginPath();
    ctx.moveTo(valToX(Ys,0),valToY(grafValues[0]));
    ctx.strokeStyle="black";
    ctx.lineWidth=3;
    for(let i=1; i< Ys; i++){
        ctx.lineTo(valToX(Ys,i),valToY(grafValues[i]));
    }
    ctx.stroke();
    //y text
    ctx.fillStyle="black";
    ctx.font=fontSize/2+"px verdana, sans-serif";
    ctx.textAlign="center";
    ctx.beginPath();
    for(let i=0; i< grafTimes.length; i++){
        ctx.fillText(grafTimes[i], valToX(Ys,i),870*cordY+fontSize/4);
    }
    ctx.stroke();
}

function staticDraw(){
    //graf x lines
    ctx.beginPath();
    ctx.strokeStyle="#C0C0C0";
    ctx.lineWidth=1;
    for(let i=0; i< 11; i++){
        ctx.moveTo(95*cordX,(i*75+100)*cordY);
        ctx.lineTo(900*cordX,(i*75+100)*cordY);
    }
    ctx.stroke();
    //y text
    ctx.fillStyle="black";
    ctx.font=fontSize/1.5+"px verdana, sans-serif";
    ctx.textAlign="right";
    for(let i=0; i< 11; i++){
        ctx.fillText((100-10*i)+"", 90*cordX,(i*75+100)*cordY+fontSize/3);
    }
 
}

function basisDraw(){
    //graf basis
    ctx.beginPath();
    ctx.moveTo(100*cordX,100*cordY);
    ctx.strokeStyle="black";
    ctx.lineWidth=5;
    ctx.lineTo(100*cordX,850*cordY);
    ctx.lineTo(900*cordX,850*cordY);
    ctx.stroke();
}

function launcher(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    psevdoWS();
    iterations+=1;
    staticDraw();
    dynamicDraw();
    basisDraw();
    setTimeout(launcher, 250);
}
setTimeout(launcher, 250);





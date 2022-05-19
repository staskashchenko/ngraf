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
var T=5000;  //период между самой левой и самой правой точкой отображается на графе
var dt=20; //время между изменениями периода T
var u=1;  //величина изменения T в миллисекундах каждые dt миллисекунд
var wst=200; //величина промежутка времени между поступлением времени
var Vx;//скорость в 1/1000 долях канваса
var t0=new Date();
t0=t0.getTime();
var t1;
t1=t0+T;//крайние точки графа
//var pointsT=[];//времена
//var pointsV=[];//значения
//var timeIterator=0;
let points = new Array();

class Point {
    constructor(params={}) {
        this.date = params.date || new Date();//времена
        this.value = params.value || 0;//значения
    }
};
//input
//input T
document.querySelector("#inT").addEventListener("change", (e)=>{
    console.log(e.value);
});

document.forms.inT.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        T=Number(message);
        t1=t0+T;
        console.log(message);
    }
    return false;
};
//input dt
document.forms.indt.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        dt=Number(message);
        console.log(message);
    }
    return false;
};
//input u
document.forms.inu.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        u=Number(message);
        console.log(message);
    }
    return false;
};
//input wst
document.forms.inwst.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        wst=Number(message);
        console.log(message);
    }
    return false;
};
//WS
//random int
function getRandomInt(max) {
    return Math.floor(Math.random() * max * 100)/100;
}



function WS(){
    //pointsT[timeIterator]=new Date();
    //pointsV[timeIterator]=getRandomInt(100);

    points.push(new Point({
        date: new Date(),
        value: getRandomInt(100)
    }));

    //timeIterator++;
    //console.log(points.date);
    setTimeout(WS,wst);
}
WS();
//draw
function basisDraw(){
    gctx.beginPath();
    gctx.strokeStyle="black";
    gctx.lineWidth=3;
    gctx.moveTo(0,0);
    gctx.lineTo(0,1000*gcordY);
    gctx.lineTo(1000*gcordX,1000*gcordY);
    gctx.stroke();
}
function xLinesDraw(){
    gctx.beginPath();
    gctx.strokeStyle="#C0C0C0";
    gctx.lineWidth=1;
    for(let i=0;i<10;i++){
        gctx.moveTo(0,i*100*gcordY);
        gctx.lineTo(1000*gcordX,i*100*gcordY);
    }
    gctx.stroke();
}
function yLinesDraw(lt0,lt1){
    var i0=0;
    var i1=0;
    for(let i=0;i<points.length-1;i++){

        let pi = points[i],
            piNext = points[i+1];

        if((lt0>=pi.date)&&(lt0<=piNext.date)){
            i0=i;
        }
        if((lt1>=pi.date)&&(lt1<=piNext.date)){
            i1=i+1;
        }

        /*if((lt0>=pointsT[i])&&(lt0<=pointsT[i+1])){
            i0=i;
        }
        if((lt1>=pointsT[i])&&(lt1<=pointsT[i+1])){
            i1=i+1;
        }*/
    }

    var lx0;
    gctx.beginPath();
    gctx.strokeStyle="#C0C0C0";
    gctx.lineWidth=1;
    for(let i=i0;i<i1;i++){

        lx0=(points[i].date-lt0)*1000*gcordX/(lt1-lt0);

        //lx0=(pointsT[i]-lt0)*1000*gcordX/(lt1-lt0);
        gctx.moveTo(lx0,1000*gcordY);
        gctx.lineTo(lx0,0);
    }
    gctx.stroke();
}

function grafLineDraw(lt0,lt1){
    var i0=0;
    var i1=0;
    for(let i=0;i<points.length-1;i++){
        if((lt0>=points[i].date)&&(lt0<=points[i+1].date)){
            i0=i;
        }
        if((lt1>=points[i].date)&&(lt1<=points[i+1].date)){
            i1=i+1;
        }
    }
    var lx0;
    var lY0;
    var lx1;
    var lY1;
    gctx.beginPath();
    gctx.strokeStyle="black";
    gctx.lineWidth=2;
    gctx.font="15px Verdana";
    for(let i=i0;i<i1;i++){
        lx0=(points[i].date-lt0)*1000*gcordX/(lt1-lt0);
        lY0=(1000-10*points[i].value)*gcordY;
        lx1=(points[i+1].date-lt0)*1000*gcordX/(lt1-lt0);
        lY1=(1000-10*points[i+1].value)*gcordY;
        gctx.strokeText("[ "+points[i].value+" ]",lx0,lY0);
        gctx.moveTo(lx0,lY0);
        gctx.lineTo(lx1,lY1);
    }
    gctx.stroke();
}

//launcher

function grafDraw(){
    gctx.clearRect(0, 0, graf.width, graf.height);
    xLinesDraw();
    yLinesDraw(t0+5000,t1+10000);
    grafLineDraw(t0+5000,t1+10000);
    basisDraw();
    setTimeout(grafDraw,20);
}
grafDraw();

function testdtu(){
    t0=t0+u;
    t1=t1+u;
    setTimeout(testdtu,dt);
}

setTimeout(testdtu,dt);
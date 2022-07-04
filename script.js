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
var pDisIter=0;
var oi0=0;
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
/*document.querySelector("#inT").addEventListener("change", (e)=>{
    console.log(e.value);
});*/

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
/*document.querySelector("#indt").addEventListener("change", (e)=>{
    console.log(e.value);
});*/

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
    points.push(new Point({
        date: new Date(),
        value: getRandomInt(100)
    }));
    setTimeout(WS,wst);
}
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
        }else{
            i1=points.length-1;
        }
    }

    var lx0;
    gctx.beginPath();
    gctx.strokeStyle="#C0C0C0";
    gctx.lineWidth=1;
    for(let i=i0;i<i1;i++){

        lx0=(points[i].date-lt0)*1000*gcordX/(lt1-lt0);
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
        }else{
            i1=points.length-1;
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

function leftGreyDraw(){
    lctx.beginPath();
    gctx.strokeStyle="black";
    gctx.lineWidth=2;
    gctx.font="15px Verdana";
    lctx.fillText(0,905*lcordX,995*lcordY);
    for(let i=1;i<10; i++){
        lctx.fillText(100*i,860*lcordX,(1000-100*i)*lcordY);
    }
    lctx.fillText(1000,850*lcordX,15*lcordY);
    lctx.stroke();    
}

function timeAdapt(milsecs){
    var hh=milsecs.getHours();
    var mm=milsecs.getMinutes();
    var ss=milsecs.getSeconds();
    var ms=milsecs%1000;
    if(String(hh).length==1){
        hh="0"+hh;
    }
    if(String(mm).length==1){
        mm="0"+mm;
    }
    if(String(ss).length==1){
        ss="0"+ss;
    }
    if(String(ms).length==1){
        ms="0"+ms;
    }
    if(String(ms).length==2){
        ms="0"+ms;
    }
    return "["+hh+":"+mm+":"+ss+"."+ms+"]";
}
//x cord calculation
function lxCount(i){
    return (points[i].date-t0)*1000*gcordX/(t1-t0);
}
//delta x between points(I'll need for dynamic text render in bottom block)
function deltaCount(i0,i1){
    console.log(lxCount(i1,t0,t1)-lxCount(i0,t0,t1));
}

function bottomDraw(lt0,lt1){
    var i0=0;
    var i1=0;
    for(let i=0;i<points.length-1;i++){

        let pi = points[i],
            piNext = points[i+1];

        if((lt0>=pi.date)&&(lt0<=piNext.date)){
            oi0=i0;
            i0=i;
            if(i0!=oi0){
                pDisIter++;
            }
        }
        if((lt1>=pi.date)&&(lt1<=piNext.date)){
            i1=i+1;
        }else{
            i1=points.length-1;
        }
    }
    var lx0;
    var oi4txt=0;
    var k=0;
    bctx.beginPath();
    bctx.strokeStyle="black";
    bctx.textAlign="center";
    bctx.lineWidth=2;
    bctx.font="10px Verdana";
    for(let i=i0;i<i1;i++){
        lx0=lxCount(i,lt0,lt1);
        
        //if((lx0-lxCount(oi4txt,lt0,lt1)>=gcordX*1000/(gcordX*1000/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))))&&(i%(1000*gcordX/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1)))==0)){
        if((lx0-lxCount(oi4txt,lt0,lt1)>=1000*gcordX/12.5)&&(this.pDisIter*(lx0-lxCount(oi4txt,lt0,lt1)>=80*gcordX))){
            bctx.fillText(timeAdapt(points[i].date),lx0,60*bcordY);
            oi4txt=i;
            this.pDisIterpDisIter=0;
            k=1;
        }
        //if(lx0-lxCount(oi4txt,lt0,lt1)/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))>=1000/12.5){
        for(let j=i0;j<i1;j++){   
            if(k==1){
                lx0=lxCount(j,lt0,lt1);
                bctx.fillText(timeAdapt(points[j].date),lx0,60*bcordY);
                oi4txt=j;
            }
        }
        k=0;
    }
    bctx.stroke();
}


//launcher

function grafDraw(){
    gctx.clearRect(0, 0, graf.width, graf.height);
    xLinesDraw();
    yLinesDraw(t0,t1);
    grafLineDraw(t0,t1);
    basisDraw();
    bctx.clearRect(0, 0, bottom.width, bottom.height);
    bottomDraw(t0,t1);
    setTimeout(grafDraw,20);
}

function testdtu(){
    t0=t0+u;
    t1=t1+u;
    setTimeout(testdtu,dt);
}

function launcher(){
    leftGreyDraw();
    WS();
    setTimeout(testdtu,dt);
    grafDraw();
}

launcher();
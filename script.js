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
var dt=30; //время между изменениями периода T
var u=30;  //величина изменения T в миллисекундах каждые dt миллисекунд
var wst=200; //величина промежутка времени между поступлением времени
var Vx;//скорость в 1/1000 долях канваса
var t0=new Date();
t0=t0.getTime();
var t1;
t1=t0+T;//крайние точки графа
var dtFrame;//период между отрисовкой кадров 
var pointsT=[];//времена
var pointsV=[];//значения
var glcordX;//корды по x для графа
var startTime=new Date();
var timeIterator=0;
//input
//input T
document.forms.inT.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        T=message;
        console.log(message);
    }
    return false;
};
//input dt
document.forms.indt.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        dt=message;
        console.log(message);
    }
    return false;
};
//input u
document.forms.inu.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        u=message;
        console.log(message);
    }
    return false;
};
//input wst
document.forms.inwst.onsubmit = function(){
    var message = this.message.value;
    if(isNaN(message)==false){
        wst=message;
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
    pointsT[timeIterator]=new Date();
    pointsV[timeIterator]=getRandomInt(100);
    timeIterator++;
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
function yLinesDraw(X){
    gctx.beginPath();
    gctx.strokeStyle="#C0C0C0";
    gctx.lineWidth=1;
    gctx.moveTo(X*gcordX,1000*gcordY);
    gctx.lineTo(X*gcordX,0);
    gctx.stroke();
}
function grafLineDraw(t0,t1){
    glcordX=1000*gcordX/(t1-t0);
    gctx.beginPath();
    gctx.strokeStyle="black";
    gctx.lineWidth=2;
    var i=1;
    var k0=0;
    var k1=0;
    console.log("////////////"+i);
    while(t1>=Number(pointsT[i])){
        //console.log("while");
        if(t0<=Number(pointsT[i])){
            if(k0==0){
                k0=1;
                console.log("k0 "+pointsV[i+1]);
            }
            //console.log("if");
            //console.log((t0-Number(pointsT[i]))*glcordX);
            //console.log((1000-pointsV[i]*10)*gcordY);
            gctx.font="15px Verdana";
            gctx.strokeText("[ "+pointsV[i]+" ]",(Number(pointsT[i])-t0)*glcordX,(1000-pointsV[i]*10)*gcordY);
            gctx.moveTo((Number(pointsT[i])-t0)*glcordX,(1000-pointsV[i]*10)*gcordY);
            gctx.strokeText("[ "+pointsV[i+1]+" ]",(Number(pointsT[i+1])-t0)*glcordX,(1000-pointsV[i+1]*10)*gcordY);
            gctx.lineTo((Number(pointsT[i+1])-t0)*glcordX,(1000-pointsV[i+1]*10)*gcordY);
            gctx.font="15px Verdana";
            gctx.strokeText(i+" - "+i+1,((Number(pointsT[i+1])-t0)*glcordX+(Number(pointsT[i])-t0)*glcordX)/2,((1000-pointsV[i]*10)*gcordY+(1000-pointsV[i+1]*10)*gcordY)/2);
        }
        i++;
    }
    console.log("k1 "+pointsV[i+1]);
    gctx.moveTo((Number(pointsT[i])-t0)*glcordX,(1000-pointsV[i]*10)*gcordY);
    gctx.lineTo((Number(pointsT[i+1])-t0)*glcordX,(1000-pointsV[i+1]*10)*gcordY);
    gctx.stroke();
}

//grafLineDraw((new Date()).getTime(),(new Date()).getTime()+5000);
//setGraf
function setGraf(){
    var i=0;
    
    //point counters
    var r0=i;
    var r1=i;
    //graf basis
    
    while(t1<pointsT[i]){
        r1++;
        i++;
    }
    i=r0;
    //graf values lines
    gctx.beginPath();
    gctx.strokeStyle="#C0C0C0";
    gctx.lineWidth=1;
    gctx.moveTo(0,pointsV[i]*10*gcordY);
    i++;
    for(let j=1;j<=r1-r0;j++){
        gctx.lineTo(0+j*1000*gcordX/(r1-r0),pointsV[i]*10*gcordY);
        i++;
    }
}
//set
function set(){

}
//launcher
function test(){
    gctx.clearRect(0, 0, graf.width, graf.height);
    //console.log(pointsT);
    //console.log(pointsV);
    grafLineDraw(t0,t1);
    basisDraw();
    console.log(pointsT);
    console.log(pointsV);
    /*gctx.beginPath();
    gctx.moveTo((Number(pointsT[0])-t0)*glcordX,(1000-pointsV[0]*10)*gcordY);
    gctx.lineTo((Number(pointsT[1])-t0)*glcordX,(1000-pointsV[1]*10)*gcordY);
    gctx.stroke();*/
    //console.log("done");
    setTimeout(test,1*wst);
}
setTimeout(test,1*wst);
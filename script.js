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
var grafTimes=[];
var grafValues=[];
var iterations=0;
var hh;
var mm;
var ss;
var ms;
var timeLimit=["00","00","15","888"];

function getRandomInt(max) {
    return Math.floor(Math.random() * max * 100)/100;
}

function time2Beutify(arg){
    if((arg+"").length<2){
        return "0"+arg;
    }else{
        return arg;
    }
}

function time4Beutify(arg){
    if((arg+"").length==1){
        return "00"+arg;
    }else if((arg+"").length==2){
        return "0"+arg;
    }else if((arg+"").length==3){
        return +arg;
    }
}

function psevdoWS(){
    newValue = getRandomInt(100);
    grafValues[grafValues.length]=newValue;
    //newTime =new Date(newTime.getTime()+getRandomInt(1000));
    newTime=new Date();
    //console.log(newTime);    
    grafTimes[grafTimes.length]=time2Beutify(newTime.getHours())+":"+time2Beutify(newTime.getMinutes())+":"+time2Beutify(newTime.getSeconds())+"."+time4Beutify(newTime.getMilliseconds());  
    //grafHours 
    //grafMinutes
    //grafSeconds
    //grafMilliseconds
    //сделать вывод столбиком
}

function toMillisec(arg){
    var lhh;
    var lmm;
    var lss;
    var lms;
    var lArr=arg.split(":");
    var lArr2=lArr[2].split(".");
    lArr[2]=lArr2[0];
    lArr[3]=lArr2[1];
    return lArr[3]/1+lArr[2]/1*1000+lArr[1]/1*60000+lArr[0]/1*3600000;
}

function toSep(arg){
    var lhh;
    var lmm;
    var lss;
    var lms;
    var lArr=arg.split(":");
    var lArr2=lArr[2].split(".");
    lArr[2]=lArr2[0];
    lArr[3]=lArr2[1];
    return lArr;
}

function byPeriodLimiter(){
    //console.log(grafTimes);
    //console.log(grafValues);
    var date=new Date();
    var numTimeLim=timeLimit[0]*3600000+timeLimit[1]*60000+timeLimit[2]*1000+timeLimit[3]/1;
    var numTimeSep;
    var numTime;
    var newTimeArr=[];
    var newValueArr=[];
    date=date.getHours()*3600000+date.getMinutes()*60000+date.getSeconds()*1000+date.getMilliseconds();    
    numTimeSep=toSep(grafTimes[0]);
    numTime=numTimeSep[0]*3600000+numTimeSep[1]*60000+numTimeSep[2]*1000+numTimeSep[3]/1;
    //console.log("Разница:"+date-numTime+">"+numTimeLim);
    console.log(date-numTime+">"+numTimeLim);
    if(date-numTime>numTimeLim){
        for(let i=0;i<grafTimes.length-2;i++){
            newTimeArr[i]=grafTimes[i+1];
            newValueArr[i]=grafValues[i+1];
        }
        grafTimes=newTimeArr;
        grafValues=newValueArr;
    }
}

//ctx.lineWidth=5;
//ctx.strokeStyle="red";
//ctx.strokeRect(200,200,200,500);
//ctx.lineWidth=1;
//ctx.strokeStyle="blue";
//ctx.strokeRect(300,300,300,700);

//graf y addapting
function valToY(value){
    return (850-7.5*value)*cordY;
}
//graf x addapting
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
    //iterations+=1;
    staticDraw();
    dynamicDraw();
    basisDraw();
    byPeriodLimiter();
    setTimeout(launcher, 250);
}
setTimeout(launcher, 250);





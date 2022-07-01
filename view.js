import { PlotterModel } from "./PlotterModel.js";
import { points } from "./PlotterModel.js";
class View{
    constructor () {
        this.pDisIter=0;//needs for bottomDraw
        this.oi0=0;//needs for bottomDraw
        //root el init
        this.graph=this.getElement('#root');
        //left canvas init
        this.leftCanvas=this.createElement('leftCanvas');
        //size of main div
        this.grafRootDivWidth=1150;
        this.grafRootDivHeight=700;
        //root element 
        this.app=this.getElement('#root');
        //graf canvas create
        this.graf=this.createElement('canvas','graf');
        //graf canvas local cords
        this.gcordX = this.graf.width/1000;
        this.gcordY = this.graf.height/1000;
        //graf brush init
        this.gctx = this.graf.getContext("2d");
        //left canvas init
        this.left=this.createElement('canvas','left');
        //left canvas local cords
        this.lcordX = this.left.width/1000;
        this.lcordY = this.left.height/1000;
        //left brush init
        this.lctx = this.left.getContext("2d");
        //bottom canvas init
        this.bottom=this.createElement('canvas','bottom');
        //bottom canvas local cords
        this.bcordX = this.bottom.width/1000;
        this.bcordY = this.bottom.height/1000;
        //bottom brush init
        this.bctx = this.bottom.getContext("2d");
        
    }
    //element creation
    createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }
    //element link geting
    getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }
    //init(div and canvases create)
    baseInit(){
        document.getElementById('root').style.width=this.grafRootDivWidth+'px';
        document.getElementById('root').style.height=this.grafRootDivHeight+'px';
        this.graf.id='graf';
        this.gcordX = this.graf.width/1000;
        this.gcordY = this.graf.height/1000;
        this.left.id='left';
        this.lcordX = this.left.width/1000;
        this.lcordY = this.left.height/1000;
        this.bottom.id='bottom';
        this.app.append(this.left,this.graf,this.bottom);
        document.getElementById('graf').style.width=this.grafRootDivWidth/1.15+'px';
        document.getElementById('graf').style.height=this.grafRootDivHeight/1.4+'px';
        document.getElementById('left').style.width=this.grafRootDivWidth/7.67+'px';
        document.getElementById('left').style.height=this.grafRootDivHeight/1.4+'px';
        document.getElementById('bottom').style.width=this.grafRootDivWidth/1.15+'px';
        document.getElementById('bottom').style.height=this.grafRootDivHeight/3.5+'px';
        document.getElementById('bottom').style.marginLeft=this.grafRootDivWidth/7.67+'px';
    }
    //time adapt(transforms date milliseconds format to String visual format)
    timeAdapt(milsecs){
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
    //x cord calculation(needs for x calculation of each point each iteration)
    lxCount(i){
        return (points[i].date-t0)*1000*gcordX/(t1-t0);
    }
    //draw(x and y basis lines draw)
    basisDraw(){
        this.gctx.beginPath();
        this.gctx.strokeStyle="black";
        this.gctx.lineWidth=3;
        this.gctx.moveTo(0,0);
        this.gctx.lineTo(0,1000*this.gcordY);
        this.gctx.lineTo(1000*this.gcordX,1000*this.gcordY);
        this.gctx.stroke();
    }
    //horisontal lines draw
    xLinesDraw(){
        this.gctx.beginPath();
        this.gctx.strokeStyle="#C0C0C0";
        this.gctx.lineWidth=1;
        for(let i=0;i<10;i++){
            this.gctx.moveTo(0,i*100*this.gcordY);
            this.gctx.lineTo(1000*this.gcordX,i*100*this.gcordY);
        }
        this.gctx.stroke();
    }
    //vertical lines draw
    yLinesDraw(lt0,lt1){
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
        this.gctx.beginPath();
        this.gctx.strokeStyle="#C0C0C0";
        this.gctx.lineWidth=1;
        for(let i=i0;i<i1;i++){
    
            lx0=(points[i].date-lt0)*1000*this.gcordX/(lt1-lt0);
            this.gctx.moveTo(lx0,1000*this.gcordY);
            this.gctx.lineTo(lx0,0);
        }
        this.gctx.stroke();
    }
    //graf line draw
    grafLineDraw(lt0,lt1){
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
        this.gctx.beginPath();
        this.gctx.strokeStyle="black";
        this.gctx.lineWidth=2;
        this.gctx.font="15px Verdana";
        for(let i=i0;i<i1;i++){
            lx0=(points[i].date-lt0)*1000*gcordX/(lt1-lt0);
            lY0=(1000-10*points[i].value)*gcordY;
            lx1=(points[i+1].date-lt0)*1000*gcordX/(lt1-lt0);
            lY1=(1000-10*points[i+1].value)*gcordY;
            gctx.strokeText("[ "+points[i].value+" ]",lx0,lY0);
            gctx.moveTo(lx0,lY0);
            gctx.lineTo(lx1,lY1);
        }
        this.gctx.stroke();
    }
    //left draw
    leftGreyDraw(){
        this.lctx.beginPath();
        this.gctx.strokeStyle="black";
        this.gctx.lineWidth=2;
        this.gctx.font="15px Verdana";
        this.lctx.fillText(0,905*this.lcordX,995*this.lcordY);
        for(let i=1;i<10; i++){
            this.lctx.fillText(100*i,860*this.lcordX,(1000-100*i)*this.lcordY);
        }
        this.lctx.fillText(1000,850*this.lcordX,15*this.lcordY);
        this.lctx.stroke();    
    }
    //bottom draw
    bottomDraw(lt0,lt1){
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
        this.bctx.beginPath();
        this.bctx.strokeStyle="black";
        this.bctx.textAlign="center";
        this.bctx.lineWidth=2;
        this.bctx.font="10px Verdana";
        for(let i=i0;i<i1;i++){
            lx0=lxCount(i,lt0,lt1);
            
            //if((lx0-lxCount(oi4txt,lt0,lt1)>=gcordX*1000/(gcordX*1000/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))))&&(i%(1000*gcordX/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1)))==0)){
            if((lx0-lxCount(oi4txt,lt0,lt1)>=1000*gcordX/12.5)&&(pDisIter*(lx0-lxCount(oi4txt,lt0,lt1)>=80*gcordX))){
                this.bctx.fillText(timeAdapt(points[i].date),lx0,60*bcordY);
                oi4txt=i;
                pDisIter=0;
                k=1;
            }
            //if(lx0-lxCount(oi4txt,lt0,lt1)/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))>=1000/12.5){
            for(let j=i0;j<i1;j++){   
                if(k==1){
                    lx0=lxCount(j,lt0,lt1);
                    this.bctx.fillText(timeAdapt(points[j].date),lx0,60*bcordY);
                    oi4txt=j;
                }
            }
            k=0;
        }
        this.bctx.stroke();
    }
    //1 frame draw
    grafDraw(){
        this.gctx.clearRect(0, 0, this.graf.width, this.graf.height);
        this.xLinesDraw();
        this.yLinesDraw(this.t0,this.t1);
        this.grafLineDraw(this.t0,this.t1);
        this.basisDraw();
        this.bctx.clearRect(0, 0, this.bottom.width, this.bottom.height);
        this.bottomDraw(this.t0,this.t1);
        //setTimeout(this.grafDraw.bind(this),20);
        //setTimeout(this.grafDraw.bind(this),20);
        setTimeout(()=>{ this.grafDraw(); }, 20)
    }
    //
    dtuChanger(){
        this.t0=this.t0+this.u;
        this.t1=this.t1+this.u;
        setTimeout(this.dtuChanger,this.dt);
    }
    //graf animation launcher
    launcher(){
        console.log("init launcher");
        this.baseInit();
        this.leftGreyDraw();
        //PlotterModel.WS();
        setTimeout(this.dtuChanger,this.dt);
        this.grafDraw();
    }
}
export { View };
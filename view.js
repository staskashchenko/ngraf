class View{
    constructor () {
        this.pDisIter=0;//needs for bottomDraw
        this.oi0=0;//needs for bottomDraw
        //root el init
        this.graph=this.getElement('#root');
        //left canvas init
        this.leftCanvas=this.createElement('leftCanvas');
        //size of main div
        this.grafRootDivWidth=115;
        this.grafRootDivHeight=70;
        //root element 
        this.app=getElement('#root');
        //graf canvas create
        this.graf=createElement('canvas','graf');
        //graf canvas local cords
        this.gcordX = graf.width/1000;
        this.gcordY = graf.height/1000;
        //graf brush init
        this.gctx = graf.getContext("2d");
        //left canvas init
        this.left=createElement('canvas','left');
        //left canvas local cords
        this.lcordX = left.width/1000;
        this.lcordY = left.height/1000;
        //left brush init
        this.lctx = left.getContext("2d");
        //bottom canvas init
        this.bottom=createElement('canvas','bottom');
        
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
        document.getElementById('root').style.width=grafRootDivWidth+'px';
        document.getElementById('root').style.height=grafRootDivHeight+'px';
        graf.id='graf';
        gcordX = graf.width/1000;
        gcordY = graf.height/1000;
        left.id='left';
        lcordX = left.width/1000;
        lcordY = left.height/1000;
        bottom.id='bottom';
        app.append(left,graf,bottom);
        document.getElementById('graf').style.width=grafRootDivWidth/1.15+'px';
        document.getElementById('graf').style.height=grafRootDivHeight/1.4+'px';
        document.getElementById('left').style.width=grafRootDivWidth/7.67+'px';
        document.getElementById('left').style.height=grafRootDivHeight/1.4+'px';
        document.getElementById('bottom').style.width=grafRootDivWidth/1.15+'px';
        document.getElementById('bottom').style.height=grafRootDivHeight/3.5+'px';
        document.getElementById('bottom').style.marginLeft=grafRootDivWidth/7.67+'px';
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
        gctx.beginPath();
        gctx.strokeStyle="black";
        gctx.lineWidth=3;
        gctx.moveTo(0,0);
        gctx.lineTo(0,1000*gcordY);
        gctx.lineTo(1000*gcordX,1000*gcordY);
        gctx.stroke();
    }
    //horisontal lines draw
    xLinesDraw(){
        gctx.beginPath();
        gctx.strokeStyle="#C0C0C0";
        gctx.lineWidth=1;
        for(let i=0;i<10;i++){
            gctx.moveTo(0,i*100*gcordY);
            gctx.lineTo(1000*gcordX,i*100*gcordY);
        }
        gctx.stroke();
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
    //left draw
    leftGreyDraw(){
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
        bctx.beginPath();
        bctx.strokeStyle="black";
        bctx.textAlign="center";
        bctx.lineWidth=2;
        bctx.font="10px Verdana";
        for(let i=i0;i<i1;i++){
            lx0=lxCount(i,lt0,lt1);
            
            //if((lx0-lxCount(oi4txt,lt0,lt1)>=gcordX*1000/(gcordX*1000/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))))&&(i%(1000*gcordX/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1)))==0)){
            if((lx0-lxCount(oi4txt,lt0,lt1)>=1000*gcordX/12.5)&&(pDisIter*(lx0-lxCount(oi4txt,lt0,lt1)>=80*gcordX))){
                bctx.fillText(timeAdapt(points[i].date),lx0,60*bcordY);
                oi4txt=i;
                pDisIter=0;
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
    //1 frame draw
    grafDraw(){
        gctx.clearRect(0, 0, graf.width, graf.height);
        xLinesDraw();
        yLinesDraw(t0,t1);
        grafLineDraw(t0,t1);
        basisDraw();
        bctx.clearRect(0, 0, bottom.width, bottom.height);
        bottomDraw(t0,t1);
        setTimeout(grafDraw,20);
    }
    //
    dtuChanger(){
        t0=t0+u;
        t1=t1+u;
        setTimeout(dtuChanger,dt);
    }
    //graf animation launcher
    launcher(){
        baseInit();
        leftGreyDraw();
        WS();
        setTimeout(dtuChanger,dt);
        grafDraw();
    }
}
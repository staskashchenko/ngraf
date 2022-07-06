class View {
    constructor(params) {

        this.model = params.model;

        this.gridStep = 1000; //grid step in milliseconds
        this.dtuTimeoutId;//dtuChanger timeout id
        this.dtCheckId;//dtcheck timout id
        this.dtuChangerLever = 1;
        this.pDisIter = 0;//needs for bottomDraw
        this.oi0 = 0;//needs for bottomDraw
        //root el init
        this.graph = this.getElement('#root');
        //left canvas init
        this.leftCanvas = this.createElement('leftCanvas');
        //size of main div
        this.grafRootDivWidth = 1150;
        this.grafRootDivHeight = 700;
        //root element 
        this.app = this.getElement('#root');
        //graf canvas create
        this.graf = this.createElement('canvas', 'graf');
        //graf canvas local cords
        this.gcordX = this.graf.width / 1000;
        this.gcordY = this.graf.height / 1000;
        //graf brush init
        this.gctx = this.graf.getContext("2d");
        //left canvas init
        this.left = this.createElement('canvas', 'left');
        //left canvas local cords
        this.lcordX = this.left.width / 1000;
        this.lcordY = this.left.height / 1000;
        //left brush init
        this.lctx = this.left.getContext("2d");
        //bottom canvas init
        this.bottom = this.createElement('canvas', 'bottom');
        //bottom canvas local cords
        this.bcordX = this.bottom.width / 1000;
        this.bcordY = this.bottom.height / 1000;
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
    baseInit() {
        document.getElementById('root').style.width = this.grafRootDivWidth + 'px';
        document.getElementById('root').style.height = this.grafRootDivHeight + 'px';
        this.graf.id = 'graf';
        this.gcordX = this.graf.width / 300;
        this.gcordY = this.graf.height / 300;
        this.left.id = 'left';
        this.lcordX = this.left.width / 300;
        this.lcordY = this.left.height / 300;
        this.bottom.id = 'bottom';
        this.bcordX = this.bottom.width / 300;
        this.bcordY = this.bottom.height / 300;
        this.app.append(this.left, this.graf, this.bottom);
        document.getElementById('graf').width = this.grafRootDivWidth / 1.15;
        document.getElementById('graf').height = this.grafRootDivHeight / 1.4;

        document.getElementById('left').width = this.grafRootDivWidth / 7.67;
        document.getElementById('left').height = this.grafRootDivHeight / 1.4;
        document.getElementById('bottom').width = this.grafRootDivWidth / 1.15;
        document.getElementById('bottom').height = this.grafRootDivHeight / 3.5;
        document.getElementById('bottom').style.marginLeft = "150px";
        this.bcordY = this.bcordY / 2.5;
    }
    //time adapt(transforms date milliseconds format to String visual format)
    timeAdapt(milsecs) {
        var hh = Math.floor(milsecs / 3600000);
        var mm = Math.floor((milsecs - hh * 3600000) / 60000);
        var ss = Math.floor((milsecs - hh * 3600000 - mm * 60000) / 1000);
        hh = (hh + 3) % 24;
        //var ms = milsecs % 1000;
        if (String(hh).length == 1) {
            hh = "0" + hh;
        }
        if (String(mm).length == 1) {
            mm = "0" + mm;
        }
        if (String(ss).length == 1) {
            ss = "0" + ss;
        }
        /*
        if (String(ms).length == 1) {
            ms = "0" + ms;
        }
        if (String(ms).length == 2) {
            ms = "0" + ms;
        }*/
        //return "[" + hh + ":" + mm + ":" + ss + "." + ms + "]";
        return "[" + hh + ":" + mm + ":" + ss + "]";
    }
    //x cord calculation(needs for x calculation of each point each iteration)
    lxCount(i) {
        return (this.model.points[i].date - this.model.t0) * 1000 * this.gcordX / (this.model.t1 - this.model.t0);
    }
    //draw(x and y basis lines draw)
    basisDraw() {
        this.gctx.beginPath();
        this.gctx.strokeStyle = "black";
        this.gctx.lineWidth = 3;
        this.gctx.moveTo(0, 0);
        this.gctx.lineTo(0, 1000 * this.gcordY);
        this.gctx.lineTo(1000 * this.gcordX, 1000 * this.gcordY);
        this.gctx.stroke();
    }
    //horisontal lines draw
    xLinesDraw() {
        this.gctx.beginPath();
        this.gctx.strokeStyle = "#C0C0C0";
        this.gctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            this.gctx.moveTo(0, i * 100 * this.gcordY);
            this.gctx.lineTo(1000 * this.gcordX, i * 100 * this.gcordY);
        }
        this.gctx.stroke();
    }
    //vertical lines draw
    yGridDraw() {
        this.gctx.beginPath();
        this.gctx.strokeStyle = "#C0C0C0";
        this.gctx.lineWidth = 1;
        this.bctx.beginPath();
        this.bctx.strokeStyle = "black";
        this.bctx.textAlign = "center";
        this.bctx.lineWidth = 1;
        this.bctx.font = "10px Verdana";
        for (let i = 0; i < (this.model.t1 - this.model.t0) / this.gridStep + 2; i++) {
            var gridMilsec = Math.floor(this.model.t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            console.log(gridMilsec);
            var gridX = (gridMilsec - this.model.t0) * 1000 * this.gcordX / (this.model.t1 - this.model.t0);
            this.gctx.moveTo(gridX, 0);
            this.gctx.lineTo(gridX, 1000 * this.gcordY);
            console.log(gridX);
            this.bctx.strokeText(this.timeAdapt(gridMilsec), gridX, 60 * this.bcordY);
            //this.timeAdapt(gridMilsec)
        }
        this.gctx.stroke();
        this.bctx.stroke();
    }
    /*yLinesDraw() {
        var i0 = 0;
        var i1 = 0;
        for (let i = 0; i < this.model.points.length - 1; i++) {

            let pi = this.model.points[i],
                piNext = this.model.points[i + 1];

            if ((this.model.t0 >= pi.date) && (this.model.t0 <= piNext.date)) {
                i0 = i;
            }
            if ((this.model.t1 >= pi.date) && (this.model.t1 <= piNext.date)) {
                i1 = i + 1;
            } else {
                i1 = this.model.points.length - 1;
            }
        }

        var lx0;
        this.gctx.beginPath();
        this.gctx.strokeStyle = "#C0C0C0";
        this.gctx.lineWidth = 1;
        for (let i = i0; i < i1; i++) {

            lx0 = (this.model.points[i].date - this.model.t0) * 1000 * this.gcordX / (this.model.t1 - this.model.t0);
            this.gctx.moveTo(lx0, 1000 * this.gcordY);
            this.gctx.lineTo(lx0, 0);
        }
        this.gctx.stroke();
    }*/
    //graf line draw
    grafLineDraw() {
        var i0 = 0;
        var i1 = 0;
        for (let i = 0; i < this.model.points.length - 1; i++) {
            if ((this.model.t0 >= this.model.points[i].date) && (this.model.t0 <= this.model.points[i + 1].date)) {
                i0 = i;
            }
            if ((this.model.t1 >= this.model.points[i].date) && (this.model.t1 <= this.model.points[i + 1].date)) {
                i1 = i + 1;
            } else {
                i1 = this.model.points.length - 1;
            }
        }
        var lx0;
        var lY0;
        var lx1;
        var lY1;
        this.gctx.beginPath();
        this.gctx.strokeStyle = "black";
        this.gctx.lineWidth = 2;
        this.gctx.font = "15px Verdana";
        for (let i = i0; i < i1; i++) {
            lx0 = (this.model.points[i].date - this.model.t0) * 1000 * this.gcordX / (this.model.t1 - this.model.t0);
            lY0 = (1000 - 10 * this.model.points[i].value) * this.gcordY;
            lx1 = (this.model.points[i + 1].date - this.model.t0) * 1000 * this.gcordX / (this.model.t1 - this.model.t0);
            lY1 = (1000 - 10 * this.model.points[i + 1].value) * this.gcordY;
            this.gctx.strokeText("[ " + this.model.points[i].value + " ]", lx0, lY0);
            this.gctx.moveTo(lx0, lY0);
            this.gctx.lineTo(lx1, lY1);
        }
        this.gctx.stroke();
    }
    //left draw
    leftGreyDraw() {
        this.lctx.beginPath();
        this.lctx.beginPath();
        this.lctx.strokeStyle = "black";
        this.lctx.lineWidth = 2;
        this.lctx.font = "15px Verdana";
        this.lctx.fillText(0, 135 * this.lcordX, 995 * this.lcordY);
        for (let i = 1; i < 10; i++) {
            this.lctx.fillText(100 * i, 129 * this.lcordX, (1000 - 100 * i) * this.lcordY);
        }
        this.lctx.fillText(100, 120.5 * this.lcordX, 23 * this.lcordY);
        this.lctx.stroke();
    }
    //bottom draw
    /*bottomDraw() {
        var i0 = 0;
        var i1 = 0;
        for (let i = 0; i < this.model.points.length - 1; i++) {

            let pi = this.model.points[i],
                piNext = this.model.points[i + 1];

            if ((this.model.t0 >= pi.date) && (this.model.t0 <= piNext.date)) {
                this.oi0 = i0;
                i0 = i;
                if (i0 != this.oi0) {
                    this.pDisIter++;
                }
            }
            if ((this.model.t1 >= pi.date) && (this.model.t1 <= piNext.date)) {
                i1 = i + 1;
            } else {
                i1 = this.model.points.length - 1;
            }
        }
        var lx0;
        var oi4txt = 0;
        var k = 0;
        this.bctx.beginPath();
        this.bctx.strokeStyle = "black";
        this.bctx.textAlign = "center";
        this.bctx.lineWidth = 2;
        this.bctx.font = "10px Verdana";

        for (let i = i0; i < i1; i++) {
            lx0 = this.lxCount(i, this.model.t0, this.model.t1);

            //if((lx0-lxCount(oi4txt,lt0,lt1)>=gcordX*1000/(gcordX*1000/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))))&&(i%(1000*gcordX/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1)))==0)){
            if ((lx0 - this.lxCount(oi4txt, this.model.t0, this.model.t1) >= 1000 * this.bcordX / 12.5) && (this.pDisIter * (lx0 - this.lxCount(oi4txt, this.model.t0, this.model.t1) >= 80 * this.bcordX))) {
                this.bctx.fillText(this.timeAdapt(this.model.points[i].date), lx0, 60 * this.bcordY);
                oi4txt = i;
                this.pDisIter = 0;
                k = 1;
            }
            //if(lx0-lxCount(oi4txt,lt0,lt1)/(lxCount(i+1,lt0,lt1)-lxCount(i,lt0,lt1))>=1000/12.5){
            for (let j = i0; j < i1; j++) {
                if (k == 1) {
                    lx0 = this.lxCount(j, this.model.t0, this.model.t1);
                    this.bctx.fillText(this.timeAdapt(this.model.points[j].date), lx0, 60 * this.bcordY);
                    oi4txt = j;
                }
            }
            k = 0;
        }
        this.bctx.stroke();
    }*/
    //1 frame draw
    grafDraw() {
        this.gctx.clearRect(0, 0, this.graf.width, this.graf.height);
        this.xLinesDraw();
        this.bctx.clearRect(0, 0, this.bottom.width, this.bottom.height);
        this.yGridDraw();
        //this.yLinesDraw();
        this.grafLineDraw();
        this.basisDraw();
        //this.bottomDraw();
        requestAnimationFrame(() => { this.grafDraw(); });
    }
    //dtCheck - check when dt!=0 and launch timeout
    dtCheck() {
        if (this.model.dt != 0) {
            this.dtuTimeoutId = setTimeout(() => { this.dtuChanger(); }, this.model.dt);
        }
        this.dtCheckId = setTimeout(() => { this.dtCheck(); }, 20);
    }
    //changer of t0 and t1 on u every dt milliseconds
    dtuChanger() {
        this.model.t0 = this.model.t0 + this.model.u;
        this.model.t1 = this.model.t1 + this.model.u;
        if (this.model.dt != 0) {
            this.dtuTimeoutId = setTimeout(() => { this.dtuChanger(); }, this.model.dt);
            clearTimeout(this.dtCheckId);
        }
        if (this.model.dt == 0) {
            clearTimeout(this.dtuTimeoutId);
            this.dtCheckId = setTimeout(() => { this.dtCheck(); }, 20);
        }
    }
    //graf animation launcher
    launcher() {
        this.baseInit();
        this.leftGreyDraw();
        this.dtuChanger();
        this.grafDraw();
    }
}
export { View };
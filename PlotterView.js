import { MyTimeout } from './MyTimeout.js';
class PlotterView {
    constructor(params) {

        this.model = params.model;

        this.gridStep = 1000; //grid step in milliseconds
        this.dtuTimeoutId = new MyTimeout({//dtuChanger timeout id
            func: this.dtuChanger,
            delay: this.dt
        });
        this.dtCheckId = new MyTimeout({//dtcheck timout id
            func: this.dtCheck,
            delay: 5
        });

        this.T = 5000;  //период между самой левой и самой правой точкой отображается на графе
        this.dt = 20; //время между изменениями периода T
        this.u = 10;  //величина изменения T в миллисекундах каждые dt миллисекунд
        this.oldu = this.u;//old u
        this.t0 = (new Date()).getTime();
        this.t1 = this.t0 + this.T;//крайние точки графа
        this.animation = true;

        this.dtuChangerLever = 1;
        this.pDisIter = 0;//needs for bottomDraw
        this.oi0 = 0;//needs for bottomDraw
        //root el init
        this.graph = PlotterView.getElement('#root');
        //left canvas init
        this.leftCanvas = PlotterView.createElement('leftCanvas');
        //size of main div
        this.grafRootDivWidth = 1150;
        this.grafRootDivHeight = 700;
        //root element 
        this.app = PlotterView.getElement('#root');
        //graf canvas create
        this.graf = PlotterView.createElement('canvas', 'graf');
        //graf canvas local cords
        this.gcordX = this.graf.width / 1000;
        this.gcordY = this.graf.height / 1000;
        //graf brush init
        this.gctx = this.graf.getContext("2d");
        //left canvas init
        this.left = PlotterView.createElement('canvas', 'left');
        //left canvas local cords
        this.lcordX = this.left.width / 1000;
        this.lcordY = this.left.height / 1000;
        //left brush init
        this.lctx = this.left.getContext("2d");
        //bottom canvas init
        this.bottom = PlotterView.createElement('canvas', 'bottom');
        //bottom canvas local cords
        this.bcordX = this.bottom.width / 1000;
        this.bcordY = this.bottom.height / 1000;
        //bottom brush init
        this.bctx = this.bottom.getContext("2d");

    }

    //element creation
    static createElement(tag, className) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }
    //element link geting
    static getElement(selector) {
        const element = document.querySelector(selector)
        return element
    }
    //right way to set T with recalculation of t0 t1
    setT(newT) {
        this.T = newT;
        this.t1 = this.t0 + this.T;
    }
    //right way to set t0 with recalculation of t1 or T
    sett0(newt0) {
        this.t0 = newt0;
        if (this.t1 > this.t0) {
            this.T = this.t1 - this.t0;
        } else if (this.t1 < this.t0) {
            this.t1 = this.t0 + this.T;
        }
    }
    //right way to set t1 with recalculation of t0 or T
    sett1(newt1) {
        this.t1 = newt1;
        if (this.t1 > this.t0) {
            this.T = this.t1 - this.t0;
        } else if (this.t1 < this.t0) {
            this.t0 = this.t1 - this.T;
        }
    }
    //right way to set t0 and t1 with recalculation T
    sett0t1(newt0, newt1) {
        if (newt0 < newt1) {
            this.t0 = newt0;
            this.t1 = newt1;
            this.T = newt1 - newt0;
        }
    }
    //stop anim
    stopAnim() {
        this.animation = false;
        this.oldu = this.u;
        this.u = 0;
    }
    //start anim
    startAnim() {
        this.animation = true;
        this.u = this.oldu;
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
        if (String(hh).length == 1) {
            hh = "0" + hh;
        }
        if (String(mm).length == 1) {
            mm = "0" + mm;
        }
        if (String(ss).length == 1) {
            ss = "0" + ss;
        }
        return "[" + hh + ":" + mm + ":" + ss + "]";
    }
    //x cord calculation(needs for x calculation of each point each iteration)
    /*lxCount(p) {
        return (this.model.points[i].date - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
    }*/
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
        for (let i = 0; i < (this.t1 - this.t0) / this.gridStep + 2; i++) {
            var gridMilsec = Math.floor(this.t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            var gridX = (gridMilsec - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
            this.gctx.moveTo(gridX, 0);
            this.gctx.lineTo(gridX, 1000 * this.gcordY);
            this.bctx.strokeText(this.timeAdapt(gridMilsec), gridX, 60 * this.bcordY);
        }
        this.gctx.stroke();
        this.bctx.stroke();
    }
    //graf line draw
    grafLineDraw() {
        var i0 = 0;
        var i1 = 0;
        for (let i = 0; i < this.model.points.length - 1; i++) {
            if ((this.t0 >= this.model.points[i].date) && (this.t0 <= this.model.points[i + 1].date)) {
                i0 = i;
            }
            if ((this.t1 >= this.model.points[i].date) && (this.t1 <= this.model.points[i + 1].date)) {
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
            lx0 = (this.model.points[i].date - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
            lY0 = (1000 - 10 * this.model.points[i].value) * this.gcordY;
            lx1 = (this.model.points[i + 1].date - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
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
        if (this.dt != 0) {
            this.dtuTimeoutId = new MyTimeout({
                func: this.dtuChanger.bind(this),
                delay: this.dt
            })
            this.dtuTimeoutId.timeout();
            //this.dtuTimeoutId = setTimeout(() => { this.dtuChanger(); }, this.dt);
        }
        this.dtCheckId = new MyTimeout({
            func: this.dtCheck.bind(this),
            delay: 5
        })
        this.dtCheckId.timeout();
        //this.dtCheckId = setTimeout(() => { this.dtCheck(); }, 20);
    }
    //changer of t0 and t1 on u every dt milliseconds
    dtuChanger() {
        this.t0 = this.t0 + this.u;
        this.t1 = this.t1 + this.u;
        if (this.dt != 0) {
            this.dtuTimeoutId = new MyTimeout({
                func: this.dtuChanger.bind(this),
                delay: this.dt
            })
            this.dtuTimeoutId.timeout();
            //this.dtuTimeoutId = setTimeout(() => { this.dtuChanger(); }, this.dt);
            this.dtCheckId.isActiv = 0;
            //clearTimeout(this.dtCheckId);
        }
        if (this.dt == 0) {
            this.dtuTimeoutId.isActiv = 0;
            //clearTimeout(this.dtuTimeoutId);
            this.dtCheckId = new MyTimeout({
                func: this.dtCheck.bind(this),
                delay: 5
            })
            this.dtCheckId.timeout();
            //this.dtCheckId = setTimeout(() => { this.dtCheck(); }, 20);
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
export { PlotterView };
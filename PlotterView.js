import { MyTimer } from './MyTimer.js'
class PlotterView {
    constructor(params) {

        this.model = params.model;
        this.oPointsLength = this.model.points.length;
        this.baseGridPoint = null;

        this.gridStep = 1000; //grid step in milliseconds
        this.leftPressed = false;
        this.rightPressed = false;

        this.T = 5000;  //period between t0 & t1

        this.olddt = this.dt;//old dt (need 4 key animation)
        this.u = 10;  //delta value of changing t0 and t1 every dt
        this.oldu = this.u;//old u
        this.t0 = (new Date()).getTime(); //left visible border of the grafic
        this.t1 = this.t0 + this.T;//right visible border of the grafic
        this.animation = true;//animation trigger
        this.needFrame = true;//is new frame needed
        this.clasterBorder = 18;//maximum number of points before clasterisation
        this.dt = 5; //period between frames
        this.oldanimation = this.animation;//old animation trigger(need 4 keys control)
        this.scrollSize = 400;//scroll size(how much milliseconds will be zoomed in 1 wheel step)
        this.keyStep = 30;//default key step(how much milliseconds will be scrolled in 1 keyhold step)
        this.grafOver = false; //is mouse over graf canvas
        this.grafMouseX0;//mouse X over graf before
        this.grafMouseX1;//mouse X over graf now
        this.mouseDown = false;//is mouse down
        this.uTimer = new MyTimer({//timer 4 frames animation
            func: this.dtuChanger.bind(this),
            delay: this.dt
        })

        this.graph = PlotterView.getElement('#root');//root el init
        this.leftCanvas = PlotterView.createElement('leftCanvas');//left canvas init

        //size of main div
        this.grafRootDivWidth = 1150;
        this.grafRootDivHeight = 700;

        this.app = PlotterView.getElement('#root');//root element 
        this.graf = PlotterView.createElement('canvas', 'graf');//graf canvas create
        //graf canvas local cords
        this.gcordX = this.graf.width / 1000;
        this.gcordY = this.graf.height / 1000;

        this.gctx = this.graf.getContext("2d");//graf brush init
        this.left = PlotterView.createElement('canvas', 'left');//left canvas init
        //left canvas local cords
        this.lcordX = this.left.width / 1000;
        this.lcordY = this.left.height / 1000;

        this.lctx = this.left.getContext("2d");//left brush init
        this.bottom = PlotterView.createElement('canvas', 'bottom');//bottom canvas init
        //bottom canvas local cords
        this.bcordX = this.bottom.width / 1000;
        this.bcordY = this.bottom.height / 1000;

        this.bctx = this.bottom.getContext("2d");//bottom brush init

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
        this.needFrame = true;
        this.T = newT;
        this.t1 = this.t0 + this.T;
    }
    //right way to set t0 with recalculation of t1 or T
    sett0(newt0) {
        this.needFrame = true;
        this.t0 = newt0;
        if (this.t1 > this.t0) {
            this.T = this.t1 - this.t0;
        } else if (this.t1 < this.t0) {
            this.t1 = this.t0 + this.T;
        }
    }
    //right way to set t1 with recalculation of t0 or T
    sett1(newt1) {
        this.needFrame = true;
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
            this.needFrame = true;
            this.t0 = newt0;
            this.t1 = newt1;
            this.T = newt1 - newt0;
        }
    }
    //stop anim
    stopAnim() {
        this.animation = false;
    }
    //start anim
    startAnim() {
        this.animation = true;
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
        var gridMilsec;
        var gridX;
        for (let i = 0; i < (this.t1 - this.t0) / this.gridStep + 2; i++) {
            gridMilsec = Math.floor(this.t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            gridX = (gridMilsec - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
            this.gctx.moveTo(gridX, 0);
            this.gctx.lineTo(gridX, 1000 * this.gcordY);
        }
        this.gctx.stroke();
        this.bctx.beginPath();
        this.bctx.strokeStyle = "black";
        this.bctx.textAlign = "center";
        this.bctx.lineWidth = 1;
        this.bctx.font = "10px Verdana";
        for (let i = 0; i < (this.t1 - this.t0) / this.gridStep + 2; i++) {
            gridMilsec = Math.floor(this.t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            if (this.baseGridPoint == null) {
                this.baseGridPoint = gridMilsec;
            }
            gridX = (gridMilsec - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
            let skipI = Math.floor((this.t1 - this.t0) / (this.gridStep * this.clasterBorder));
            var gridMilsec = Math.floor(this.t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            var gridX = (gridMilsec - this.t0) * 1000 * this.gcordX / (this.t1 - this.t0);
            if (skipI > 0) {
                if (gridMilsec % ((skipI + 1) * this.gridStep) == this.baseGridPoint % ((skipI + 1) * this.gridStep)) {
                    this.bctx.strokeText(this.timeAdapt(gridMilsec), gridX, 60 * this.bcordY);
                    i += skipI;
                }
            } else {
                this.bctx.strokeText(this.timeAdapt(gridMilsec), gridX, 60 * this.bcordY);
            }


            this.bctx.stroke();
        }
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
    //cleans the frame
    cleanFrame() {
        this.gctx.clearRect(0, 0, this.graf.width, this.graf.height);
        this.bctx.clearRect(0, 0, this.bottom.width, this.bottom.height);
    }
    //checks is there a new point in the model since last frame
    isNewPoint() {
        if (this.model.points.length > 1) {
            if ((this.oPointsLength < this.model.points.length) && (Number(this.model.points[this.model.points.length - 2].date) < this.t1)) {
                this.oPointsLength = this.model.points.length;
                this.needFrame = true;
            }
        }
    }
    //1 frame draw
    frame() {

        this.isNewPoint();
        if (this.needFrame == true) {
            console.log("new frame");
            this.cleanFrame()
            this.xLinesDraw();
            this.yGridDraw();
            //this.yLinesDraw();
            this.grafLineDraw();
            this.basisDraw();
            //this.bottomDraw();
            this.needFrame = false;
        }
        requestAnimationFrame(() => { this.frame(); });
    }
    //changer of t0 and t1 on u every dt milliseconds
    dtuChanger() {
        if ((this.animation == true) && (this.dt > 0)) {
            this.needFrame = true;
            this.t0 = this.t0 + this.u;
            this.t1 = this.t1 + this.u;
            this.uTimer.delay = this.dt;
        } else if (this.dt == 0) {
            this.uTimer.delay = 10;
        }
    }
    //left key press
    leftKeyPress() {
        this.needFrame = true;
        this.t0 = this.t0 - this.u;
        this.t1 = this.t1 - this.u;
    }
    //right key press
    rightKeyPress() {
        this.needFrame = true;
        this.t0 = this.t0 + this.u;
        this.t1 = this.t1 + this.u;
    }
    //keys control
    controlInit() {
        let _this = this;

        document.getElementById("graf").addEventListener('mouseover', function (event) {
            _this.grafOver = true;
        })
        document.getElementById("graf").addEventListener('mouseout', function (event) {
            _this.grafOver = false;
        })

        document.addEventListener('keydown', function (event) {

            if ((event.keyCode == 37) && (_this.leftPressed == false) && (_this.grafOver == true)) {
                this.needFrame = true;
                _this.leftPressed = true;
                _this.oldu = _this.u;
                _this.u = -1 * _this.keyStep;
                _this.oldanimation = _this.animation;
                _this.animation = true;
                _this.olddt = _this.dt;
                _this.dt = 5;
            }
            if ((event.keyCode == 39) && (_this.rightPressed == false) && (_this.grafOver == true)) {
                this.needFrame = true;
                _this.rightPressed = true;
                _this.oldu = _this.u;
                _this.u = _this.keyStep;
                _this.oldanimation = _this.animation;
                _this.animation = true;
                _this.olddt = _this.dt;
                _this.dt = 5;
            }
        });
        document.addEventListener('keyup', function (event) {
            if ((event.keyCode == 37) && (_this.leftPressed == true)) {
                this.needFrame = true;
                _this.leftPressed = false;
                _this.u = _this.oldu;
                _this.animation = _this.oldanimation;
                _this.dt = _this.olddt;
            }
            if ((event.keyCode == 39) && (_this.rightPressed == true)) {
                this.needFrame = true;
                _this.rightPressed = false;
                _this.u = _this.oldu;
                _this.animation = _this.oldanimation;
                _this.dt = _this.olddt;
            }
        });
        document.getElementById("graf").addEventListener('wheel', (event) => {
            event.preventDefault();
            let leftStep = _this.grafMouseX1 / document.getElementById('graf').width * _this.scrollSize;
            let rightStep = (document.getElementById('graf').width - _this.grafMouseX1) / document.getElementById('graf').width * _this.scrollSize;;
            //see more
            if (event.deltaY > 0) {
                this.needFrame = true;
                _this.t0 = _this.t0 - leftStep;
                _this.t1 = _this.t1 + rightStep;
            } else if (event.deltaY < 0) {
                this.needFrame = true;
                _this.t0 = _this.t0 + leftStep;
                _this.t1 = _this.t1 - rightStep;
            }
        });
        document.getElementById("graf").addEventListener('mousemove', (event) => {
            _this.grafMouseX0 = _this.grafMouseX1;
            _this.grafMouseX1 = event.offsetX;
            if (_this.mouseDown == true) {
                this.needFrame = true;
                let deltaOffset = (_this.grafMouseX1 - _this.grafMouseX0) * (_this.t1 - _this.t0) / document.getElementById('graf').width;
                _this.t0 = _this.t0 - deltaOffset;
                _this.t1 = _this.t1 - deltaOffset;
            }


        })
        document.addEventListener('mousedown', (event) => {
            _this.mouseDown = true;
        })
        document.addEventListener('mouseup', (event) => {
            _this.mouseDown = false;
        })
    }

    //graf animation launcher
    launcher() {
        this.baseInit();
        this.leftGreyDraw();
        this.dtuChanger();
        this.uTimer.launch();
        this.frame();
        this.controlInit();
    }
}
export { PlotterView };
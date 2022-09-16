import { MyTimer } from './MyTimer'
import { PlotterModel } from './PlotterModel'
interface IViewParams {
    container: string;
    model: PlotterModel;
    gridStep?: number;
    T?: number;
    u?: number;
    t0?: number;
    t1?: number;
    animation?: boolean;
    clasterBorder?: number;
    dt?: number;
    scrollSize?: number;
    keyStep?: number;
    grafRootDivWidth?: number;
    grafRootDivHeight?: number;
}
class PlotterView {
    public scrollSize: number;
    public keyStep: number;
    public model: PlotterModel;
    public gridStep: number;
    public u: number;
    public animation: boolean;
    public dt: number;

    private _container: HTMLElement;
    private _oPointsLength: number;
    private _baseGridPoint: number | null;
    private _leftPressed: boolean;
    private _rightPressed: boolean;
    private _T: number;
    private _olddt: number;
    private _oldu: number;
    private _t0: number;
    private _t1: number;
    private _needFrame: boolean;
    private _clasterBorder: number;
    private _oldanimation: boolean;
    private _grafOver: boolean;
    private _grafMouseX0: number;
    private _grafMouseX1: number;
    private _mouseDown: boolean;
    private _uTimer: MyTimer;
    private _graph: HTMLElement | null;
    private _grafRootDivWidth: number;
    private _grafRootDivHeight: number;
    private _graf: HTMLCanvasElement;
    private _gcordX: number;
    private _gcordY: number;
    private _gctx: CanvasRenderingContext2D;
    private _left: HTMLCanvasElement;
    private _lcordX: number;
    private _lcordY: number;
    private _lctx: CanvasRenderingContext2D;
    private _bottom: HTMLCanvasElement;
    private _bcordX: number;
    private _bcordY: number;
    private _bctx: CanvasRenderingContext2D;

    constructor(params: IViewParams) {
        // @ts-ignore
        this._container = document.getElementById(params.container);

        this.model = params.model;
        this._oPointsLength = this.model.points.length;
        this._baseGridPoint = null;

        this.gridStep = 1000; //grid step in milliseconds
        this._leftPressed = false;
        this._rightPressed = false;

        this._T = 5000;  //period between t0 & t1

        this.dt = 5; //period between frames
        this._olddt = this.dt;//old dt (need 4 key animation)
        this.u = 10;  //delta value of changing t0 and t1 every dt
        this._oldu = this.u;//old u
        this._t0 = (new Date()).getTime(); //left visible border of the grafic
        this._t1 = this._t0 + this._T;//right visible border of the grafic
        this.animation = true;//animation trigger
        this._needFrame = true;//is new frame needed
        this._clasterBorder = 18;//maximum number of points before clasterisation
        this._oldanimation = this.animation;//old animation trigger(need 4 keys control)
        this.scrollSize = 400;//scroll size(how much milliseconds will be zoomed in 1 wheel step)
        this.keyStep = 30;//default key step(how much milliseconds will be scrolled in 1 keyhold step)
        this._grafOver = false; //is mouse over graf canvas
        this._grafMouseX0 = 0;//mouse X over graf before
        this._grafMouseX1 = 0;//mouse X over graf now
        this._mouseDown = false;//is mouse down
        this._uTimer = new MyTimer({//timer 4 frames animation
            func: this._dtuChanger.bind(this),
            delay: this.dt
        })

        this._graph = this._container;//root el init
        //this.leftCanvas = PlotterView.createElement('leftCanvas');//left canvas init

        //size of main div
        this._grafRootDivWidth = 1150;
        this._grafRootDivHeight = 700;

        // @ts-ignore
        this._graf = PlotterView.createElement('canvas', this._container.id + '_' + 'graf');//graf canvas create
        //graf canvas local cords
        this._gcordX = this._graf.width / 1000;
        this._gcordY = this._graf.height / 1000;

        // @ts-ignore
        this._gctx = this.graf.getContext("2d");//graf brush init
        // @ts-ignore
        this._left = PlotterView.createElement('canvas', this._container.id + '_' + 'left');//left canvas init
        //left canvas local cords
        this._lcordX = this._left.width / 1000;
        this._lcordY = this._left.height / 1000;

        // @ts-ignore
        this._lctx = this.left.getContext("2d");//left brush init
        // @ts-ignore
        this._bottom = PlotterView.createElement('canvas', this._container.id + '_' + 'bottom');//bottom canvas init
        //bottom canvas local cords
        this._bcordX = this._bottom.width / 1000;
        this._bcordY = this._bottom.height / 1000;

        // @ts-ignore
        this._bctx = this.bottom.getContext("2d");//bottom brush init

    }

    //element creation
    static createElement(tag: string, className: string) {
        const element = document.createElement(tag)
        if (className) element.classList.add(className)
        return element
    }

    //element link geting
    static getElement(selector: string) {
        const element = document.getElementById(selector)
        return element
    }

    //right way to set T with recalculation of t0 t1
    public setT(newT: number) {
        this._needFrame = true;
        this._T = newT;
        this._t1 = this._t0 + this._T;
    }

    //right way to set t0 with recalculation of t1 or T
    public sett0(newt0: number) {
        this._needFrame = true;
        this._t0 = newt0;
        if (this._t1 > this._t0) {
            this._T = this._t1 - this._t0;
        } else if (this._t1 < this._t0) {
            this._t1 = this._t0 + this._T;
        }
    }

    //right way to set t1 with recalculation of t0 or T
    public sett1(newt1: number) {
        this._needFrame = true;
        this._t1 = newt1;
        if (this._t1 > this._t0) {
            this._T = this._t1 - this._t0;
        } else if (this._t1 < this._t0) {
            this._t0 = this._t1 - this._T;
        }
    }

    //right way to set t0 and t1 with recalculation T
    public sett0t1(newt0: number, newt1: number) {
        if (newt0 < newt1) {
            this._needFrame = true;
            this._t0 = newt0;
            this._t1 = newt1;
            this._T = newt1 - newt0;
        }
    }

    //stop anim
    public stopAnim() {
        this.animation = false;
    }

    //start anim
    public startAnim() {
        this.animation = true;
    }

    //init(div and canvases create)
    private _baseInit() {
        this._container.style.width = this._grafRootDivWidth + 'px';
        this._container.style.height = this._grafRootDivHeight + 'px';
        this._graf.id = this._container.id + '_' + 'graf';
        this._gcordX = this._graf.width / 300;
        this._gcordY = this._graf.height / 300;
        this._left.id = this._container.id + '_' + 'left';
        this._lcordX = this._left.width / 300;
        this._lcordY = this._left.height / 300;
        this._bottom.id = this._container.id + '_' + 'bottom';
        this._bcordX = this._bottom.width / 300;
        this._bcordY = this._bottom.height / 300;
        this._container.append(this._left, this._graf, this._bottom);
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'graf').width = this.grafRootDivWidth / 1.15;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'graf').height = this.grafRootDivHeight / 1.4;

        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'left').width = this.grafRootDivWidth / 7.67;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'left').height = this.grafRootDivHeight / 1.4;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'bottom').width = this.grafRootDivWidth / 1.15;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'bottom').height = this.grafRootDivHeight / 3.5;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + 'bottom').style.marginLeft = "150px";
        this._bcordY = this._bcordY / 2.5;
    }

    //time adapt(transforms date milliseconds format to String visual format)
    private _timeAdapt(milsecs: number) {
        var hh = String(Math.floor(milsecs / 3600000));
        var mm = String(Math.floor((milsecs - Number(hh) * 3600000) / 60000));
        var ss = String(Math.floor((milsecs - Number(hh) * 3600000 - Number(mm) * 60000) / 1000));
        hh = String((Number(hh) + 3) % 24);
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

    //draw(x and y basis lines draw)
    private _basisDraw() {
        this._gctx.beginPath();
        this._gctx.strokeStyle = "black";
        this._gctx.lineWidth = 3;
        this._gctx.moveTo(0, 0);
        this._gctx.lineTo(0, 1000 * this._gcordY);
        this._gctx.lineTo(1000 * this._gcordX, 1000 * this._gcordY);
        this._gctx.stroke();
    }

    //horisontal lines draw
    private _xLinesDraw() {
        this._gctx.beginPath();
        this._gctx.strokeStyle = "#C0C0C0";
        this._gctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            this._gctx.moveTo(0, i * 100 * this._gcordY);
            this._gctx.lineTo(1000 * this._gcordX, i * 100 * this._gcordY);
        }
        this._gctx.stroke();
    }

    //vertical lines draw
    private _yGridDraw() {
        this._gctx.beginPath();
        this._gctx.strokeStyle = "#C0C0C0";
        this._gctx.lineWidth = 1;
        var gridMilsec;
        var gridX;
        for (let i = 0; i < (this._t1 - this._t0) / this.gridStep + 2; i++) {
            gridMilsec = Math.floor(this._t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            gridX = (gridMilsec - this._t0) * 1000 * this._gcordX / (this._t1 - this._t0);
            this._gctx.moveTo(gridX, 0);
            this._gctx.lineTo(gridX, 1000 * this._gcordY);
        }
        this._gctx.stroke();
        this._bctx.beginPath();
        this._bctx.strokeStyle = "black";
        this._bctx.textAlign = "center";
        this._bctx.lineWidth = 1;
        this._bctx.font = "10px Verdana";
        for (let i = 0; i < (this._t1 - this._t0) / this.gridStep + 2; i++) {
            gridMilsec = Math.floor(this._t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            if (this._baseGridPoint == null) {
                this._baseGridPoint = gridMilsec;
            }
            gridX = (gridMilsec - this._t0) * 1000 * this._gcordX / (this._t1 - this._t0);
            let skipI = Math.floor((this._t1 - this._t0) / (this.gridStep * this._clasterBorder));
            gridMilsec = Math.floor(this._t0 / this.gridStep) * this.gridStep + this.gridStep * i;
            gridX = (gridMilsec - this._t0) * 1000 * this._gcordX / (this._t1 - this._t0);
            if (skipI > 0) {
                if (gridMilsec % ((skipI + 1) * this.gridStep) == this._baseGridPoint % ((skipI + 1) * this.gridStep)) {
                    this._bctx.strokeText(this._timeAdapt(gridMilsec), gridX, 60 * this._bcordY);
                    i += skipI;
                }
            } else {
                this._bctx.strokeText(this._timeAdapt(gridMilsec), gridX, 60 * this._bcordY);
            }


            this._bctx.stroke();
        }
        this._bctx.stroke();
    }

    //graf line draw
    private _grafLineDraw() {
        var i0 = 0;
        var i1 = 0;
        //console.log(this.model.points);
        for (let i = 0; i < this.model.points.length - 1; i++) {
            if ((this._t0 >= Number(this.model.points[i].date)) && (this._t0 <= Number(this.model.points[i + 1].date))) {
                i0 = i;
            }
            if ((this._t1 >= Number(this.model.points[i].date)) && (this._t1 <= Number(this.model.points[i + 1].date))) {
                i1 = i + 1;
            } else {
                i1 = this.model.points.length - 1;
            }
        }
        var lx0;
        var lY0;
        var lx1;
        var lY1;
        this._gctx.beginPath();
        this._gctx.strokeStyle = "black";
        this._gctx.lineWidth = 2;
        this._gctx.font = "15px Verdana";
        for (let i = i0; i < i1; i++) {
            lx0 = (Number(this.model.points[i].date) - this._t0) * 1000 * this._gcordX / (this._t1 - this._t0);
            lY0 = (1000 - 10 * this.model.points[i].value) * this._gcordY;
            lx1 = (Number(this.model.points[i + 1].date) - this._t0) * 1000 * this._gcordX / (this._t1 - this._t0);
            lY1 = (1000 - 10 * this.model.points[i + 1].value) * this._gcordY;
            this._gctx.strokeText("[ " + this.model.points[i].value + " ]", lx0, lY0);
            this._gctx.moveTo(lx0, lY0);
            this._gctx.lineTo(lx1, lY1);
        }
        this._gctx.stroke();
    }

    //left draw
    private _leftGreyDraw() {
        this._lctx.beginPath();
        this._lctx.strokeStyle = "black";
        this._lctx.lineWidth = 2;
        this._lctx.font = "15px Verdana";
        this._lctx.fillText(String(0), 135 * this._lcordX, 995 * this._lcordY);
        for (let i = 1; i < 10; i++) {
            this._lctx.fillText(String(100 * i), 129 * this._lcordX, (1000 - 100 * i) * this._lcordY);
        }
        this._lctx.fillText(String(100), 120.5 * this._lcordX, 23 * this._lcordY);
        this._lctx.stroke();
    }

    //cleans the frame
    private _cleanFrame() {
        this._gctx.clearRect(0, 0, this._graf.width, this._graf.height);
        this._bctx.clearRect(0, 0, this._bottom.width, this._bottom.height);
    }
    //checks is there a new point in the model since last frame
    private _isNewPoint() {
        if (this.model.points.length > 1) {
            if ((this._oPointsLength < this.model.points.length) && (Number(this.model.points[this.model.points.length - 2].date) < this._t1)) {
                this._oPointsLength = this.model.points.length;
                this._needFrame = true;
            }
        }
    }

    //1 frame draw
    public frame() {
        this._isNewPoint();
        if (this._needFrame == true) {
            //console.log("new frame");
            this._cleanFrame()
            this._xLinesDraw();
            this._yGridDraw();
            //this.yLinesDraw();
            this._grafLineDraw();
            this._basisDraw();
            //this.bottomDraw();
            this._needFrame = false;
        }
        requestAnimationFrame(() => { this.frame(); });
    }

    //changer of t0 and t1 on u every dt milliseconds
    private _dtuChanger() {
        if ((this.animation == true) && (this.dt > 0)) {
            this._needFrame = true;
            this._t0 = this._t0 + this.u;
            this._t1 = this._t1 + this.u;
            this._uTimer.delay = this.dt;
        } else if (this.dt == 0) {
            this._uTimer.delay = 10;
        }
    }

    //keys control
    private _controlInit() {
        let _this = this;
        // @ts-ignore
        document.getElementById(this._container.id + '_' + "graf").addEventListener('mouseover', function (event) {
            _this._grafOver = true;
        })
        // @ts-ignore
        document.getElementById(this._container.id + '_' + "graf").addEventListener('mouseout', function (event) {
            _this._grafOver = false;
        })

        document.addEventListener('keydown', function (event) {

            if ((event.keyCode == 37) && (_this._leftPressed == false) && (_this._grafOver == true)) {
                _this._needFrame = true;
                _this._leftPressed = true;
                _this._oldu = _this.u;
                _this.u = -1 * _this.keyStep;
                _this._oldanimation = _this.animation;
                _this.animation = true;
                _this._olddt = _this.dt;
                _this.dt = 5;
            }
            if ((event.keyCode == 39) && (_this._rightPressed == false) && (_this._grafOver == true)) {
                _this._needFrame = true;
                _this._rightPressed = true;
                _this._oldu = _this.u;
                _this.u = _this.keyStep;
                _this._oldanimation = _this.animation;
                _this.animation = true;
                _this._olddt = _this.dt;
                _this.dt = 5;
            }
        });
        document.addEventListener('keyup', function (event) {
            if ((event.keyCode == 37) && (_this._leftPressed == true)) {
                _this._needFrame = true;
                _this._leftPressed = false;
                _this.u = _this._oldu;
                _this.animation = _this._oldanimation;
                _this.dt = _this._olddt;
            }
            if ((event.keyCode == 39) && (_this._rightPressed == true)) {
                _this._needFrame = true;
                _this._rightPressed = false;
                _this.u = _this._oldu;
                _this.animation = _this._oldanimation;
                _this.dt = _this._olddt;
            }
        });
        // @ts-ignore
        document.getElementById(this._container.id + '_' + "graf").addEventListener('wheel', (event) => {
            event.preventDefault();
            // @ts-ignore
            let leftStep = _this.grafMouseX1 / document.getElementById(this._container.id + '_' + 'graf').width * _this.scrollSize;
            // @ts-ignore
            let rightStep = (document.getElementById(this._container.id + '_' + 'graf').width - _this.grafMouseX1) / document.getElementById(this._container.id + '_' + 'graf').width * _this.scrollSize;;
            //see more
            if (event.deltaY > 0) {
                this._needFrame = true;
                _this._t0 = _this._t0 - leftStep;
                _this._t1 = _this._t1 + rightStep;
            } else if (event.deltaY < 0) {
                this._needFrame = true;
                _this._t0 = _this._t0 + leftStep;
                _this._t1 = _this._t1 - rightStep;
            }
        });
        // @ts-ignore
        document.getElementById(this._container.id + '_' + "graf").addEventListener('mousemove', (event) => {
            _this._grafMouseX0 = _this._grafMouseX1;
            _this._grafMouseX1 = event.offsetX;
            if (_this._mouseDown == true) {
                this._needFrame = true;
                // @ts-ignore
                let deltaOffset = (_this.grafMouseX1 - _this.grafMouseX0) * (_this.t1 - _this.t0) / document.getElementById(this._container.id + '_' + 'graf').width;
                _this._t0 = _this._t0 - deltaOffset;
                _this._t1 = _this._t1 - deltaOffset;
            }


        })
        document.addEventListener('mousedown', (event) => {
            _this._mouseDown = true;
        })
        document.addEventListener('mouseup', (event) => {
            _this._mouseDown = false;
        })
    }

    //graf animation launcher
    public launcher() {
        this._baseInit();
        this._leftGreyDraw();
        this._dtuChanger();
        this._uTimer.launch();
        this.frame();
        this._controlInit();
    }
}
export { PlotterView };
import { Point } from './Point.js';

/*ws = new WS();
ws.onreceive = (p) => { console.log(p) };
ws.start()*/

class WS {
    constructor() {
        this._wstTimeoutId;//wst timeout id
        this._wst = 200; //величина промежутка времени между поступлением времени
        this.active = false;
        this.onreceive = null;
    }
    //random int generator for graf testing
    _getRandomInt(max) {
        return Math.floor(Math.random() * max * 100) / 100;
    }
    //generate new point
    _genPoint() {
        return new Point({
            date: new Date(),
            value: this._getRandomInt(100)
        });
    }
    //send point to model
    _dispatchPoi() {
        if (this.onreceive) {
            this.onreceive(this._genPoint());
        }
    }

    get wst() {
        return this._wst;
    }

    set wst(val) {
        this._wst = val;
        this.start();
    }

    //start ws
    start() {
        this.active = true;
        clearInterval(this._wstTimeoutId);
        this._wstTimeoutId = setInterval(() => {
            this._dispatchPoi();
        },
            this.wst
        );
    }
    //stop ws
    stop() {
        this.active = false;
        clearInterval(this._wstTimeoutId);
    }
}

export { WS };

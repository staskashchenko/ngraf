import { Point } from './Point.js';
import { Events } from './Events.js';

class WS {
    constructor() {
        this._wstTimeoutId;//wst timeout id
        this._wst = 200; //websocket period
        this.active = false; //is WS active
        this.events = new Events();
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
        this.events.dispatch("receive", this._genPoint());
    }
    //get websocket period
    get wst() {
        return this._wst;
    }
    //set websocket period
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
        this.events.dispatch("stop", Date.now());
    }
}

export { WS };

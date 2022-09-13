import { MyPoint } from './MyPoint';
import { Events } from './Events';
class WS {
    private _wstTimeoutId: any;
    private _wst: number;
    active: boolean;
    events: Events;
    constructor() {
        this._wstTimeoutId = null;//wst timeout id
        this._wst = 200; //websocket period
        this.active = false; //is WS active
        this.events = new Events();
    }
    //random int generator for graf testing
    private _getRandomInt(max: number): number {
        return Math.floor(Math.random() * max * 100) / 100;
    }
    //generate new point
    private _genPoint(): object {
        return new MyPoint({
            date: new Date(),
            value: this._getRandomInt(100)
        });
    }
    //send point to model
    private _dispatchPoi(): void {
        this.events.dispatch("receive", this._genPoint());
    }
    //get websocket period
    get wst(): number {
        return this._wst;
    }
    //set websocket period
    set wst(val) {
        this._wst = val;
        this.start();
    }
    //start ws
    public start(): void {
        this.active = true;
        clearInterval(this._wstTimeoutId);
        this._wstTimeoutId = setInterval(() => {
            this._dispatchPoi();
        },
            this.wst
        );
    }
    //stop ws
    public stop(): void {
        this.active = false;
        clearInterval(this._wstTimeoutId);
    }
}
export { WS };
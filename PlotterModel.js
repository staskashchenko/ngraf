import { WS } from './WS.js';


class PlotterModel {
    constructor(params = {}) {
        this.points = new Array();
        this.ws = new WS();
        this.ws.onreceive = (p) => { this.points.push(p) };
        //this.ws = params.ws || null;
    }
}

export { PlotterModel };


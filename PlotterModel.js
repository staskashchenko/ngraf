import { WS } from './WS.js';


class PlotterModel {
    constructor(params = {}) {
        this.points = new Array();//model points
        this.ws = new WS();//model websocket
        this.ws.onreceive = (p) => { this.points.push(p) };//add points from websocket
    }
}

export { PlotterModel };


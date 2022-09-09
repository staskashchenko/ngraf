import { WS } from "./WS";

interface IModelParams {
    name?: string,
    points?: Array<object>,
    socket: object
}
class PlotterModel {
    name: string;
    points: Array<object>;
    _socket: WS;
    constructor(params: IModelParams) {
        this.name = params.name || "";
        this.points = params.points || new Array<object>();//model points
        this._socket = params.socket;
        this._socket.events.on("receive", this._onReceive.bind(this))
    }
    _onReceive(poi: object): void {
        this.points.push(poi);
    }
}
export { PlotterModel };
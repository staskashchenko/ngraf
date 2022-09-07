export default class PlotterModel {
    name: string;
    points: Array<object>;
    _socket: object;
    constructor(name: string, points: Array<object>, socket: object) {
        this.name = name || "";
        this.points = points || new Array<object>();//model points
        this._socket = socket;
        this._socket.events.on("receive", this._onReceive.bind(this))
    }
    _onReceive(poi: object): void {
        this.points.push(poi);
    }
}
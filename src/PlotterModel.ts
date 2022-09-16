import { MyPoint } from './MyPoint';
import { WS } from "./WS";

interface IModelParams {
    name?: string,
    points?: Array<MyPoint>,
    socket: WS
}
class PlotterModel {
    public name: string;
    public points: Array<MyPoint>;
    private _socket: WS;

    constructor(params: IModelParams) {
        this.name = params.name || "";
        this.points = params.points || new Array<MyPoint>();//model points
        this._socket = params.socket;
        this._socket.events.on("receive", this._onReceive.bind(this))
    }

    //recieve point and add it to points array
    private _onReceive(poi: MyPoint): void {
        this.points.push(poi);
    }
}
export { PlotterModel };
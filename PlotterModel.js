class PlotterModel {
    constructor(params) {
        this.name = params.name || "";
        this.points = new Array();//model points
        this._socket = params.socket;
        this._socket.events.on("receive", this._onReceive.bind(this));
    }
    _onReceive(poi) {
        this.points.push(poi);
    }
}

export { PlotterModel };


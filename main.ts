import { PlotterModel } from './PlotterModel';
import { PlotterView } from './PlotterView';
import { WS } from './WS';

var ws: object = new WS();//model websocket
ws.start();

const plotterModel1: object = new PlotterModel({
    name: "pl-1",
    socket: ws
});

const plotterModel2: object = new PlotterModel({
    name: "pl-2",
    socket: ws
});

const plotterView1: object = new PlotterView({
    container: 'root1',
    model: plotterModel1
});
plotterView1.launcher();

const plotterView2: object = new PlotterView({
    container: 'root2',
    model: plotterModel2
});
plotterView2.launcher();
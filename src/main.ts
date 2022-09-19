import { PlotterModel } from './PlotterModel';
import { PlotterView } from './PlotterView';
import { WS } from './WS';

var ws: WS = new WS();//model websocket
ws.start();

const plotterModel1: PlotterModel = new PlotterModel({
    name: "pl-1",
    socket: ws
});

const plotterModel2: PlotterModel = new PlotterModel({
    name: "pl-2",
    socket: ws
});

const plotterView1: PlotterView = new PlotterView({
    container: 'root1',
    model: plotterModel1,
    yGridMaxValue: 1000,
    yGridStep: 50,
    yGridMeasure: "I(A)"
    /*
    yGridMaxValue?: number;
    yGridMeasure?: string;
    yGridStep?: number;
    */
});
plotterView1.launcher();

const plotterView2: PlotterView = new PlotterView({
    container: 'root2',
    model: plotterModel2,
    yGridMaxValue: 1000,
    yGridStep: 50,
    yGridMeasure: "I(A)"
});
plotterView2.launcher();
//@ts-ignore
window.xxx = plotterView1;
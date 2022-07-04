import { PlotterModel } from './PlotterModel.js';
import { View } from './View.js';

const plotterModel=new PlotterModel({});
plotterModel.WS();
export { plotterModel };
const view=new View({});
view.launcher();

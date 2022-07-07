import { PlotterModel } from './PlotterModel.js';
import { PlotterView } from './PlotterView.js';
import { MyTimeout } from './MyTimeout.js';

const plotterModel = new PlotterModel({});
plotterModel.startWS();

const plotterView = new PlotterView({
  model: plotterModel
});
plotterView.launcher();

function testTimeout() {
  console.log("t");
}

const mytimeout = new MyTimeout({
  func: testTimeout,
  delay: 3000
})
mytimeout.timeout();
//input
//input T
document.forms.inT.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterModel.T = Number(message);
    plotterModel.t1 = plotterModel.t0 + plotterModel.T;
    console.log(message);
  }
  return false;
};
//input dt
document.forms.indt.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterModel.dt = Number(message);
    console.log(message);
  }
  return false;
};
//input u
document.forms.inu.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterModel.u = Number(message);
    console.log(message);
  }
  return false;
};
//input wst
document.forms.inwst.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterModel.wst = Number(message);
    console.log(message);
  }
  return false;
};
//input gridStep
document.forms.ingridStep.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    view.gridStep = Number(message);
    console.log(message);
  }
  return false;
};
import { PlotterModel } from './PlotterModel.js';
import { PlotterView } from './PlotterView.js';

const plotterModel = new PlotterModel({});
plotterModel.ws.start();


const plotterView = new PlotterView({
  model: plotterModel
});
plotterView.launcher();

//input
//input T
document.forms.inT.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.setT(Number(message));
    console.log(message);
  }
  return false;
};
//input dt
document.forms.indt.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.dt = Number(message);
    console.log(message);
  }
  return false;
};
//input u
document.forms.inu.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.u = Number(message);
    console.log(message);
  }
  return false;
};
//input wst
document.forms.inwst.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterModel.ws.wst = Number(message);
    console.log(message);
  }
  return false;
};
//input gridStep
document.forms.ingridStep.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.gridStep = Number(message);
    console.log(message);
  }
  return false;
};
//input t0
document.forms.int0.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.sett0(Number(message));
    console.log(message);
  }
  return false;
};
//input t1
document.forms.int1.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.sett1(Number(message));
    console.log(message);
  }
  return false;
};

export { plotterModel };
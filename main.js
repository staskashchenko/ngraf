import { PlotterModel } from './PlotterModel.js';
import { PlotterView } from './PlotterView.js';

const plotterModel = new PlotterModel({});
plotterModel.ws.start();


const plotterView = new PlotterView({
  model: plotterModel
});
plotterView.launcher();

//just for demo
document.getElementById("int0").value = plotterView.t0;
document.getElementById("int1").value = plotterView.t1;

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

function inT() {
  if (isNaN(document.getElementById('inT').value) == false) {
    plotterModel.setT(Number(document.getElementById('inT').value));
  }
}

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

    document.getElementById("inT").value = plotterView.T;
    console.log(message);
  }
  return false;
};
//input t1
document.forms.int1.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.sett1(Number(message));

    document.getElementById("inT").value = plotterView.T;
    console.log(message);
  }
  return false;
};
//sett0t1
document.getElementById("sett0t1").onclick = function () {
  var msg0 = document.getElementById("int0").value;
  var msg1 = document.getElementById("int1").value;
  if ((isNaN(msg0) == false) && (isNaN(msg1) == false)) {
    plotterView.sett0t1(Number(msg0), Number(msg1));

    document.getElementById("inT").value = plotterView.T;
    console.log(msg0);
    console.log(msg1);
  }
}
//animSwich
document.getElementById("animSwich").onclick = function () {
  if (plotterView.animation == true) {
    document.getElementById("animSwich").value = "Turn on";
    plotterView.stopAnim();
    console.log("animation=false");
  } else if (plotterView.animation == false) {
    document.getElementById("animSwich").value = "Turn off";
    plotterView.startAnim();
    console.log("animation=true");
  }

}
//wsSwich
document.getElementById("wsSwich").onclick = function () {
  if (plotterModel.ws.active == true) {
    document.getElementById("wsSwich").value = "Turn on";
    plotterModel.ws.stop();
    console.log("ws.active=false");
  } else if (plotterModel.ws.active == false) {
    document.getElementById("wsSwich").value = "Turn off";
    plotterModel.ws.start();
    console.log("ws.active=true");
  }

}
//just 4 test
/*
var testt0 = new Date();
var testt1 = new Date();
document.addEventListener('keydown', function (event) {
  console.log('Key: ', event.key);
  console.log('keyCode: ', event.keyCode);
  testt0 = testt1;
  testt1 = new Date();
  console.log('Brake: ', Number(testt1) - Number(testt0))
});*/
//input t1
//input scroll step
document.forms.inscrollsize.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.scrollSize = Number(message);
  }
  return false;
};
//input key step
document.forms.inkeyStep.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView.keyStep = Number(message);
  }
  return false;
};



export { plotterModel };
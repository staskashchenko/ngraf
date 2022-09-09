import { PlotterModel } from './PlotterModel.js';
import { PlotterView } from './PlotterView.js';
import { WS } from './WS.js';

var ws = new WS();//model websocket
ws.start();

const plotterModel1 = new PlotterModel({
  name: "pl-1",
  socket: ws
});

//ws.register(plotterModel1);

const plotterModel2 = new PlotterModel({
  name: "pl-2",
  socket: ws
});

//ws.register(plotterModel2);

const plotterView1 = new PlotterView({
  container: 'root1',
  model: plotterModel1
});
plotterView1.launcher();

const plotterView2 = new PlotterView({
  container: 'root2',
  model: plotterModel2
});
plotterView2.launcher();
/*
//just for demo
document.getElementById("int0").value = plotterView1.t0;
document.getElementById("int1").value = plotterView1.t1;

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
    plotterModel1.setT(Number(document.getElementById('inT').value));
  }
}

//input dt
document.forms.indt.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.dt = Number(message);
    console.log(message);
  }
  return false;
};
//input u
document.forms.inu.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.u = Number(message);
    console.log(message);
  }
  return false;
};
//input wst
document.forms.inwst.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    ws.wst = Number(message);
    console.log(message);
  }
  return false;
};
//input gridStep
document.forms.ingridStep.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.gridStep = Number(message);
    plotterView1.needFrame = true;
    console.log(message);
  }
  return false;
};
//input t0
document.forms.int0.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.sett0(Number(message));

    document.getElementById("inT").value = plotterView.T;
    console.log(message);
  }
  return false;
};
//input t1
document.forms.int1.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.sett1(Number(message));

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
    plotterView1.sett0t1(Number(msg0), Number(msg1));

    document.getElementById("inT").value = plotterView.T;
    console.log(msg0);
    console.log(msg1);
  }
}
//animSwich
document.getElementById("animSwich").onclick = function () {
  if (plotterView.animation == true) {
    document.getElementById("animSwich").value = "Turn on";
    plotterView1.stopAnim();
    console.log("animation=false");
  } else if (plotterView1.animation == false) {
    document.getElementById("animSwich").value = "Turn off";
    plotterView1.startAnim();
    console.log("animation=true");
  }

}
//wsSwich
document.getElementById("wsSwich").onclick = function () {
  if (ws.active == true) {
    document.getElementById("wsSwich").value = "Turn on";
    ws.stop();
    console.log("ws.active=false");
  } else if (ws.active == false) {
    document.getElementById("wsSwich").value = "Turn off";
    ws.start();
    console.log("ws.active=true");
  }

}
//input scroll step
document.forms.inscrollsize.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.scrollSize = Number(message);
  }
  return false;
};
//input key step
document.forms.inkeyStep.onsubmit = function () {
  var message = this.message.value;
  if (isNaN(message) == false) {
    plotterView1.keyStep = Number(message);
  }
  return false;
};*/

//export { plotterModel };
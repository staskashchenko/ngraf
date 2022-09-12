(()=>{"use strict";class t{constructor(t={}){this.date=t.date||new Date,this.value=t.value||0}}class e{constructor(){this._wstTimeoutId,this._wst=200,this.active=!1,this.onreceive=null}_getRandomInt(t){return Math.floor(Math.random()*t*100)/100}_genPoint(){return new t({date:new Date,value:this._getRandomInt(100)})}_dispatchPoi(){this.onreceive&&this.onreceive(this._genPoint())}get wst(){return this._wst}set wst(t){this._wst=t,this.start()}start(){this.active=!0,clearInterval(this._wstTimeoutId),this._wstTimeoutId=setInterval((()=>{this._dispatchPoi()}),this.wst)}stop(){this.active=!1,clearInterval(this._wstTimeoutId)}}class i{constructor(t){this.func=t.func,this.delay=t.delay,this.launchTime=(new Date).getTime()+this.delay,this.isActiv=!0}_timer(){if(1==this.isActiv){let t=(new Date).getTime();this.launchTime<=t&&0!=this.delay&&(this.func(),this.launchTime=t+this.delay),requestAnimationFrame((()=>{this._timer()}))}}launch(){this._timer()}}class s{constructor(t){this.model=t.model,this.oPointsLength=this.model.points.length,this.baseGridPoint=null,this.gridStep=1e3,this.leftPressed=!1,this.rightPressed=!1,this.T=5e3,this.olddt=this.dt,this.u=10,this.oldu=this.u,this.t0=(new Date).getTime(),this.t1=this.t0+this.T,this.animation=!0,this.needFrame=!0,this.clasterBorder=18,this.dt=5,this.oldanimation=this.animation,this.scrollSize=400,this.keyStep=30,this.grafOver=!1,this.grafMouseX0,this.grafMouseX1,this.mouseDown=!1,this.uTimer=new i({func:this.dtuChanger.bind(this),delay:this.dt}),this.graph=s.getElement("#root"),this.leftCanvas=s.createElement("leftCanvas"),this.grafRootDivWidth=1150,this.grafRootDivHeight=700,this.app=s.getElement("#root"),this.graf=s.createElement("canvas","graf"),this.gcordX=this.graf.width/1e3,this.gcordY=this.graf.height/1e3,this.gctx=this.graf.getContext("2d"),this.left=s.createElement("canvas","left"),this.lcordX=this.left.width/1e3,this.lcordY=this.left.height/1e3,this.lctx=this.left.getContext("2d"),this.bottom=s.createElement("canvas","bottom"),this.bcordX=this.bottom.width/1e3,this.bcordY=this.bottom.height/1e3,this.bctx=this.bottom.getContext("2d")}static createElement(t,e){const i=document.createElement(t);return e&&i.classList.add(e),i}static getElement(t){return document.querySelector(t)}setT(t){this.needFrame=!0,this.T=t,this.t1=this.t0+this.T}sett0(t){this.needFrame=!0,this.t0=t,this.t1>this.t0?this.T=this.t1-this.t0:this.t1<this.t0&&(this.t1=this.t0+this.T)}sett1(t){this.needFrame=!0,this.t1=t,this.t1>this.t0?this.T=this.t1-this.t0:this.t1<this.t0&&(this.t0=this.t1-this.T)}sett0t1(t,e){t<e&&(this.needFrame=!0,this.t0=t,this.t1=e,this.T=e-t)}stopAnim(){this.animation=!1}startAnim(){this.animation=!0}baseInit(){document.getElementById("root").style.width=this.grafRootDivWidth+"px",document.getElementById("root").style.height=this.grafRootDivHeight+"px",this.graf.id="graf",this.gcordX=this.graf.width/300,this.gcordY=this.graf.height/300,this.left.id="left",this.lcordX=this.left.width/300,this.lcordY=this.left.height/300,this.bottom.id="bottom",this.bcordX=this.bottom.width/300,this.bcordY=this.bottom.height/300,this.app.append(this.left,this.graf,this.bottom),document.getElementById("graf").width=this.grafRootDivWidth/1.15,document.getElementById("graf").height=this.grafRootDivHeight/1.4,document.getElementById("left").width=this.grafRootDivWidth/7.67,document.getElementById("left").height=this.grafRootDivHeight/1.4,document.getElementById("bottom").width=this.grafRootDivWidth/1.15,document.getElementById("bottom").height=this.grafRootDivHeight/3.5,document.getElementById("bottom").style.marginLeft="150px",this.bcordY=this.bcordY/2.5}timeAdapt(t){var e=Math.floor(t/36e5),i=Math.floor((t-36e5*e)/6e4),s=Math.floor((t-36e5*e-6e4*i)/1e3);return e=(e+3)%24,1==String(e).length&&(e="0"+e),1==String(i).length&&(i="0"+i),1==String(s).length&&(s="0"+s),"["+e+":"+i+":"+s+"]"}basisDraw(){this.gctx.beginPath(),this.gctx.strokeStyle="black",this.gctx.lineWidth=3,this.gctx.moveTo(0,0),this.gctx.lineTo(0,1e3*this.gcordY),this.gctx.lineTo(1e3*this.gcordX,1e3*this.gcordY),this.gctx.stroke()}xLinesDraw(){this.gctx.beginPath(),this.gctx.strokeStyle="#C0C0C0",this.gctx.lineWidth=1;for(let t=0;t<10;t++)this.gctx.moveTo(0,100*t*this.gcordY),this.gctx.lineTo(1e3*this.gcordX,100*t*this.gcordY);this.gctx.stroke()}yGridDraw(){this.gctx.beginPath(),this.gctx.strokeStyle="#C0C0C0",this.gctx.lineWidth=1;for(let i=0;i<(this.t1-this.t0)/this.gridStep+2;i++)e=1e3*((t=Math.floor(this.t0/this.gridStep)*this.gridStep+this.gridStep*i)-this.t0)*this.gcordX/(this.t1-this.t0),this.gctx.moveTo(e,0),this.gctx.lineTo(e,1e3*this.gcordY);this.gctx.stroke(),this.bctx.beginPath(),this.bctx.strokeStyle="black",this.bctx.textAlign="center",this.bctx.lineWidth=1,this.bctx.font="10px Verdana";for(let i=0;i<(this.t1-this.t0)/this.gridStep+2;i++){t=Math.floor(this.t0/this.gridStep)*this.gridStep+this.gridStep*i,null==this.baseGridPoint&&(this.baseGridPoint=t),e=1e3*(t-this.t0)*this.gcordX/(this.t1-this.t0);let s=Math.floor((this.t1-this.t0)/(this.gridStep*this.clasterBorder));var t,e=1e3*((t=Math.floor(this.t0/this.gridStep)*this.gridStep+this.gridStep*i)-this.t0)*this.gcordX/(this.t1-this.t0);s>0?t%((s+1)*this.gridStep)==this.baseGridPoint%((s+1)*this.gridStep)&&(this.bctx.strokeText(this.timeAdapt(t),e,60*this.bcordY),i+=s):this.bctx.strokeText(this.timeAdapt(t),e,60*this.bcordY),this.bctx.stroke()}this.bctx.stroke()}grafLineDraw(){var t,e,i,s,h=0,o=0;for(let t=0;t<this.model.points.length-1;t++)this.t0>=this.model.points[t].date&&this.t0<=this.model.points[t+1].date&&(h=t),o=this.t1>=this.model.points[t].date&&this.t1<=this.model.points[t+1].date?t+1:this.model.points.length-1;this.gctx.beginPath(),this.gctx.strokeStyle="black",this.gctx.lineWidth=2,this.gctx.font="15px Verdana";for(let n=h;n<o;n++)t=1e3*(this.model.points[n].date-this.t0)*this.gcordX/(this.t1-this.t0),e=(1e3-10*this.model.points[n].value)*this.gcordY,i=1e3*(this.model.points[n+1].date-this.t0)*this.gcordX/(this.t1-this.t0),s=(1e3-10*this.model.points[n+1].value)*this.gcordY,this.gctx.strokeText("[ "+this.model.points[n].value+" ]",t,e),this.gctx.moveTo(t,e),this.gctx.lineTo(i,s);this.gctx.stroke()}leftGreyDraw(){this.lctx.beginPath(),this.lctx.strokeStyle="black",this.lctx.lineWidth=2,this.lctx.font="15px Verdana",this.lctx.fillText(0,135*this.lcordX,995*this.lcordY);for(let t=1;t<10;t++)this.lctx.fillText(100*t,129*this.lcordX,(1e3-100*t)*this.lcordY);this.lctx.fillText(100,120.5*this.lcordX,23*this.lcordY),this.lctx.stroke()}cleanFrame(){this.gctx.clearRect(0,0,this.graf.width,this.graf.height),this.bctx.clearRect(0,0,this.bottom.width,this.bottom.height)}isNewPoint(){this.model.points.length>1&&this.oPointsLength<this.model.points.length&&Number(this.model.points[this.model.points.length-2].date)<this.t1&&(this.oPointsLength=this.model.points.length,this.needFrame=!0)}frame(){this.isNewPoint(),1==this.needFrame&&(console.log("new frame"),this.cleanFrame(),this.xLinesDraw(),this.yGridDraw(),this.grafLineDraw(),this.basisDraw(),this.needFrame=!1),requestAnimationFrame((()=>{this.frame()}))}dtuChanger(){1==this.animation&&this.dt>0?(this.needFrame=!0,this.t0=this.t0+this.u,this.t1=this.t1+this.u,this.uTimer.delay=this.dt):0==this.dt&&(this.uTimer.delay=10)}leftKeyPress(){this.needFrame=!0,this.t0=this.t0-this.u,this.t1=this.t1-this.u}rightKeyPress(){this.needFrame=!0,this.t0=this.t0+this.u,this.t1=this.t1+this.u}controlInit(){let t=this;document.getElementById("graf").addEventListener("mouseover",(function(e){t.grafOver=!0})),document.getElementById("graf").addEventListener("mouseout",(function(e){t.grafOver=!1})),document.addEventListener("keydown",(function(e){37==e.keyCode&&0==t.leftPressed&&1==t.grafOver&&(this.needFrame=!0,t.leftPressed=!0,t.oldu=t.u,t.u=-1*t.keyStep,t.oldanimation=t.animation,t.animation=!0,t.olddt=t.dt,t.dt=5),39==e.keyCode&&0==t.rightPressed&&1==t.grafOver&&(this.needFrame=!0,t.rightPressed=!0,t.oldu=t.u,t.u=t.keyStep,t.oldanimation=t.animation,t.animation=!0,t.olddt=t.dt,t.dt=5)})),document.addEventListener("keyup",(function(e){37==e.keyCode&&1==t.leftPressed&&(this.needFrame=!0,t.leftPressed=!1,t.u=t.oldu,t.animation=t.oldanimation,t.dt=t.olddt),39==e.keyCode&&1==t.rightPressed&&(this.needFrame=!0,t.rightPressed=!1,t.u=t.oldu,t.animation=t.oldanimation,t.dt=t.olddt)})),document.getElementById("graf").addEventListener("wheel",(e=>{e.preventDefault();let i=t.grafMouseX1/document.getElementById("graf").width*t.scrollSize,s=(document.getElementById("graf").width-t.grafMouseX1)/document.getElementById("graf").width*t.scrollSize;e.deltaY>0?(this.needFrame=!0,t.t0=t.t0-i,t.t1=t.t1+s):e.deltaY<0&&(this.needFrame=!0,t.t0=t.t0+i,t.t1=t.t1-s)})),document.getElementById("graf").addEventListener("mousemove",(e=>{if(t.grafMouseX0=t.grafMouseX1,t.grafMouseX1=e.offsetX,1==t.mouseDown){this.needFrame=!0;let e=(t.grafMouseX1-t.grafMouseX0)*(t.t1-t.t0)/document.getElementById("graf").width;t.t0=t.t0-e,t.t1=t.t1-e}})),document.addEventListener("mousedown",(e=>{t.mouseDown=!0})),document.addEventListener("mouseup",(e=>{t.mouseDown=!1}))}launcher(){this.baseInit(),this.leftGreyDraw(),this.dtuChanger(),this.uTimer.launch(),this.frame(),this.controlInit()}}const h=new class{constructor(t={}){this.points=new Array,this.ws=new e,this.ws.onreceive=t=>{this.points.push(t)}}}({});h.ws.start();const o=new s({model:h});o.launcher(),document.getElementById("int0").value=o.t0,document.getElementById("int1").value=o.t1,document.forms.inT.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.setT(Number(t)),console.log(t)),!1},document.forms.indt.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.dt=Number(t),console.log(t)),!1},document.forms.inu.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.u=Number(t),console.log(t)),!1},document.forms.inwst.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(h.ws.wst=Number(t),console.log(t)),!1},document.forms.ingridStep.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.gridStep=Number(t),o.needFrame=!0,console.log(t)),!1},document.forms.int0.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.sett0(Number(t)),document.getElementById("inT").value=o.T,console.log(t)),!1},document.forms.int1.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.sett1(Number(t)),document.getElementById("inT").value=o.T,console.log(t)),!1},document.getElementById("sett0t1").onclick=function(){var t=document.getElementById("int0").value,e=document.getElementById("int1").value;0==isNaN(t)&&0==isNaN(e)&&(o.sett0t1(Number(t),Number(e)),document.getElementById("inT").value=o.T,console.log(t),console.log(e))},document.getElementById("animSwich").onclick=function(){1==o.animation?(document.getElementById("animSwich").value="Turn on",o.stopAnim(),console.log("animation=false")):0==o.animation&&(document.getElementById("animSwich").value="Turn off",o.startAnim(),console.log("animation=true"))},document.getElementById("wsSwich").onclick=function(){1==h.ws.active?(document.getElementById("wsSwich").value="Turn on",h.ws.stop(),console.log("ws.active=false")):0==h.ws.active&&(document.getElementById("wsSwich").value="Turn off",h.ws.start(),console.log("ws.active=true"))},document.forms.inscrollsize.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.scrollSize=Number(t)),!1},document.forms.inkeyStep.onsubmit=function(){var t=this.message.value;return 0==isNaN(t)&&(o.keyStep=Number(t)),!1}})();
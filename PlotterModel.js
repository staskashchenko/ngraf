/*function test(){
    
    alert("2");
}
export { test };*/
class Point {
    constructor(params = {}) {
        this.date = params.date || new Date();//времена
        this.value = params.value || 0;//значения
    }
};
class PlotterModel {
    constructor(params = {}) {
        this.wstTimeoutId;//wst timeout id
        this.wstCheckId;//wst check timeout id
        this.pointDate = params.date || new Date();//времена
        this.pointValue = params.value || 0;//значения
        this.T = 5000;  //период между самой левой и самой правой точкой отображается на графе
        this.dt = 20; //время между изменениями периода T
        this.u = 10;  //величина изменения T в миллисекундах каждые dt миллисекунд
        this.wst = 200; //величина промежутка времени между поступлением времени
        this.t0 = (new Date()).getTime();
        this.t1 = this.t0 + this.T;//крайние точки графа
        this.points = new Array();
    }
    //random int generator for graf testing
    getRandomInt(max) {
        return Math.floor(Math.random() * max * 100) / 100;
    }
    //

    //
    //startWSCheck - check when wst!=0 and launch timeout
    startWsCheck() {
        if (this.wst != 0) {
            this.wstTimeoutId = setTimeout(() => { this.startWS(); }, this.wst);
            clearTimeout(this.wstCheckId);
        }
        this.wstCheckId = setTimeout(() => { this.startWsCheck(); }, this.wst);
    }
    //fake ws
    startWS() {
        this.points.push(new Point({
            date: new Date(),
            value: this.getRandomInt(100)
        }));
        if (this.wst != 0) {
            this.wstTimeoutId = setTimeout(() => { this.startWS(); }, this.wst);
            clearTimeout(this.wstCheckId);
        }
        if (this.wst == 0) {
            clearTimeout(this.wstTimeoutId);
            this.wstCheckId = setTimeout(() => { this.startWsCheck(); }, this.wst);
        }
    }
}
export { PlotterModel };
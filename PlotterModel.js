/*function test(){
    console.log("include");
    alert("2");
}
export { test };*/
class Point {
    constructor(params={}) {
        this.date = params.date || new Date();//времена
        this.value = params.value || 0;//значения
    }
};
class PlotterModel {
    constructor(params={}) {
        this.pointDate = params.date || new Date();//времена
        this.pointValue = params.value || 0;//значения
        this.T=5000;  //период между самой левой и самой правой точкой отображается на графе
        this.dt=20; //время между изменениями периода T
        this.u=1;  //величина изменения T в миллисекундах каждые dt миллисекунд
        this.wst=200; //величина промежутка времени между поступлением времени
        this.Vx;//скорость в 1/1000 долях канваса
        this.t0=(new Date()).getTime();
        this.t1=this.t0+this.T;//крайние точки графа
        this.points = new Array();
    }
    //random int generator for graf testing
    getRandomInt(max) {
        return Math.floor(Math.random() * max * 100)/100;
    }
    //fake ws
    WS(){
        //console.log(this.points);
        this.points.push(new Point({
            date: new Date(),
            value: this.getRandomInt(100)
        }));
        setTimeout(()=>{this.WS()},this.wst);
    }
}
export { PlotterModel };
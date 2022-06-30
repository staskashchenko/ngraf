class Model {
    constructor(params={}) {
        this.pointDate = params.date || new Date();//времена
        this.pointValue = params.value || 0;//значения
        this.T=5000;  //период между самой левой и самой правой точкой отображается на графе
        this.dt=20; //время между изменениями периода T
        this.u=1;  //величина изменения T в миллисекундах каждые dt миллисекунд
        this.wst=200; //величина промежутка времени между поступлением времени
        this.Vx;//скорость в 1/1000 долях канваса
        this.t0=(new Date()).getTime();
        this.t1=t0+T;//крайние точки графа
    }
    //random int generator for graf testing
    getRandomInt(max) {
        return Math.floor(Math.random() * max * 100)/100;
    }
    //fake ws
    WS(){
        points.push(new Point({
            date: new Date(),
            value: getRandomInt(100)
        }));
        setTimeout(WS,wst);
    }
}

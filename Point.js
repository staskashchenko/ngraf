class Point {
    constructor(params = {}) {
        this.date = params.date || new Date();//времена
        this.value = params.value || 0;//значения
    }
};

export { Point };
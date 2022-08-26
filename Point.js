class Point {
    constructor(params = {}) {
        this.date = params.date || new Date();//times
        this.value = params.value || 0;//values
    }
};

export { Point };
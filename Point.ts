interface IPointParams {
    date?: Date,
    value?: number
}
class Point {
    date: Date;
    value: number;
    constructor(params: IPointParams) {
        this.date = params.date || new Date();//times
        this.value = params.value || 0;//values
    }
}
export { Point };
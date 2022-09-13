interface IMyPointParams {
    date?: Date,
    value?: number
}
class MyPoint {
    date: Date;
    value: number;
    constructor(params: IMyPointParams) {
        this.date = params.date || new Date();//times
        this.value = params.value || 0;//values
    }
}
export { MyPoint };
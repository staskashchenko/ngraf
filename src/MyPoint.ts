interface IMyPointParams {
    date?: Date,
    value?: number
}
class MyPoint {
    public date: Date;
    public value: number;
    constructor(params: IMyPointParams) {
        this.date = params.date || new Date();//times
        this.value = params.value || 0;//values
    }
}
export { MyPoint };
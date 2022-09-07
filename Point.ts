export default class Point {
    date: Date;
    value: number;
    constructor(date: Date, value: number) {
        this.date = date || new Date();//times
        this.value = value || 0;//values
    }
}
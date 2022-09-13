class Events {
    private subEvents: Map<string, Array<Function>>;
    constructor() {
        this.subEvents = new Map<string, Array<Function>>();
    }
    public dispatch(eventType: string, eventResult: any): void {

        let functions: Array<Function> = this.subEvents.get(eventType) || [];
        for (let i: number = 0; i < functions.length; i++) {
            functions[i](eventResult);
        }
    }
    public on(eventType: string, eventFunc: Function): void {
        if (this.subEvents.has(eventType) == false) {
            this.subEvents.set(eventType, [eventFunc]);
        } else {
            let functions: Array<Function> = this.subEvents.get(eventType) || [];
            functions.push(eventFunc);
            this.subEvents.set(eventType, functions);
        }
    }
}
export { Events };
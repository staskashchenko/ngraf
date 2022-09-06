class Events {
    constructor() {
        this.subEvents = new Map();
    }
    dispatch(eventType, eventResult) {
        var functions = this.subEvents.get(eventType);
        for (let i = 0; i < functions.length; i++) {
            functions[i](eventResult);
        }
    }
    on(eventType, eventFunc) {
        if (this.subEvents.has(eventType) == false) {
            this.subEvents.set(eventType, [eventFunc]);
        } else {
            var functions = this.subEvents.get(eventType);
            functions.push(eventFunc);
            this.subEvents.set(eventType, functions);
        }

    }
}
export { Events };
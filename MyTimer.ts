export default class MyTimer {
    func: Function;
    delay: number;
    launchTime: number;
    isActiv: boolean;
    constructor(func: Function, delay: number) {
        this.func = func;//function
        this.delay = delay || 0;//delay
        this.launchTime = (new Date()).getTime() + this.delay;//function launch time
        this.isActiv = true;//is timer activ
    }
    _timer(): void {
        if (this.isActiv == true) {
            let now: number = (new Date()).getTime();
            if (this.launchTime <= now && (this.delay != 0)) {
                this.func();
                this.launchTime = now + this.delay;
            }
            requestAnimationFrame(() => {
                this._timer()
            });
        }
    }
    launch(): void {
        this._timer();
    }
}
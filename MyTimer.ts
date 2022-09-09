interface IMyTimerParams {
    func: Function,
    delay?: number
}
class MyTimer {
    func: Function;
    delay: number;
    launchTime: number;
    isActiv: boolean;
    constructor(params: IMyTimerParams) {
        this.func = params.func;//function
        this.delay = params.delay || 1;//delay
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
export { MyTimer };
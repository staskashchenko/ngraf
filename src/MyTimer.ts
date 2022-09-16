interface IMyTimerParams {
    func: Function,
    delay?: number
}
class MyTimer {
    public func: Function;
    public delay: number;
    public isActiv: boolean;

    private _launchTime: number;

    constructor(params: IMyTimerParams) {
        this.func = params.func;//function
        this.delay = params.delay || 1;//delay
        this._launchTime = (new Date()).getTime() + this.delay;//function launch time
        this.isActiv = true;//is timer activ
    }

    //timer
    private _timer(): void {
        if (this.isActiv == true) {
            let now: number = (new Date()).getTime();
            if (this._launchTime <= now && (this.delay != 0)) {
                this.func();
                this._launchTime = now + this.delay;
            }
            requestAnimationFrame(() => {
                this._timer()
            });
        }
    }

    //launch timer
    public launch(): void {
        this._timer();
    }
}
export { MyTimer };
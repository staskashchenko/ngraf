class MyTimer {
    constructor(params) {
        this.func = params.func;//function
        this.delay = params.delay;//delay 
        this.launchTime = (new Date()).getTime() + this.delay;//function launch time
        this.isActiv = true;
    }

    _timer() {
        if (this.isActiv == true) {
            let now = (new Date()).getTime();
            if (this.launchTime <= now && (this.delay != 0)) {
                this.func();

                this.launchTime = now + this.delay;
            }
            requestAnimationFrame(() => {
                this._timer()
            });
        }
    }

    launch() {
        this._timer();
    }
}
export { MyTimer }
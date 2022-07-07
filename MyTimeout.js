class MyTimeout {
    constructor(params) {
        this.func = params.func;//function
        this.delay = params.delay;//delay 
        this.launchTime = (new Date()).getTime() + this.delay;//function launch time
        this.isActiv = 1;//is timeout activ
    }
    timeout() {
        if (this.isActiv == 1) {
            if ((this.launchTime <= (new Date()).getTime()) && (this.delay != 0)) {
                this.func();
                this.isActiv = 0;
            }
            requestAnimationFrame(() => { this.timeout() });
        }
    }
}
export { MyTimeout }
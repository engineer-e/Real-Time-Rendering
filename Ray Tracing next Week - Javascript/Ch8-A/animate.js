class Animate{
    constructor({canvas,$2}){
        this.canvas = canvas
        this.$2 = $2
    }

    add_draw(draw){
     this.draw = draw
    }

    add_animate(anim){
        this.anim = anim
    }

    load(){
        this.$2.clearRect(0,0,this.canvas.width,this.canvas.height)
        this.draw()
        this.anim()
    }



 run(callback) {
  function loop(time) {
    callback(time);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}


createRunner(callback) {
    let frameId = null;
    let running = false;

    const loop = (time) => {
        if (!running) return;

        callback(time);
        frameId = requestAnimationFrame(loop);
    };

    return {
        get running() {
            return running;
        },

        play() {
            if (running) return;
            running = true;
            frameId = requestAnimationFrame(loop);
        },

        pause() {
            if (!running) return;
            running = false;
            cancelAnimationFrame(frameId);
        },

        stop() {
            running = false;
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    };
}

    

}

window.Animate = Animate
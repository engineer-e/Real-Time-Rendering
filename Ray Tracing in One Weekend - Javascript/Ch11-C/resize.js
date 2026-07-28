class Resize{
    constructor({canvas,$2}){

        this.canvas = canvas
        this.$2 = $2
    
    }

    load(draw){
     this.draw = draw
    }

    resize(){
     this.canvas.width = window.innerWidth;
     this.canvas.height = window.innerHeight;
     this.draw()
    }
}

window.Resize = Resize
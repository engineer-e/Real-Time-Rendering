class Viewport {

    constructor(canvas, ctx) {

        this.canvas = canvas;
        this.ctx = ctx;

        this.zoom = 1;

        this.offsetX = 0;
        this.offsetY = 0;

        this.gridSize = 10;

        this.drag = false;
        this.lastX = 0;
        this.lastY = 0;


        this.initEvents();
    }


    initEvents(){

        this.canvas.addEventListener(
            "wheel",
            (e)=>{

                e.preventDefault();

                const scale = e.deltaY < 0 ? 1.1 : 0.9;

                this.zoom *= scale;


                if(this.zoom < 0.1)
                    this.zoom = 0.1;

                if(this.zoom > 20)
                    this.zoom = 20;


            },
            {passive:false}
        );


        this.canvas.addEventListener(
            "mousedown",
            e=>{

                this.drag=true;

                this.lastX=e.clientX;
                this.lastY=e.clientY;

            }
        );


        window.addEventListener(
            "mouseup",
            ()=>this.drag=false
        );


        window.addEventListener(
            "mousemove",
            e=>{

                //console.log(this.drag)

                if(!this.drag)
                    return;


                this.offsetX += 
                    e.clientX-this.lastX;

                this.offsetY += 
                    e.clientY-this.lastY;


                this.lastX=e.clientX;
                this.lastY=e.clientY;

            }
        );
    }



    apply(update){

        this.ctx.setTransform(
            this.zoom,
            0,
            0,
            this.zoom,
            this.offsetX,
            this.offsetY
        );

        
   
        update()
    }



    reset(){

        this.zoom=1;
        this.offsetX=0;
        this.offsetY=0;

    }



    drawGrid(width,height){

        this.ctx.save();

        this.apply(v=>{});


        const size=this.gridSize;


        this.ctx.beginPath();


        for(
            let x=0;
            x<width;
            x+=size
        ){

            this.ctx.moveTo(x,0);
            this.ctx.lineTo(x,height);

        }


        for(
            let y=0;
            y<height;
            y+=size
        ){

            this.ctx.moveTo(0,y);
            this.ctx.lineTo(width,y);

        }


        this.ctx.stroke();


        this.ctx.restore();

    }

}

window.Viewport=Viewport;
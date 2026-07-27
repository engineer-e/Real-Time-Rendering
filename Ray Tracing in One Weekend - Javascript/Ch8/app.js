class App {
    constructor(canvas,$2) {
        this.canvas = canvas;
        this.$2 = $2

        this.pos = 0;
        this.flip = 1;

        

        this.resize = new Resize({
            canvas: this.canvas,
            $2: this.$2
        });

        this.anim = new Animate({
            canvas: this.canvas,
            $2: this.$2
        });


        this.init();

        
    }

    init() {
        this.resize.load(this.draw.bind(this));
        this.resize.resize();

        this.anim.add_draw(this.draw.bind(this));
        this.anim.add_animate(this.animate.bind(this));

        this.runner = this.anim.createRunner(() => {
            this.anim.load();
        });

        //this.ui = new UI(this.canvas, this.runner);

        window.addEventListener(
            "resize",
            () => this.resize.resize()
        );
    }

    draw() {

        const screen = new Screen({
            canvas: this.canvas,
            $2: this.$2,
            width: 1200
        });

        



    

        const progress = new ProgressUI(this.canvas);


        for (let x = 0; x <= screen.width * 4; x++) {
            for (let y = 0; y <= screen.height; y++) {
                screen.set_pixel({ x, y });
            }
        }

        screen.border_width=10

        var hello_world = new HelloWorld(this.canvas,this.$2,screen)
        hello_world.scanline((x,y,color)=>{
                screen.set_pixel({ x:x, y:y,color:color });
        },(percent,scanline_remaining)=>{
            //console.log("Progress = "+percent + "%, Scanline Remainind = "+scanline_remaining);
            progress.update(percent, scanline_remaining)

        })

        
        progress.close();

        screen.render({});


    }

    animate() {
        if (this.pos >= 400)
            this.flip = -1;

        if (this.pos <= 0)
            this.flip = 1;

        this.pos += this.flip * 2;

        this.$2.fillStyle = "red";
        this.$2.fillRect(this.pos, 100, 100, 100);
    }
}

window.App = App

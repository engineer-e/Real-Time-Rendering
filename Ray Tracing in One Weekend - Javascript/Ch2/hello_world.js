class HelloWorld{
    constructor(canvas,$2,screen){
        console.log("Hello World in Graphics")
        this.canvas = canvas
        this.$2 = $2
        this.screen = screen
    }

    scanline(render,progress){
        var image_width = this.screen.width 
        var image_height = this.screen.height 
         for (var j = 0; j <= image_height; ++j) {
           //std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            progress(Math.floor((j / image_height) * 100),image_height - j);   // Progress %

            for (var i = 0; i <= image_width; i++) {
              var r = (i) / (image_width-1);
              var g = (j) / (image_height-1);
              var b = 0.0;

              var color_ratio = 255.999  
              var ir = Math.round(color_ratio * r);
              var ig = Math.round(color_ratio * g);
              var ib = Math.round(color_ratio * b);
              render(j*4,i,new Color(ir,ig,ib,255))

        }
    }

    console.log( "\rDone.                 \n");
    }

   
    
}
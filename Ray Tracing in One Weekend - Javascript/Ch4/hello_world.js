class HelloWorld{
    constructor(canvas,$2,screen){
        console.log("Hello World in Graphics")
        this.canvas = canvas
        this.$2 = $2
        this.screen = screen
    }

    color(r){
        const unit_direction = Vec3.unit_vector(r.direction());
    const t = 0.5 * (unit_direction.y() + 1.0);
    
    // Lerp formula: (1 - t) * Color1 + t * Color2
    const c1 = Vec3.mul({ t: 1.0 - t, v: new Vec3(1.0, 1.0, 1.0) });
    const c2 = Vec3.mul({ t: t, v: new Vec3(0.5, 0.7, 1.0) });
    
    return Vec3.add(c1, c2);
    }

    write_color(pixel_color){
        var r = pixel_color.x()
        var g = pixel_color.y()
        var b = pixel_color.z()

        // Translate the [0,1] component values to the byte range [0,255].
        var color_ratio = 255.999  

        var ir = Math.round(color_ratio * r);
        var ig = Math.round(color_ratio * g);
        var ib = Math.round(color_ratio * b);
        return new Color(ir,ig,ib,255)
    }

    scanline(render,progress){
        var image_width = this.screen.width 
        var image_height = this.screen.height 

        var lower_left_corner = new Vec3(-2.0,-1.0,-1.0)
        var horizontal = new Vec3(4.0,0.0,0.0)
        var vertical = new Vec3(0.0,2.0,0.0)
        var origin = new Vec3(0.0,0.0,0.0)

        var output = new Vec3(0,0,0)
        
         for (var j = 0; j <= image_height; ++j) {
           //std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            progress(Math.floor((j / image_height) * 100),image_height - j);   // Progress %

            for (var i = 0; i <= image_width; i++) {
              var u = (i) / (image_width-1);
              var v = (image_height-j) / (image_height-1);

              // 1. Calculate u * horizontal and v * vertical
              const u_horiz = Vec3.mul({ t: u, v: horizontal });
              const v_vert  = Vec3.mul({ t: v, v: vertical });
              
              // 2. Add lower_left_corner + (u * horizontal)
              const corner_plus_u = Vec3.add(lower_left_corner, u_horiz);
              
              // 3. Add the result + (v * vertical)
              const direction = Vec3.add(corner_plus_u, v_vert);

              var ray = new Ray(origin, direction)

             // var pixel_color = new Vec3(r,g,b)

              var pixel_color = this.color(ray)


              render(j*4,i,this.write_color(pixel_color))

        }
    }

    console.log( "\rDone.                 \n");
    }

   
    
}
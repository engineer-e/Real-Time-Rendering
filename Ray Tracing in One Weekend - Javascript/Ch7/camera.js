class Camera{
    constructor(){
        this.width=0
        this.height=0
        this.focal_length = 1.0
        this.viewport_height = 2.0
    }

    initialize(){
     /**
        this.height;         // Rendered image height
        this.center;         // Camera center
        this.pixel00_loc;    // Location of pixel 0, 0
        this.pixel_delta_u;  // Offset to pixel to the right
        this.pixel_delta_v;  // Offset to pixel below
         */
      
    
     // Viewport widths less than one are ok since they are real valued.

     // Camera

     
     this.viewport_width = this.viewport_height * ((this.width)/this.height)
     this.camera_center = new Point3(0, 0, 0);

     // Calculate the vectors across the horizontal and down the vertical viewport edges.
     this.viewport_u = new Vec3(this.viewport_width, 0, 0);
     this.viewport_v = new Vec3(0, -this.viewport_height, 0);

     // Calculate the horizontal and vertical delta vectors from pixel to pixel.
     this.pixel_delta_u = Vec3.div(this.viewport_u,this.width);
     this.pixel_delta_v = Vec3.div(this.viewport_v,this.height);

     // Calculate the location of the upper left pixel.
     var viewport_u_half = Vec3.div(this.viewport_u,2)
     var viewport_v_half = Vec3.div(this.viewport_v,2)
     
     this.viewport_upper_left = Vec3.sub(Vec3.sub(Vec3.sub(this.camera_center,new Vec3(0, 0, this.focal_length)),viewport_u_half),viewport_v_half)
     this.pixel00_loc = Vec3.add(this.viewport_upper_left,Vec3.mul({t: 0.5 ,v:Vec3.add(this.pixel_delta_u,this.pixel_delta_v)}));

    }


    ray_color(r, world) {
       var rec = new HitRecord();
       if (world.hit(r, new Interval(0, Number.MAX_VALUE), (temp_rec)=>{rec = temp_rec})) {
          return Vec3.mul({t:0.5,v:Vec3.add(rec.N,new Vec3(1,1,1))})
       }
   
       const unit_direction = Vec3.unit_vector(r.direction());
       const t = 0.5 * (unit_direction.y + 1.0);
       
       // Lerp formula: (1 - t) * Color1 + t * Color2
       const c1 = Vec3.mul({ t: 1.0 - t, v: new Vec3(1.0, 1.0, 1.0) });
       const c2 = Vec3.mul({ t: t, v: new Vec3(0.5, 0.7, 1.0) });
       
       return Vec3.add(c1, c2);
    }

     write_color(pixel_color){
        var r = pixel_color.x
        var g = pixel_color.y
        var b = pixel_color.z

        // Translate the [0,1] component values to the byte range [0,255].
        var color_ratio = 255.999  

        var ir = Math.round(color_ratio * r);
        var ig = Math.round(color_ratio * g);
        var ib = Math.round(color_ratio * b);
        return new Color(ir,ig,ib,255)
    }


    scanline(world,render,progress){
        this.initialize();

        for (var j = 0; j <= this.height; ++j) {
           //std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            progress(Math.floor((j / this.height) * 100),this.height - j);   // Progress %

            for (var i = 0; i <= this.width; i++) {
              
              /** 
               * ========================================================
               * Version 1 - Percantage Based rendering
               * ========================================================
               * var u = (i) / (image_width-1);
              var v = (image_height-j) / (image_height-1);

              // 1. Calculate u * horizontal and v * vertical
              const u_horiz = Vec3.mul({ t: u, v: horizontal });
              const v_vert  = Vec3.mul({ t: v, v: vertical });
              
              // 2. Add lower_left_corner + (u * horizontal)
              const corner_plus_u = Vec3.add(lower_left_corner, u_horiz);
              
              // 3. Add the result + (v * vertical)
              const direction = Vec3.add(corner_plus_u, v_vert);
              */

              /**
               * ========================================================
               * Version 2 - Pixel Center Based rendering
               * ======================================================== 
               */
             
             var pixel_center = Vec3.add(this.pixel00_loc, Vec3.add( Vec3.mul({t:i ,v: this.pixel_delta_u}) , Vec3.mul({t:j ,v: this.pixel_delta_v})));
             var ray_direction = Vec3.sub(pixel_center,this.camera_center)
             var ray = new Ray(this.camera_center, ray_direction)

             // var pixel_color = new Vec3(r,g,b)

              var pixel_color = this.ray_color(ray,world)


              render(j*4,i,this.write_color(pixel_color))

        }
    }

    //console.log( "\rDone.                 \n");

    }
}

window.Camera = Camera
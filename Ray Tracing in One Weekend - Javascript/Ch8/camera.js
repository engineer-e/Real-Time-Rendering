class Camera{
    constructor(){
        this.width=0
        this.height=0
        this.focal_length = 1.0
        this.viewport_height = 2.0
        this.samples_per_pixel =10
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

     this.pixel_samples_scale = 1.0 / this.samples_per_pixel;

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

        var intensity = new Interval(0.000, 0.999)


        // Translate the [0,1] component values to the byte range [0,255].
        var color_ratio = 255.999  

        var ir = Math.round(color_ratio * intensity.clamp(r));
        var ig = Math.round(color_ratio * intensity.clamp(g));
        var ib = Math.round(color_ratio * intensity.clamp(b));
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
             
             //var pixel_center = Vec3.add(this.pixel00_loc, Vec3.add( Vec3.mul({t:i ,v: this.pixel_delta_u}) , Vec3.mul({t:j ,v: this.pixel_delta_v})));
             //var ray_direction = Vec3.sub(pixel_center,this.camera_center)
             //var ray = new Ray(this.camera_center, ray_direction)

               var pixel_color = new Vec3(0,0,0)

              //var pixel_color = this.ray_color(ray,world)

               for (var sample = 0; sample < this.samples_per_pixel; sample++) {
                    var r = this.get_ray(i, j);
                    pixel_color.add_eq(this.ray_color(r, world));
                }


              render(j*4,i,this.write_color(Vec3.mul({v:pixel_color,t:this.pixel_samples_scale})))

        }
    }

    //console.log( "\rDone.                 \n");

    }

    get_ray(i,j){
        // Construct a camera ray originating from the origin and directed at randomly sampled
        // point around the pixel location i, j.

        var offset = this.sample_square();
        var pixel_sample = Vec3.add(this.pixel00_loc, Vec3.add( Vec3.mul({t:i+ offset.x ,v: this.pixel_delta_u}) , Vec3.mul({t:j+ offset.y ,v: this.pixel_delta_v})));
        var ray_origin = this.camera_center;
        var ray_direction = Vec3.sub(pixel_sample,ray_origin);

        return new Ray(ray_origin, ray_direction);
    }

    sample_square()  {
        // Returns the vector to a random point in the [-.5,-.5]-[+.5,+.5] unit square.
        return new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
    }
}

window.Camera = Camera
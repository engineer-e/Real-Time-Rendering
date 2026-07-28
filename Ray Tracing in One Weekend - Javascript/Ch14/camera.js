class Camera{
    constructor(){
        this.width=0
        this.height=0
        this.focal_length = 1.0
        this.viewport_height = 2.0
        this.samples_per_pixel =1
        this.max_depth = 50

        this.vfov = 90  // Vertical view angle (field of view)
        this.lookfrom = new Point3(0,0,0);   // Point camera is looking from
        this.lookat   = new Point3(0,0,-1);  // Point camera is looking at
        this.vup      = new Vec3(0,1,0);     // Camera-relative "up" direction


        this.defocus_angle = 0;  // Variation angle of rays through each pixel
        this.focus_dist = 10;    // Distance from camera lookfrom point to plane of perfect focus


        this.pix=1
        this.pl = 0
        this.Acne = 0.00000001
    }

    initialize(){
     /**
        this.height;         // Rendered image height
        this.center;         // Camera center
        this.pixel00_loc;    // Location of pixel 0, 0
        this.pixel_delta_u;  // Offset to pixel to the right
        this.pixel_delta_v;  // Offset to pixel below
         */

        this.pixel_samples_scale = 1.0 / this.samples_per_pixel;

        this.camera_center = this.lookfrom;

        var theta = Vec3.degrees_to_radians(this.vfov);
        var h = Math.tan(theta/2);
        this.viewport_height = 2 * h * this.focus_dist;
    

     // Viewport widths less than one are ok since they are real valued.

     // Camera

     
     this.viewport_width = this.viewport_height * ((this.width)/this.height)

      
      // Calculate the u,v,w unit basis vectors for the camera coordinate frame.
        this.w = Vec3.unit_vector(Vec3.sub(this.lookfrom,this.lookat));
        this.u = Vec3.unit_vector(Vec3.cross(this.vup, this.w));
        this.v = Vec3.cross(this.w, this.u);


     

     // Calculate the vectors across the horizontal and down the vertical viewport edges.
     
    //  this.viewport_u = new Vec3(this.viewport_width, 0, 0);
    //  this.viewport_v = new Vec3(0, -this.viewport_height, 0);

     this.viewport_u = Vec3.mul({t:this.viewport_width ,v: this.u});    // Vector across viewport horizontal edge
     this.viewport_v = Vec3.mul({t:this.viewport_height ,v: this.v.neg()});  // Vector down viewport vertical edge

     // Calculate the horizontal and vertical delta vectors from pixel to pixel.
     this.pixel_delta_u = Vec3.div(this.viewport_u,this.width);
     this.pixel_delta_v = Vec3.div(this.viewport_v,this.height);

     // Calculate the location of the upper left pixel.
     var viewport_u_half = Vec3.div(this.viewport_u,2)
     var viewport_v_half = Vec3.div(this.viewport_v,2)
     
     this.viewport_upper_left = Vec3.sub(Vec3.sub(Vec3.sub(this.camera_center,Vec3.mul({t:this.focus_dist ,v:this.w})),viewport_u_half),viewport_v_half)
     this.pixel00_loc = Vec3.add(this.viewport_upper_left,Vec3.mul({t: 0.5 ,v:Vec3.add(this.pixel_delta_u,this.pixel_delta_v)}));


      // Calculate the camera defocus disk basis vectors.
        var defocus_radius = this.focus_dist * Math.tan(Vec3.degrees_to_radians(this.defocus_angle / 2));
        this.defocus_disk_u = Vec3.mul({v:this.u, t:defocus_radius});
        this.defocus_disk_v = Vec3.mul({v:this.v, t:defocus_radius});

    }


    ray_color(r, depth, world) {
 // If we've exceeded the ray bounce limit, no more light is gathered.
        if(depth<=0){
            return new Vec3(0,0,0)
        }

       var rec = new HitRecord();
       if (world.hit(r, new Interval(this.Acne, Number.MAX_VALUE), (temp_rec)=>{
        rec = temp_rec;
        //console.log("in ",rec.N);
})) {
         // console.log("out ",rec.N);
          //var direction = Vec3.random_on_hemisphere(rec.N) 
          //return Vec3.mul({t:0.5,v:Vec3.add(rec.N,new Vec3(1,1,1))})
          //var direction = Vec3.add(rec.N , Vec3.random_unit_vector());

          //return Vec3.mul({t:0.5,v:this.ray_color(new Ray(rec.p,direction),depth-1,world)})
       
    
           rec.material.scatter(r,rec,(attenuation)=>{
            this.attenuation=attenuation},(scattered)=>{this.scattered=scattered                
            },(isScatter)=>{
                this.isScatter = isScatter
                 
          
            })

            return Vec3.mul({u:this.attenuation,v:this.ray_color(this.scattered,depth-1,world)})

        //     if(this.isScatter){
        //           return Vec3.mul({u:this.attenuation,v:this.ray_color(this.scattered,depth-1,world)})
        //       }else{
        //      return new Vec3(0,0,0)
        //    }
                     //return Vec3.mul({u:this.attenuation,v:this.ray_color(this.scattered,depth-1,world)})


        // return new Vec3(0,0,0) // Color
       
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

        // Apply a linear to gamma transform for gamma 2
        r = this.linear_to_gamma(r);
        g = this.linear_to_gamma(g);
        b = this.linear_to_gamma(b);


        var intensity = new Interval(0.000, 0.999)


        // Translate the [0,1] component values to the byte range [0,255].
        var color_ratio = 255.999  

        var ir = Math.round(color_ratio * intensity.clamp(r));
        var ig = Math.round(color_ratio * intensity.clamp(g));
        var ib = Math.round(color_ratio * intensity.clamp(b));
        return new Color(ir,ig,ib,255)
    }


    linear_to_gamma(linear_component){
        if (linear_component > 0)
           return Math.sqrt(linear_component);

        return 0;
    }

    scanline(world,render,progress){
        this.initialize();
         
        this.ui = 0
        this.vi = 0
        this.uj = 0
        this.vj = 0
        
        
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
                    if( (i%this.pix == this.pl) || (j%this.pix==this.pl) ){
            
                     this.ui = i
                     this.vi = j 
                     var r = this.get_ray(i, j);
                     pixel_color.add_eq(this.ray_color(r,this.max_depth, world));

                    }else{
                     r = this.get_ray(this.ui, this.vi);
                     pixel_color.add_eq(this.ray_color(r,this.max_depth, world));
                    }
                }
               
                 render(j*4,i,this.write_color(Vec3.mul({v:pixel_color,t:this.pixel_samples_scale})))


            //     if( (i%this.pix == this.pl)  (j%this.pix==this.pl) ){

            //     this.uj = j*4
            //     this.vj = i    
            //     render(j*4,i,this.write_color(Vec3.mul({v:pixel_color,t:this.pixel_samples_scale})))
            //    }
            //     else{
            //       render(this.uj,this.vj,this.write_color(Vec3.mul({v:pixel_color,t:this.pixel_samples_scale})))
                    
            //     }
        }
    }

    //console.log( "\rDone.                 \n");

    }

    get_ray(i,j){
        // Construct a camera ray originating from the origin and directed at randomly sampled
        // point around the pixel location i, j.

        var offset = this.sample_square();
        var pixel_sample = Vec3.add(this.pixel00_loc, Vec3.add( Vec3.mul({t:i+ offset.x ,v: this.pixel_delta_u}) , Vec3.mul({t:j+ offset.y ,v: this.pixel_delta_v})));
        //var ray_origin = this.camera_center;
        var ray_origin = (this.defocus_angle <= 0) ? this.camera_center : this.defocus_disk_sample();
        var ray_direction = Vec3.sub(pixel_sample,ray_origin);

        return new Ray(ray_origin, ray_direction);
    }

    sample_square()  {
        // Returns the vector to a random point in the [-.5,-.5]-[+.5,+.5] unit square.
        return new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
    }

    defocus_disk_sample()  {
        // Returns a random point in the camera defocus disk.
        var p = Vec3.random_in_unit_disk();
        var a1 = Vec3.mul({t:p.e[1],v:this.defocus_disk_v})
        var a2 = Vec3.mul({t:p.e[0],v:this.defocus_disk_u})
        var a3 = Vec3.add(a1,a2)
        return Vec3.add(this.camera_center,a3);
    }
}

window.Camera = Camera
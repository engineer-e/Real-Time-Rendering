class HelloWorld{
    constructor(canvas,$2,screen){
        console.log("Hello World in Graphics")
        this.canvas = canvas
        this.$2 = $2
        this.screen = screen
    }

    /*
    hit_sphere(center,  radius,   r) {
        var oc = Vec3.sub(center,r.origin())
        var a = Vec3.dot(r.direction(), r.direction());
        var b = -2.0 *  Vec3.dot(r.direction(), oc);
        var c = Vec3.dot(oc, oc) - radius*radius;
        var discriminant = b*b - 4*a*c;
        
        if(discriminant<0){
            return -1.0
        }else{
            return (-b - Math.sqrt(discriminant))/(2.0*a)
        }


    }*/

    hit_sphere(center,  radius,  r) {
        var oc = Vec3.sub(center,r.origin())
        var a = r.direction().length_squared();
        var h = Vec3.dot(r.direction(), oc);
        var c = oc.length_squared() - radius*radius;
        var discriminant = h*h - a*c;
    
        if (discriminant < 0) {
            return -1.0;
        } else {
            return (h - Math.sqrt(discriminant)) / a;
        }
    }


    ray_color(r){

        var isHit = this.hit_sphere(new Vec3(0,0,-1), 0.5, r)

        if(isHit>0.0){
            var N = Vec3.unit_vector(Vec3.sub(r.at(isHit),new Vec3(0,0,-1)))
            return Vec3.mul({t:0.5,v:new Vec3(N.x()+1,N.y()+1,N.z()+1)})
        }
    
    
        const unit_direction = Vec3.unit_vector(r.direction());
        const t = 0.5 * (unit_direction.y() + 1.0);
        
        // Lerp formula: (1 - t) * Color1 + t * Color2
        const c1 = Vec3.mul({ t: 1.0 - t, v: new Vec3(1.0, 1.0, 1.0) });
        const c2 = Vec3.mul({ t: t, v: new Vec3(0.5, 0.7, 1.0) });
        
        return Vec3.add(c1, c2);
    }

    ray_color(r, world) {
    var rec = new HitRecord();
    if (world.hit(r, new Interval(0, Number.MAX_VALUE), (temp_rec)=>{rec = temp_rec})) {
       return Vec3.mul({t:0.5,v:Vec3.add(rec.N,new Vec3(1,1,1))})
    }

    
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


          // World

    var objects = [new Sphere(new Point3(0,0,-1), 0.5),new Sphere(new Point3(0,-100.5,-1), 100)]
    var world = new HittableList(objects);


        
    for (var j = 0; j <= image_height; ++j) {
           //std::clog << "\rScanlines remaining: " << (image_height - j) << ' ' << std::flush;
            progress(Math.floor((j / image_height) * 100),image_height - j);   // Progress %

            for (var i = 0; i <= image_width; i++) {
              
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
             
             var pixel_center = Vec3.add(this.screen.pixel00_loc, Vec3.add( Vec3.mul({t:i ,v: this.screen.pixel_delta_u}) , Vec3.mul({t:j ,v: this.screen.pixel_delta_v})));
             var ray_direction = Vec3.sub(pixel_center,this.screen.camera_center)
             var ray = new Ray(this.screen.camera_center, ray_direction)

             // var pixel_color = new Vec3(r,g,b)

              var pixel_color = this.ray_color(ray,world)


              render(j*4,i,this.write_color(pixel_color))

        }
    }

    console.log( "\rDone.                 \n");
    }

   
    
}
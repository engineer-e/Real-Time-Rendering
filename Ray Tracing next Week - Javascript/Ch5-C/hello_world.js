
class HelloWorld{
    constructor(canvas,$2,screen){
        console.log("Hello World in Graphics")
        this.canvas = canvas
        this.$2 = $2
        this.screen = screen

    //     this.viewport = new Viewport(
    //     this.canvas,
    //     this.$2
    //    );

       


  
        this.gui = new GUI();
        this.gui.add( document, 'title' );
        this.camera_ctrl = this.gui.addFolder( 'Camera' );
        this.step = 0.01
        this.translate_range = 120

        

    }

   

    objectUi(update){
        this.object_ctrl = this.gui.addFolder( 'Object' );
        for(var object in this.objects){
            var obj = this.objects[object]
            this.obj_ctrl = this.object_ctrl.addFolder( obj.constructor.name+"-"+object );
            this.obj_translate =  this.obj_ctrl.addFolder("Translate");

            this.obj_translate.add(obj.center.A,'x',-this.translate_range, this.translate_range,this.step).name("x").onChange(update)
            this.obj_translate.add(obj.center.A,'y',-this.translate_range, this.translate_range,this.step).name("y").onChange(update)
            this.obj_translate.add(obj.center.A,'z',-this.translate_range, this.translate_range,this.step).name("z").onChange(update)
            

            this.obj_ctrl.add(obj,'radius',0, obj.radius,this.step).onChange(update)
        }
    }

    cam_ct(obj,name,update){
        this.object_ctrl = this.camera_ctrl.addFolder( name );
        this.obj_translate =  this.object_ctrl.addFolder("Translate");
        this.obj_translate.add(obj,'x',-10, 10,this.step).name("x").onChange(update)
        this.obj_translate.add(obj,'y',-10, 10,this.step).name("y").onChange(update)
        this.obj_translate.add(obj,'z',-10, 10,this.step).name("z").onChange(update)
            

    }


    bouncing_spheres(){
          this.objects=[]
        
        var checkTexture = new CheckerTexture({scale:0.32,c1:new Vec3(.2,0.3,0.1),c2:new Vec3(.9,.9,.9)})
        var ground_material = new Lamberiant({albedo:new Vec3(0.5, 0.5, 0.5),tex:checkTexture});
        this.objects.push(new Sphere({center1:new Point3(0,-1000,0), radius:1000, material:ground_material}));


        var count = 110

        for (var a = -count; a < count; a++) {
         for (var b = -count; b < count; b++) {
         var choose_mat = Math.random()
         var center = new Point3(a+0.9*Math.random(), 0.2, b+0.9*Math.random())

         var condition = Vec3.sub(center,new Point3(4,0.2,0)).length() > 0.9
         if(condition){
             

             if(choose_mat < 0.8){
                //diffuse 
                var albedo = Vec3.mul({u:Vec3.random(-1,1),v:Vec3.random(-1,1)})
                this.sphere_material = new Lamberiant({albedo:albedo})
                var center2 = Vec3.add(center , new Vec3(0, Vec3.random_double(0,.5), 0));

                 this.objects.push(new Sphere({center1:center,center2:center2, radius:0.2, material:this.sphere_material}));


             }
             else if (choose_mat < 0.95){
                //diffuse 
                var albedo = Vec3.random(0.5,1)
                var fuzz = Vec3.random_double(0, 0.5)
                this.sphere_material = new Metal(albedo,fuzz)
                this.objects.push(new Sphere({center1:center, radius:0.2, material:this.sphere_material}));

             }
             else {

                this.sphere_material = new Dielectric(1.5)
                this.objects.push(new Sphere({center1:center, radius:0.2, material:this.sphere_material}));

             }
         }


         }
        }



       var material1 = new Dielectric(1.5);
       this.objects.push( new Sphere({center1:new Point3(0, 1, 0), radius:1.0, material:material1}));

        var material2 = new Lamberiant({albedo:new Vec3(0.4, 0.2, 0.1)});
       this.objects.push( new Sphere({center1:new Point3(-4, 1, 0), radius:1.0, material:material2}));

        var material3 = new Metal(new Vec3(0.7, 0.6, 0.5),0.0);
        this.objects.push( new Sphere({center1:new Point3(4, 1, 0), radius:1.0, material:material3}));



        //var bvh = new BVH_Node(this.objects)



    
    }
  
    checkered_spheres(){
        this.objects=[]

        var checkTexture = new CheckerTexture({scale:0.32,c1:new Vec3(.2,0.3,0.1),c2:new Vec3(.9,.9,.9)})
        var ground_material = new Lamberiant({albedo:new Vec3(0.5, 0.5, 0.5),tex:imageTexture});
        this.objects.push(new Sphere({center1:new Point3(0,-10,0), radius:10, material:ground_material}));
        this.objects.push(new Sphere({center1:new Point3(0, 10,0), radius:10, material:ground_material}));
        
        
    }
    


    earth(){

    this.objects = [];


    const imageTexture =
        new ImageTexture(
            "https://raytracing.github.io/images/earthmap.jpg"
            
        );


    // wait until pixels are ready
    //await imageTexture.ready;



    const earthMaterial =
        new Lamberiant({
            albedo:new Vec3(0.0,0.0,0.0),
            tex:imageTexture
        });



    this.objects.push(

        new Sphere({

            center1:new Point3(0,0,0),

            radius:2,

            material:earthMaterial
        })

    );
}

    perlin_spheres(){
      
        this.objects=[]

        var perlinTexture = new NoiseTexture()
        var ground_material = new Lamberiant({albedo:new Vec3(0, 1, 0),tex:perlinTexture});

        this.objects.push(new Sphere({center1:new Point3(0,-1000,0), radius:1000, material:ground_material}));
        this.objects.push(new Sphere({center1:new Point3(0, 2,0), radius:2, material:ground_material}));
        

    }


    // earth(){
    //     this.objects=[]

    //     var imageTexture = new ImageTexture("https://raytracing.github.io/images/earthmap.jpg")
    //     await imageTexture.load();

        

    //     var ground_material = new Lamberiant({albedo:new Vec3(0.5, 0.5, 0.5),tex:imageTexture});
    //     this.objects.push(new Sphere({center1:new Point3(0,0,0), radius:2, material:ground_material}));
        
        
    // }
    
   
   async  scanline(render,progress){
        this.image_width = this.screen.width 
        this.image_height = this.screen.height 

        /*
        var ground_material = new Lamberiant(new Vec3(0.8,0.8,0.0))
        var center_material = new Lamberiant(new Vec3(0.1,0.2,0.5))
        var left_material = new Dielectric(1.50)
        var material_bubble = new Dielectric(1.00 / 1.50);
        var right_material = new Metal(new Vec3(0.8,0.6,0.2),1.0)
        

        // World
        this.objects = [
            
            new Sphere(new Point3(0,-100.5,-1), 100,ground_material),
            new Sphere(new Point3( 0.0,    0.0, -1.2),.5,center_material),
            new Sphere(new Point3(-1.0,    0.0, -1.0),.5,left_material),
            new Sphere(new Point3(-1.0,    0.0, -1.0),.4,material_bubble),
            new Sphere(new Point3(1.0,    0.0, -1.0),.5,right_material),


        ]


        var R = Math.cos(Math.PI/4);
        var material_left  = new Lamberiant(new Vec3(0,0,1.0))
        var material_right = new Lamberiant(new Vec3(1.0,0,0))
        // this.objects = [
        //  new Sphere(new Point3(-R, 0, -1),R,material_left),
        //  new Sphere(new Point3( R, 0, -1),R,material_right)
        // ]

        */



        var cam = new Camera() 


        //this.bouncing_spheres()
        //this.checkered_spheres()
        //await  this.earth()
        this.perlin_spheres()



        

        this.world = new BVH_Node(this.objects);

       // Camera
       cam.width = this.image_width
       cam.height = this.image_height

        cam.vfov     = 20;
    // cam.lookfrom =  new Point3(-2,2,1);
    // cam.lookat   = new Point3(0,0,-1);
    // cam.vup      = new Vec3(0,3,0);

    // cam.defocus_angle = 10.0;
    // cam.focus_dist    = 3.4;

    cam.lookfrom = new Point3(13,2,3);
    cam.lookat   = new Point3(0,0,0);
    cam.vup      = new Vec3(0,1,0);

    cam.defocus_angle = 0.6;
    cam.focus_dist    = 10.0;
      
       
       var update = ()=>{
        cam.scanline(this.world,(i,j,c)=>{render(i,j,c)},(i,j)=>{progress(i,j)})
        this.screen.render({});
       }









       this.camera_ctrl.add( cam, 'focal_length', 0, 1,this.step ).name("Focal Length").onChange(update)      
       this.camera_ctrl.add( cam, 'viewport_height', 0, 2, this.step ).name("Viewport Height").onChange(update); 
       this.camera_ctrl.add( cam, 'vfov', 0, 180, 1 ).name("Field of View (Fov)").onChange(update); 
       this.camera_ctrl.add( cam, 'samples_per_pixel', 0, 100, 1 ).name("Samples Per Pixel").onChange(update); 
       this.camera_ctrl.add( cam, 'max_depth', 0, 100, 1 ).name("Max Depth").onChange(update); 
       this.camera_ctrl.add( cam, 'pl', 0, 100,1).name("Ray Hit Pixel").onChange(update); 
       this.camera_ctrl.add( cam, 'pix', 0, 100, 1 ).name("Pixalated").onChange(update); 
       this.camera_ctrl.add( cam, 'Acne').name("Acne - Performance").onChange(update); 

       this.cam_ct(cam.lookfrom, "Look From",update )
       this.cam_ct(cam.lookat, "Look At",update )
       this.cam_ct(cam.vup, "View up",update )
       


       

       

      // this.objectUi(update)

       cam.scanline(this.world,(i,j,c)=>{render(i,j,c)},(i,j)=>{progress(i,j)})

        

    //     this.viewport.drawGrid(
    //     screen.width,
    //     screen.height
    //   );

       //this.viewport.apply(update);

        
        
    }

   
    
}
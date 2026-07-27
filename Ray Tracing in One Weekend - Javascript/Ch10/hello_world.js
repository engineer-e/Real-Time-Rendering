
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

            this.obj_translate.add(obj.center,'x',-this.translate_range, this.translate_range,this.step).name("x").onChange(update)
            this.obj_translate.add(obj.center,'y',-this.translate_range, this.translate_range,this.step).name("y").onChange(update)
            this.obj_translate.add(obj.center,'z',-this.translate_range, this.translate_range,this.step).name("x").onChange(update)
            

            this.obj_ctrl.add(obj,'radius',0, obj.radius,this.step).onChange(update)
        }
    }
  

    
   
    scanline(render,progress){
        var image_width = this.screen.width 
        var image_height = this.screen.height 

        
        var ground_material = new Lamberiant(new Vec3(0.8,0.8,0.0))
        var center_material = new Lamberiant(new Vec3(0.1,0.2,0.5))
        var left_material = new Metal(new Vec3(0.8,0.8,0.8))
        var right_material = new Metal(new Vec3(0.8,0.6,0.2))
        

        // World
        this.objects = [
            
            new Sphere(new Point3(0,-100.5,-1), 100,ground_material),
            new Sphere(new Point3( 0.0,    0.0, -1.2),.5,center_material),
            new Sphere(new Point3(-1.0,    0.0, -1.0),.5,left_material),
            new Sphere(new Point3(1.0,    0.0, -1.0),.5,right_material),


        ]
        var world = new HittableList(this.objects);

       // Camera
       var cam = new Camera() 
       cam.width = image_width
       cam.height = image_height
       
       var update = ()=>{
        cam.scanline(world,(i,j,c)=>{render(i,j,c)},(i,j)=>{progress(i,j)})
        this.screen.render({});
       }

       this.camera_ctrl.add( cam, 'focal_length', 0, 1,this.step ).name("Focal Length").onChange(update)      
       this.camera_ctrl.add( cam, 'viewport_height', 0, 2, this.step ).name("Viewport Height").onChange(update); 
       this.camera_ctrl.add( cam, 'samples_per_pixel', 0, 100, 1 ).name("Samples Per Pixel").onChange(update); 
       this.camera_ctrl.add( cam, 'max_depth', 0, 100, 1 ).name("Max Depth").onChange(update); 
       this.camera_ctrl.add( cam, 'pl', 0, 100,1).name("Ray Hit Pixel").onChange(update); 
       this.camera_ctrl.add( cam, 'pix', 0, 100, 1 ).name("Pixalated").onChange(update); 
       this.camera_ctrl.add( cam, 'Acne').name("Acne - Performance").onChange(update); 
       


       

       

       this.objectUi(update)

       cam.scanline(world,(i,j,c)=>{render(i,j,c)},(i,j)=>{progress(i,j)})

        

    //     this.viewport.drawGrid(
    //     screen.width,
    //     screen.height
    //   );

       //this.viewport.apply(update);

        
        
    }

   
    
}
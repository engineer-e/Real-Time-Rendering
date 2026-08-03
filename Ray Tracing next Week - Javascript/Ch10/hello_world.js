class HelloWorld {
  constructor(canvas, $2, screen) {
    console.log("Hello World in Graphics");
    this.canvas = canvas;
    this.$2 = $2;
    this.screen = screen;

    //     this.viewport = new Viewport(
    //     this.canvas,
    //     this.$2
    //    );

    this.gui = new GUI();
    this.gui.add(document, "title");
    this.camera_ctrl = this.gui.addFolder("Camera");
    this.step = 0.01;
    this.translate_range = 120;
  }

  objectUi(update) {
    this.object_ctrl = this.gui.addFolder("Object");
    for (var object in this.objects) {
      var obj = this.objects[object];
      this.obj_ctrl = this.object_ctrl.addFolder(
        obj.constructor.name + "-" + object,
      );
      this.obj_translate = this.obj_ctrl.addFolder("Translate");

      this.obj_translate
        .add(
          obj.center.A,
          "x",
          -this.translate_range,
          this.translate_range,
          this.step,
        )
        .name("x")
        .onChange(update);
      this.obj_translate
        .add(
          obj.center.A,
          "y",
          -this.translate_range,
          this.translate_range,
          this.step,
        )
        .name("y")
        .onChange(update);
      this.obj_translate
        .add(
          obj.center.A,
          "z",
          -this.translate_range,
          this.translate_range,
          this.step,
        )
        .name("z")
        .onChange(update);

      this.obj_ctrl
        .add(obj, "radius", 0, obj.radius, this.step)
        .onChange(update);
    }
  }

  cam_ct(obj, name, update) {
    this.object_ctrl = this.camera_ctrl.addFolder(name);
    this.obj_translate = this.object_ctrl.addFolder("Translate");
    this.obj_translate
      .add(obj, "x", -10, 10, this.step)
      .name("x")
      .onChange(update);
    this.obj_translate
      .add(obj, "y", -10, 10, this.step)
      .name("y")
      .onChange(update);
    this.obj_translate
      .add(obj, "z", -10, 10, this.step)
      .name("z")
      .onChange(update);
  }

  bouncing_spheres() {
    this.objects = [];

    var checkTexture = new CheckerTexture({
      scale: 0.32,
      c1: new Vec3(0.2, 0.3, 0.1),
      c2: new Vec3(0.9, 0.9, 0.9),
    });
    var ground_material = new Lamberiant({
      albedo: new Vec3(0.5, 0.5, 0.5),
      tex: checkTexture,
    });
    this.objects.push(
      new Sphere({
        center1: new Point3(0, -1000, 0),
        radius: 1000,
        material: ground_material,
      }),
    );

    var count = 110;

    for (var a = -count; a < count; a++) {
      for (var b = -count; b < count; b++) {
        var choose_mat = Math.random();
        var center = new Point3(
          a + 0.9 * Math.random(),
          0.2,
          b + 0.9 * Math.random(),
        );

        var condition = Vec3.sub(center, new Point3(4, 0.2, 0)).length() > 0.9;
        if (condition) {
          if (choose_mat < 0.8) {
            //diffuse
            var albedo = Vec3.mul({
              u: Vec3.random(-1, 1),
              v: Vec3.random(-1, 1),
            });
            this.sphere_material = new Lamberiant({ albedo: albedo });
            var center2 = Vec3.add(
              center,
              new Vec3(0, Vec3.random_double(0, 0.5), 0),
            );

            this.objects.push(
              new Sphere({
                center1: center,
                center2: center2,
                radius: 0.2,
                material: this.sphere_material,
              }),
            );
          } else if (choose_mat < 0.95) {
            //diffuse
            var albedo = Vec3.random(0.5, 1);
            var fuzz = Vec3.random_double(0, 0.5);
            this.sphere_material = new Metal(albedo, fuzz);
            this.objects.push(
              new Sphere({
                center1: center,
                radius: 0.2,
                material: this.sphere_material,
              }),
            );
          } else {
            this.sphere_material = new Dielectric(1.5);
            this.objects.push(
              new Sphere({
                center1: center,
                radius: 0.2,
                material: this.sphere_material,
              }),
            );
          }
        }
      }
    }

    var material1 = new Dielectric(1.5);
    this.objects.push(
      new Sphere({
        center1: new Point3(0, 1, 0),
        radius: 1.0,
        material: material1,
      }),
    );

    var material2 = new Lamberiant({ albedo: new Vec3(0.4, 0.2, 0.1) });
    this.objects.push(
      new Sphere({
        center1: new Point3(-4, 1, 0),
        radius: 1.0,
        material: material2,
      }),
    );

    var material3 = new Metal(new Vec3(0.7, 0.6, 0.5), 0.0);
    this.objects.push(
      new Sphere({
        center1: new Point3(4, 1, 0),
        radius: 1.0,
        material: material3,
      }),
    );

    //var bvh = new BVH_Node(this.objects)
  }

  checkered_spheres() {
    this.objects = [];

    var checkTexture = new CheckerTexture({
      scale: 0.32,
      c1: new Vec3(0.2, 0.3, 0.1),
      c2: new Vec3(0.9, 0.9, 0.9),
    });
    var ground_material = new Lamberiant({
      albedo: new Vec3(0.5, 0.5, 0.5),
      tex: checkTexture,
    });

    this.objects.push(
      new Sphere({
        center1: new Point3(0, -10, 0),
        radius: 10,
        material: ground_material,
      }),
    );
    this.objects.push(
      new Sphere({
        center1: new Point3(0, 10, 0),
        radius: 10,
        material: ground_material,
      }),
    );
  }

  async earth() {
    this.objects = [];

    const imageTexture = new ImageTexture(
      "https://raytracing.github.io/images/earthmap.jpg",
    );

    // wait until pixels are ready
    await imageTexture.ready;

    const earthMaterial = new Lamberiant({
      albedo: new Vec3(0.0, 0.0, 0.0),
      tex: imageTexture,
    });

    this.objects.push(
      new Sphere({
        center1: new Point3(0, 0, 0),

        radius: 2,

        material: earthMaterial,
      }),
    );
  }

  perlin_spheres() {
    this.objects = [];

    this.perlinTexture = new NoiseTexture(4);
    var ground_material = new Lamberiant({
      albedo: new Vec3(0, 1, 0),
      tex: this.perlinTexture,
    });

    this.objects.push(
      new Sphere({
        center1: new Point3(0, -1000, 0),
        radius: 1000,
        material: ground_material,
      }),
    );
    this.objects.push(
      new Sphere({
        center1: new Point3(0, 2, 0),
        radius: 2,
        material: ground_material,
      }),
    );
  }

  quads() {
    this.objects = [];

    var checkTexture = new CheckerTexture({
      scale: 0.32,
      c1: new Vec3(0.2, 0.3, 0.1),
      c2: new Vec3(0.9, 0.9, 0.9),
    });

    // Materials
    var left_red = new Lamberiant({ albedo: new Vec3(1.0, 0.2, 0.2) });
    var back_green = new Lamberiant({ albedo: new Vec3(0.2, 1.0, 0.2) });
    var right_blue = new Lamberiant({ albedo: new Vec3(0.2, 0.2, 1.0) });
    var upper_orange = new Lamberiant({ albedo: new Vec3(1.0, 0.5, 0.0) });
    var lower_teal = new Lamberiant({ albedo: new Vec3(0.2, 0.8, 0.8) });

    // Quads
    var left = new Quad(
      new Point3(-3, -2, 5),
      new Point3(0, 0, -4),
      new Vec3(0, 4, 0),
      left_red,
    );
    var back = new Quad(
      new Point3(-2, -2, 0),
      new Point3(4, 0, 0),
      new Vec3(0, 4, 0),
      back_green,
    );
    var right = new Quad(
      new Point3(3, -2, 1),
      new Point3(0, 0, 4),
      new Vec3(0, 4, 0),
      right_blue,
    );
    var upper = new Quad(
      new Point3(-2, 3, 1),
      new Point3(4, 0, 0),
      new Vec3(0, 0, 4),
      upper_orange,
    );
    var lower = new Quad(
      new Point3(-2, -3, 5),
      new Point3(4, 0, 0),
      new Vec3(0, 0, -4),
      lower_teal,
    );

    this.objects = [left, back, right, upper, lower];
  }

  simple_light() {
    this.objects = [];

    this.perlinTexture = new NoiseTexture(4);
    var ground_material = new Lamberiant({
      albedo: new Vec3(0, 1, 0),
      tex: this.perlinTexture,
    });

    this.objects.push(
      new Sphere({
        center1: new Point3(0, -1000, 0),
        radius: 1000,
        material: ground_material,
      }),
    );
    this.objects.push(
      new Sphere({
        center1: new Point3(0, 2, 0),
        radius: 2,
        material: ground_material,
      }),
    );

    var diffLight = new DiffuseLight({ emit: new Vec3(4, 4, 4) });

    this.objects.push(
      new Sphere({
        center1: new Point3(0, 7, 0),
        radius: 2,
        material: diffLight,
      }),
    );

    this.objects.push(
      new Quad(
        new Point3(3, 1, -2),
        new Vec3(2, 0, 0),
        new Vec3(0, 2, 0),
        diffLight,
      ),
    );
  }

  cornell_box() {
    this.objects = [];

    var red = new Lamberiant({ albedo: new Vec3(0.65, 0.05, 0.05) });
    var white = new Lamberiant({ albedo: new Vec3(0.73, 0.73, 0.73) });
    var green = new Lamberiant({ albedo: new Vec3(0.12, 0.45, 0.15) });
    var light = new DiffuseLight({ emit: new Vec3(15, 15, 15) });

    var size = 555;
    var xyz = new Vec3(size, size, size);
    var o = new Vec3(0, 0, 0);
    var px = new Vec3(size, 0, 0);
    var py = new Vec3(0, size, 0);
    var pz = new Vec3(0, 0, size);
    var nx = new Vec3(-size, 0, 0);
    var ny = new Vec3(0, -size, 0);
    var nz = new Vec3(0, 0, -size);

    this.objects.push(new Quad(px, py, pz, green));
    this.objects.push(new Quad(o, py, pz, red));
    this.objects.push(
      new Quad(
        new Vec3(343, 554, 332),
        new Vec3(-130, 0, 0),
        new Vec3(0, 0, -105),
        light,
      ),
    );
    this.objects.push(new Quad(o, px, pz, white));
    this.objects.push(new Quad(xyz, nx, nz, white));
    this.objects.push(new Quad(pz, px, py, white));

    var box1 = Quad.box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
    box1 = new RotateY(box1, 15);
    box1 = new Translate(box1, new Vec3(265, 0, 295));

    this.objects.push(box1);

    var box2 = Quad.box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
    box2 = new RotateY(box2, -18);
    box2 = new Translate(box2, new Vec3(130, 0, 65));

    this.objects.push(box2);
  }

  cornell_smoke() {
    this.objects = [];

    var red = new Lamberiant({ albedo: new Vec3(0.65, 0.05, 0.05) });
    var white = new Lamberiant({ albedo: new Vec3(0.73, 0.73, 0.73) });
    var green = new Lamberiant({ albedo: new Vec3(0.12, 0.45, 0.15) });
    var light = new DiffuseLight({ emit: new Vec3(15, 15, 15) });

    var size = 555;
    var xyz = new Vec3(size, size, size);
    var o = new Vec3(0, 0, 0);
    var px = new Vec3(size, 0, 0);
    var py = new Vec3(0, size, 0);
    var pz = new Vec3(0, 0, size);
    var nx = new Vec3(-size, 0, 0);
    var ny = new Vec3(0, -size, 0);
    var nz = new Vec3(0, 0, -size);

    this.objects.push(new Quad(px, py, pz, green));
    this.objects.push(new Quad(o, py, pz, red));
    this.objects.push(
      new Quad(
        new Vec3(343, 554, 332),
        new Vec3(-130, 0, 0),
        new Vec3(0, 0, -105),
        light,
      ),
    );
    this.objects.push(new Quad(o, px, pz, white));
    this.objects.push(new Quad(xyz, nx, nz, white));
    this.objects.push(new Quad(pz, px, py, white));

    var box1 = Quad.box(new Point3(0, 0, 0), new Point3(165, 330, 165), white);
    box1 = new RotateY(box1, 15);
    box1 = new Translate(box1, new Vec3(265, 0, 295));

    this.objects.push(box1);

    var box2 = Quad.box(new Point3(0, 0, 0), new Point3(165, 165, 165), white);
    box2 = new RotateY(box2, -18);
    box2 = new Translate(box2, new Vec3(130, 0, 65));

    this.objects.push(box2);

    var smoke_black = new ConstantMedium(box1, 0.01, new Vec3(0, 0, 0));

    var smoke_white = new ConstantMedium(box2, 0.01, new Vec3(1, 1, 1));

    this.objects.push(smoke_black);
    this.objects.push(smoke_white);
  }


  async final_scene() {

    this.objects = [];


    // -------------------------------------------------
    // Ground boxes
    // -------------------------------------------------

    let boxes1 = [];

    let ground = new Lamberiant({
        albedo: new Vec3(0.48, 0.83, 0.53)
    });


    let boxes_per_side = 20;


    for(let i = 0; i < boxes_per_side; i++) {

        for(let j = 0; j < boxes_per_side; j++) {


            let w = 100.0;


            let x0 = -1000 + i * w;
            let z0 = -1000 + j * w;


            let y0 = 0;


            let x1 = x0 + w;
            let y1 = Vec3.random_double(1,101);
            let z1 = z0 + w;



            boxes1.push(
                Quad.box(
                    new Point3(x0,y0,z0),
                    new Point3(x1,y1,z1),
                    ground
                )
            );
        }
    }


    this.objects.push(
        new BVH_Node(boxes1)
    );





    // -------------------------------------------------
    // Light
    // -------------------------------------------------

    let light = new DiffuseLight({
        emit:new Vec3(7,7,7)
    });



    this.objects.push(
        new Quad(
            new Point3(123,554,147),
            new Vec3(300,0,0),
            new Vec3(0,0,265),
            light
        )
    );





    // -------------------------------------------------
    // Moving sphere
    // -------------------------------------------------

    let center1 =
        new Point3(400,400,200);


    let center2 =
        Vec3.add(
            center1,
            new Vec3(30,0,0)
        );


    this.objects.push(

        new Sphere({

            center1:center1,
            center2:center2,

            radius:50,

            material:new Lamberiant({

                albedo:new Vec3(
                    0.7,
                    0.3,
                    0.1
                )

            })

        })

    );





    // -------------------------------------------------
    // Glass sphere
    // -------------------------------------------------

    this.objects.push(

        new Sphere({

            center1:new Point3(
                260,
                150,
                45
            ),

            radius:50,

            material:
                new Dielectric(1.5)

        })

    );






    // -------------------------------------------------
    // Metal sphere
    // -------------------------------------------------

    this.objects.push(

        new Sphere({

            center1:new Point3(
                0,
                150,
                145
            ),

            radius:50,


            material:
                new Metal(
                    new Vec3(
                        0.8,
                        0.8,
                        0.9
                    ),
                    1.0
                )

        })

    );





    // -------------------------------------------------
    // Blue volume sphere
    // -------------------------------------------------

    let boundary = new Sphere({

        center1:new Point3(
            360,
            150,
            145
        ),

        radius:70,


        material:
            new Dielectric(1.5)

    });



    this.objects.push(boundary);



    this.objects.push(

        new ConstantMedium(

            boundary,

            0.2,

            new Vec3(
                0.2,
                0.4,
                0.9
            )

        )

    );





    // -------------------------------------------------
    // Global fog
    // -------------------------------------------------

    boundary = new Sphere({

        center1:new Point3(
            0,
            0,
            0
        ),

        radius:5000,


        material:
            new Dielectric(1.5)

    });



    this.objects.push(

        new ConstantMedium(

            boundary,

            0.0001,

            new Vec3(
                1,
                1,
                1
            )

        )

    );






    // -------------------------------------------------
    // Earth sphere
    // -------------------------------------------------

    let earthTexture =
        new ImageTexture(
            "https://raytracing.github.io/images/earthmap.jpg"
        );


    await earthTexture.ready;



    this.objects.push(

        new Sphere({

            center1:new Point3(
                400,
                200,
                400
            ),

            radius:100,


            material:new Lamberiant({

                tex:earthTexture,

                albedo:new Vec3(
                    0,
                    0,
                    0
                )

            })

        })

    );







    // -------------------------------------------------
    // Perlin noise sphere
    // -------------------------------------------------

    let pertext =
        new NoiseTexture(0.2);



    this.objects.push(

        new Sphere({

            center1:new Point3(
                220,
                280,
                300
            ),


            radius:80,


            material:
                new Lamberiant({

                    tex:pertext

                })

        })

    );







    // -------------------------------------------------
    // Small sphere cluster
    // -------------------------------------------------

    let boxes2 = [];


    let white = new Lamberiant({

        albedo:new Vec3(
            0.73,
            0.73,
            0.73
        )

    });



    let ns = 1000;



    for(let j=0;j<ns;j++){


        boxes2.push(

            new Sphere({

                center1:
                    Point3.random(
                        0,
                        165
                    ),


                radius:10,


                material:white

            })

        );

    }





    let cluster =
        new BVH_Node(boxes2);



    cluster =
        new RotateY(
            cluster,
            15
        );



    cluster =
        new Translate(
            cluster,
            new Vec3(
                -100,
                270,
                395
            )
        );



    this.objects.push(cluster);

}

  // async final_scene() {
  //   this.objects = [];

  //   // Ground boxes
  //   var boxes1 = [];

  //   var ground = new Lamberiant({
  //     albedo: new Vec3(0.48, 0.83, 0.53),
  //   });

  //   var boxes_per_side = 20;

  //   for (var i = 0; i < boxes_per_side; i++) {
  //     for (var j = 0; j < boxes_per_side; j++) {
  //       var w = 100.0;

  //       var x0 = -1000.0 + i * w;
  //       var z0 = -1000.0 + j * w;

  //       var y0 = 0;

  //       var x1 = x0 + w;
  //       var y1 = Vec3.random_double(1, 101);
  //       var z1 = z0 + w;

  //       boxes1.push(
  //         Quad.box(new Point3(x0, y0, z0), new Point3(x1, y1, z1), ground),
  //       );
  //     }
  //   }

  //   // world.add(bvh_node(boxes1))
  //   this.objects.push(new BVH_Node(boxes1));

  //   // Light

  //   var light = new DiffuseLight({
  //     emit: new Vec3(7, 7, 7),
  //   });

  //   this.objects.push(
  //     new Quad(
  //       new Point3(123, 554, 147),
  //       new Vec3(300, 0, 0),
  //       new Vec3(0, 0, 265),
  //       light,
  //     ),
  //   );

  //   // Moving sphere

  //   var center1 = new Point3(400, 400, 200);

  //   var center2 = Vec3.add(center1, new Vec3(30, 0, 0));

  //   var sphere_material = new Lamberiant({
  //     albedo: new Vec3(0.7, 0.3, 0.1),
  //   });

  //   this.objects.push(
  //     new Sphere({
  //       center1: center1,
  //       center2: center2,
  //       radius: 50,
  //       material: sphere_material,
  //     }),
  //   );

  //   // Glass sphere

  //   this.objects.push(
  //     new Sphere({
  //       center1: new Point3(260, 150, 45),
  //       radius: 50,
  //       material: new Dielectric(1.5),
  //     }),
  //   );

  //   // Metal sphere

  //   this.objects.push(
  //     new Sphere({
  //       center1: new Point3(0, 150, 145),
  //       radius: 50,
  //       material: new Metal(new Vec3(0.8, 0.8, 0.9), 1.0),
  //     }),
  //   );

  //   // Volume sphere

  //   var boundary = new Sphere({
  //     center1: new Point3(360, 150, 145),
  //     radius: 70,
  //     material: new Dielectric(1.5),
  //   });

  //   this.objects.push(boundary);

  //   this.objects.push(
  //     new ConstantMedium(boundary, 0.2, new Vec3(0.2, 0.4, 0.9)),
  //   );

    

  //   // World fog

  //   boundary = new Sphere({
  //     center1: new Point3(0, 0, 0),
  //     radius: 5000,
  //     material: new Dielectric(1.5),
  //   });

  //   this.objects.push(new ConstantMedium(boundary, 0.0001, new Vec3(1, 1, 1)));

  //   // Earth sphere

  //   var earthTexture = new ImageTexture("https://raytracing.github.io/images/earthmap.jpg");

  //   await earthTexture.ready;

  //   var emat = new Lamberiant({
  //     tex: earthTexture,
  //     albedo: new Vec3(0, 0, 0),
  //   });

  //   this.objects.push(
  //     new Sphere({
  //       center1: new Point3(400, 200, 400),
  //       radius: 100,
  //       material: emat,
  //     }),
  //   );

  //   // Noise sphere

  //   var pertext = new NoiseTexture(0.2);

  //   this.objects.push(
  //     new Sphere({
  //       center1: new Point3(220, 280, 300),
  //       radius: 80,
  //       material: new Lamberiant({
  //         tex: pertext,
  //       }),
  //     }),
  //   );

  //   // 1000 small spheres

  //   var boxes2 = [];

  //   var white = new Lamberiant({
  //     albedo: new Vec3(0.73, 0.73, 0.73),
  //   });

  //   var ns = 1000;

  //   for (var j = 0; j < ns; j++) {
  //     boxes2.push(
  //       new Sphere({
  //         center1: Point3.random(0, 165),
  //         radius: 10,
  //         material: white,
  //       }),
  //     );
  //   }

  //   var cluster = new BVH_Node(boxes2);

  //   cluster = new RotateY(cluster, 15);

  //   cluster = new Translate(cluster, new Vec3(-100, 270, 395));

  //   this.objects.push(cluster);
  // }

  // earth(){
  //     this.objects=[]

  //     var imageTexture = new ImageTexture("https://raytracing.github.io/images/earthmap.jpg")
  //     await imageTexture.load();

  //     var ground_material = new Lamberiant({albedo:new Vec3(0.5, 0.5, 0.5),tex:imageTexture});
  //     this.objects.push(new Sphere({center1:new Point3(0,0,0), radius:2, material:ground_material}));

  // }

  async scanline(render, progress) {
    this.image_width = this.screen.width;
    this.image_height = this.screen.height;

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

    var cam = new Camera();
    cam.width = this.image_width;
    cam.height = this.image_height;
    cam.vfov = 20;
    cam.lookfrom = new Point3(13, 2, 3);
    cam.lookat = new Point3(0, 0, 0);
    cam.vup = new Vec3(0, 1, 0);

    cam.defocus_angle = 0.6;
    cam.focus_dist = 10.0;

    switch (9) {
      case 0: {
        this.bouncing_spheres();
        break;
      }
      case 1: {
        this.checkered_spheres();
        break;
      }
      case 2: {
        await this.earth();
        break;
      }
      case 3: {
        this.perlin_spheres();
        break;
      }
      case 4: {
        this.quads();
        cam.vfov = 80;
        cam.lookfrom = new Point3(0, 0, 9);
        cam.lookat = new Point3(0, 0, 0);
        cam.vup = new Vec3(0, 1, 0);

        cam.defocus_angle = 0;
        break;
      }
      case 5: {
        this.simple_light();
        cam.background = new Vec3(0, 0, 0);

        cam.vfov = 20;
        cam.lookfrom = new Point3(26, 3, 6);
        cam.lookat = new Point3(0, 2, 0);
        cam.vup = new Vec3(0, 1, 0);

        cam.defocus_angle = 0;
        break;
      }
      case 6: {
        this.cornell_box();
        cam.background = new Vec3(0, 0, 0);

        cam.vfov = 40;
        cam.lookfrom = new Point3(278, 278, -800);
        cam.lookat = new Point3(278, 278, 0);
        cam.vup = new Vec3(0, 1, 0);
        cam.defocus_angle = 0;

        break;
      }
      case 7: {
        this.cornell_smoke();
        cam.background = new Vec3(0, 0, 0);

        cam.vfov = 40;

        cam.lookfrom = new Point3(278, 278, -800);

        cam.lookat = new Point3(278, 278, 0);

        cam.vup = new Vec3(0, 1, 0);

        cam.defocus_angle = 0;
        break;
      }
      case 8: {
        await this.final_scene();

        cam.samples_per_pixel = 10000;
        cam.max_depth = 40;

        cam.background = new Vec3(0, 0, 0);

        cam.vfov = 40;

        cam.lookfrom = new Point3(478, 278, -600);

        cam.lookat = new Point3(278, 278, 0);

        cam.vup = new Vec3(0, 1, 0);

        cam.defocus_angle = 0;

        break;
      }
      default: {
        await this.final_scene();

        cam.samples_per_pixel = 4;
        cam.max_depth = 4;

        cam.background = new Vec3(0, 0, 0);

        cam.vfov = 40;

        cam.lookfrom = new Point3(478, 278, -600);

        cam.lookat = new Point3(278, 278, 0);

        cam.vup = new Vec3(0, 1, 0);

        cam.defocus_angle = 0;

        break;
      }
    }

    console.log(this.objects);

    this.world = new BVH_Node(this.objects);

    // Camera

    // cam.lookfrom =  new Point3(-2,2,1);
    // cam.lookat   = new Point3(0,0,-1);
    // cam.vup      = new Vec3(0,3,0);

    // cam.defocus_angle = 10.0;
    // cam.focus_dist    = 3.4;

    var update = () => {
      cam.scanline(
        this.world,
        (i, j, c) => {
          render(i, j, c);
        },
        (i, j) => {
          progress(i, j);
        },
      );
      this.screen.render({});
    };

    this.camera_ctrl
      .add(cam, "focal_length", 0, 1, this.step)
      .name("Focal Length")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "viewport_height", 0, 2, this.step)
      .name("Viewport Height")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "vfov", 0, 180, 1)
      .name("Field of View (Fov)")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "samples_per_pixel", 0, 10000, 1)
      .name("Samples Per Pixel")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "max_depth", 0, 100, 1)
      .name("Max Depth")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "pl", 0, 100, 1)
      .name("Ray Hit Pixel")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "pix", 0, 100, 1)
      .name("Pixalated")
      .onChange(update);
    this.camera_ctrl
      .add(cam, "Acne")
      .name("Acne - Performance")
      .onChange(update);
    if (this.perlinTexture != null)
      this.camera_ctrl
        .add(this.perlinTexture, "scale", 0, 100, 1)
        .name("Perlin Noise")
        .onChange(update);

    this.cam_ct(cam.lookfrom, "Look From", update);
    this.cam_ct(cam.lookat, "Look At", update);
    this.cam_ct(cam.vup, "View up", update);

    // this.objectUi(update)

    cam.scanline(
      this.world,
      (i, j, c) => {
        render(i, j, c);
      },
      (i, j) => {
        progress(i, j);
      },
    );

    //     this.viewport.drawGrid(
    //     screen.width,
    //     screen.height
    //   );

    //this.viewport.apply(update);
  }
}

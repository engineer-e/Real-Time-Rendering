class Screen{
    constructor({canvas,$2,width=400,height}){
     
     this.canvas = canvas
     this.$2 = $2   

     this.width = width
     this.aspect_ratio = 16.0 / 9.0

     // Calculate the image height, and ensure that it's at least 1.
     this.height = Math.round(this.width/this.aspect_ratio)
     this.height = (this.height < 1)? 1 : this.height

     // Viewport widths less than one are ok since they are real valued.

     // Camera

     this.focal_length = 1.0
     this.viewport_height = 2.0
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
     
     console.log(this.pixel00_loc)
     this.image = this.$2.createImageData(this.width,this.height)
     this.imageData = this.image.data

     this.border_width = 20

    }

    set_pixel({x,y,color=new Color(25,70,25,255)}){

               var row = y
               var col = x
               var width = this.width
               var scan = (col*width)+(row*4)
    
               this.imageData[scan] = color.r
               this.imageData[scan+1] = color.g
               this.imageData[scan+2] = color.b
               this.imageData[scan+3] = color.a
               
    }

    render({x=0,y=0,new_imageData}){
        
        this.$2.fillRect(0,0,this.width+this.border_width, this.height+this.border_width)

        if(new_imageData!=null){
         this.imageData = new_imageData
        }
        var half = +this.border_width/2;

        this.$2.putImageData(this.image,x+half,y+half)


//          for(var i=0;i<=image.width*image.height*4;)
// {
//     imageData[i]=0
//     imageData[i+1]=0
//     imageData[i+2]=0
//     imageData[i+3]=255
    
//     i=i+4
// }

        // //var row = y,var col = x
        // for(var col=0;col<=this.width*4;col++){
        //   for(var row=0;row<=this.height;row++){
                
        //        var width = this.width
        //        var scan = (col*width)+(row*4)
       
        //        this.imageData[scan]=;
        //        this.imageData[scan+1]=255;
        //        this.imageData[scan+2]=0;
        //        this.imageData[scan+3]=255;
        //     }
        // }

    }
    
}

window.Screen = Screen






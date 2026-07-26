class Screen{
    constructor({canvas,$2,width=400,height}){
     
     this.canvas = canvas
     this.$2 = $2   

     this.width = width
     this.aspect_ratio = 16.0 / 9.0

     // Calculate the image height, and ensure that it's at least 1.
     this.height = Math.round(this.width/this.aspect_ratio)
     this.height = (this.height < 1)? 1 : this.height


          
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



    }
    
}

window.Screen = Screen






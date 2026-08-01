class Texture {
    value(u, v, p) {
        throw new Error("Texture.value() must be implemented");
    }
}

class SolidColor extends Texture {
    constructor(albedo) {
        super();
        this.albedo = albedo;
    }

    value(u, v, p) {
        return this.albedo;
    }
}

class CheckerTexture extends Texture {
    constructor({ scale, even, odd, c1, c2 }) {
        super();

        this.inv_scale = 1.0 / scale;

        // Allow either textures or colors
        this.even = even ?? new SolidColor(c1);
        this.odd = odd ?? new SolidColor(c2);
    }

    value(u, v, p) {
        const xInteger = Math.floor(this.inv_scale * p.x);
        const yInteger = Math.floor(this.inv_scale * p.y);
        const zInteger = Math.floor(this.inv_scale * p.z);

        const isEven = ((xInteger + yInteger + zInteger) % 2) === 0;

        return isEven
            ? this.even.value(u, v, p)
            : this.odd.value(u, v, p);
    }
}

class ImageTexture extends Texture {

    constructor(filename) {

        super();

        this.data = null;
        this.width = 0;
        this.height = 0;

        this.image = new Image();

        this.image.crossOrigin = "anonymous";


        this.ready = new Promise((resolve, reject)=>{

            this.image.onload = ()=>{

                // console.log(
                //     "Width:",
                //     this.image.naturalWidth
                // );

                // console.log(
                //     "Height:",
                //     this.image.naturalHeight
                // );


                this.width = this.image.naturalWidth;
                this.height = this.image.naturalHeight;


                const canvas =
                    document.createElement("canvas");


                canvas.width = this.width;
                canvas.height = this.height;


                const ctx =
                    canvas.getContext("2d");


                ctx.drawImage(
                    this.image,
                    0,
                    0
                );


                const pixels =
                    ctx.getImageData(
                        0,
                        0,
                        this.width,
                        this.height
                    );


              this.data = pixels.data;


//                 const debugCanvas = document.createElement("canvas");

// debugCanvas.width = this.width;
// debugCanvas.height = this.height;


// const debugCtx = debugCanvas.getContext("2d");


// const debugImage =
//     new ImageData(
//         this.data,
//         this.width,
//         this.height
//     );


// debugCtx.putImageData(
//     debugImage,
//     0,
//     0
// );


// document.body.appendChild(debugCanvas);


                // console.log(
                //     "RGBA bytes:",
                //     this.data.length
                // );


                resolve();

            };


            this.image.onerror = reject;


            this.image.src = filename;

        });

    }



    pixelData(i,j){

        const index =
            (j*this.width+i)*4;


        return [
            this.data[index],
            this.data[index+1],
            this.data[index+2]
        ];
    }



    value(u, v, p) {

    if (!this.data) {
        return new Vec3(0, 1, 1);
    }


    // Clamp input texture coordinates to [0,1] x [1,0]

    
    u = new Interval({
        min: 0,
        max: 1
    }).clamp(u);
    
    v = 1.0 - new Interval({
        min: 0,
        max: 1
    }).clamp(v);


    // Convert UV to image coordinates
    const i = Math.floor(u * this.width);
    const j = Math.floor(v * this.height);


    const pixel = this.pixelData(i, j);


    const colorScale = 1.0 / 255.999;


    return new Vec3(
        colorScale * pixel[0],
        colorScale * pixel[1],
        colorScale * pixel[2]
    );
  }
}


// class NoiseTexture extends Texture{
//     constructor(){
//         super()
//         this.noise = new Perlin()

//     }

//     value(u, v, p){
//         return Vec3.mul({t:this.noise.noise(p),v:new Vec3(1,1,1)})
//     }

// }

class NoiseTexture extends Texture {

    constructor(scale = 1) {
        super();
        this.scale = scale;
        this.noise = new Perlin();
    }

    value(u, v, p) {
        
        return Vec3.mul({ u: this.noise.turb(p,7), v:  new Vec3(1,1,1)})
    }
}

window.Texture = Texture;
window.SolidColor = SolidColor;
window.CheckerTexture = CheckerTexture;
window.ImageTexture = ImageTexture
window.NoiseTexture = NoiseTexture
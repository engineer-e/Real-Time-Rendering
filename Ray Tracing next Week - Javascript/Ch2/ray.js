class Ray{
    constructor({origin,direction,time=0}){
      //console.log("Time :",time)
      this.A = origin
      this.B = direction
      this.tm = time
    }

     origin(a){this.A = a}

     origin(){return this.A}
     direction(){return this.B}
     time(){return this.tm}

    at(t){
        // Scales vector B by scalar t, then adds origin vector A
    const scaled_dir = Vec3.mul({ t: t, v: this.B });
    return Vec3.add(this.A, scaled_dir);
    
    }
}

window.Ray = Ray